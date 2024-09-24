import {
  COREOS_AGENT_SERVICE_NAME,
  CoreosAgentServiceClient,
} from '@delhivery/developer-platform-proto-schemas/src/index.os1.core.service';
import { PlatformRequestContext } from '@foxtrotplatform/developer-platform-core-lib';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BannerResponseDTO } from 'src/common/dto/common/common.dto';
import { TenantBannersResponseSchemaToDtoMapper } from 'src/common/dto/common/response.dto.mapper';
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
  ): Promise<BannerResponseDTO> {
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
    return {
      serverTime: bannersResponse.serverTimeIso,
      tenantTimeZone: bannersResponse.tenantTimezone,
      banners: TenantBannersResponseSchemaToDtoMapper.mapToBannerResponseDTO(
        bannersResponse.banners,
        tenantSubscriptionMap,
      ),
    };
  }
}
