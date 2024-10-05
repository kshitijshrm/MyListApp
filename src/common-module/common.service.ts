import { PlatformRequestContext } from '@foxtrotplatform/developer-platform-core-lib';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { DateTime } from 'luxon';
import { firstValueFrom } from 'rxjs';
import {
  BannerAllResponseDTO,
  BannerDTO,
  BannerLatestResponseDTO,
  BannerResponseDataDTO,
} from 'src/common/dto/common/common.dto';
import { TenantBannersResponseSchemaToDtoMapper } from 'src/common/dto/common/response.dto.mapper';
import { bannerLevelTypeFromJSON } from 'src/shared/schemas/os1/core/coreosagent/request.pb';
import {
  COREOS_AGENT_SERVICE_NAME,
  CoreosAgentServiceClient,
} from 'src/shared/schemas/os1/core/service/coreosagent.pb';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class CommonService {
  logger = new Logger(this.constructor.name);

  @Inject(COREOS_AGENT_SERVICE_NAME)
  private readonly coreosAgentClient: ClientGrpc;
  private coreosAgentServiceClient: CoreosAgentServiceClient;

  @Inject(SubscriptionService)
  private readonly subscriptionService: SubscriptionService;

  onModuleInit() {
    this.coreosAgentServiceClient =
      this.coreosAgentClient.getService<CoreosAgentServiceClient>(
        COREOS_AGENT_SERVICE_NAME,
      );
  }

  async getApplicableBanners(
    ctx: PlatformRequestContext,
    tenantId: string,
    params: {
      solutionId?: string;
      filterActiveOnly?: boolean;
    },
  ): Promise<BannerLatestResponseDTO | BannerAllResponseDTO> {
    const tenantSubscriptions =
      await this.subscriptionService.getActiveSubscriptions(ctx, tenantId);
    const tenantSubscriptionMap = tenantSubscriptions
      .filter((sub) => sub.item.solution)
      .map((sub) => ({
        subscriptionId: sub.id.subscriptionId,
        solutionId: sub.item.solution.id.solutionId,
      }));
    const bannersResponse = await firstValueFrom(
      this.coreosAgentServiceClient.getConsoleBannerByTenantId(
        {
          tenantId,
          tenantSubscribedSolutions: tenantSubscriptionMap.map(
            (item) => item.solutionId,
          ),
        },
        ctx.rpcMetadata,
      ),
    );
    const applicableBanners =
      TenantBannersResponseSchemaToDtoMapper.mapToBannerResponseDTO(
        bannersResponse.banners || [],
        tenantSubscriptionMap,
      );
    if (params.solutionId && params.filterActiveOnly) {
      return {
        serverTime: bannersResponse.serverTimeIso,
        tenantTimeZone: bannersResponse.tenantTimezone,
        banner: this.getActiveBanner(bannersResponse.serverTimeIso, [
          ...applicableBanners.solution.filter(
            (banner) => banner.subscription.solutionId === params.solutionId,
          ),
          ...applicableBanners.foundation,
        ]),
      };
    } else if (params.solutionId) {
      return {
        serverTime: bannersResponse.serverTimeIso,
        tenantTimeZone: bannersResponse.tenantTimezone,
        banners: {
          foundation: applicableBanners.foundation,
          solution: applicableBanners.solution.filter(
            (banner) => banner.subscription.solutionId === params.solutionId,
          ),
        },
      };
    } else if (params.filterActiveOnly) {
      return {
        serverTime: bannersResponse.serverTimeIso,
        tenantTimeZone: bannersResponse.tenantTimezone,
        banner: this.getActiveBanner(bannersResponse.serverTimeIso, [
          ...applicableBanners.solution,
          ...applicableBanners.foundation,
        ]),
      };
    }
    return {
      serverTime: bannersResponse.serverTimeIso,
      tenantTimeZone: bannersResponse.tenantTimezone,
      banners: applicableBanners,
    };
  }

  private getActiveBanner(
    serverTimeIso: string,
    banners: BannerDTO[],
  ): BannerDTO {
    const activeBanners = banners.filter(
      (banner) =>
        DateTime.fromISO(banner.activeUntilTime).diff(
          DateTime.fromISO(serverTimeIso),
          'minutes',
        ).minutes > 0 &&
        DateTime.fromISO(serverTimeIso).diff(
          DateTime.fromISO(banner.activeFromTime),
          'minutes',
        ).minutes > 0,
    );
    if (activeBanners.length) {
      return activeBanners.sort((bannerA, bannerB) => {
        const [durA, durB] = [
          DateTime.fromISO(bannerA.activeUntilTime).diff(
            DateTime.fromISO(bannerA.activeFromTime),
            'minutes',
          ).minutes,
          DateTime.fromISO(bannerB.activeUntilTime).diff(
            DateTime.fromISO(bannerB.activeFromTime),
            'minutes',
          ).minutes,
        ];
        if (durA === durB) {
          return (
            bannerLevelTypeFromJSON(bannerA.levelType) -
            bannerLevelTypeFromJSON(bannerB.levelType)
          );
        }
        return durB - durA;
      })[0];
    }

    return banners.sort((bannerA, bannerB) => {
      return DateTime.fromISO(bannerA.activeFromTime).diff(
        DateTime.fromISO(bannerB.activeFromTime),
        'minutes',
      ).minutes;
    })[0];
  }
}
