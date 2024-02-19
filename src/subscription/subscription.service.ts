import {
  PlatformRequestContext,
  RedisService,
} from '@foxtrotplatform/developer-platform-core-lib';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { error } from 'console';
import { firstValueFrom, map, Observable } from 'rxjs';
import { RedisConstants } from 'src/common/constants/redis.constants';
import { ApplicationResponseSchemaToDtoMapper } from 'src/common/dto/application/response.dto.mapper';
import { SolutionResponseSchemaToDtoMapper } from 'src/common/dto/solution/response.dto.mapper';
import { SolutionDTO } from 'src/common/dto/solution/solution.dto';
import { SolutionSettingsResponseSchema } from 'src/common/dto/solutionSettings/response.dto.mapper';
import { FoundationalAppsSettingsDTO, SolutionSettingsDTO, SubscriptionSettings } from 'src/common/dto/solutionSettings/solutionSettings.dto';
import { SubscriptionDTO } from 'src/common/dto/subscription/subscription.dto';
import {
  GetAppsForCoreosUserRequest,
  GetTenantByIdRequest,
} from 'src/shared/schemas/os1/core/coreosagent/request.pb';

import {
  CoreosAgentServiceClient,
  COREOS_AGENT_SERVICE_NAME,
} from 'src/shared/schemas/os1/core/service/coreosagent.pb';
import {
  FileServiceClient,
  FILE_SERVICE_NAME,
} from 'src/shared/schemas/os1/core/service/file.pb';
import {
  Application,
  ApplicationNavigation_MenuItem,
  ApplicationUrlOverride,
} from 'src/shared/schemas/os1/developerportal/application/application.pb';
import { ApplicationVersionIdentifier } from 'src/shared/schemas/os1/developerportal/application/identifiers.pb';
import { GetApplicationByVersionIdRequest } from 'src/shared/schemas/os1/developerportal/application/request.pb';
import {
  APPLICATION_SERVICE_V2_SERVICE_NAME,
  ApplicationServiceV2Client,
} from 'src/shared/schemas/os1/developerportal/service/application-v2.pb';
import { SolutionVersionIdentifier } from 'src/shared/schemas/os1/developerportal/solution/identifiers.pb';
import { GetSolutionByVersionIdRequest } from 'src/shared/schemas/os1/developerportal/solution/request.pb';
import {
  Solution,
  systemAppSettingItem,
  SolutionVersion_Application,
} from 'src/shared/schemas/os1/developerportal/solution/solution.pb';
import {
  SubscriptionServiceClient,
  SUBSCRIPTION_SERVICE_NAME,
} from 'src/shared/schemas/os1/marketplace/service/subscription.pb';
import { GetSubscriptionsByTenantIdRequest } from 'src/shared/schemas/os1/marketplace/subscription/request.pb';
import {
  Subscription,
  subscriptionTier_PlanTypeToJSON,
} from 'src/shared/schemas/os1/marketplace/subscription/subscription.pb';

@Injectable()
export class SubscriptionService {
  logger = new Logger(this.constructor.name);

  @Inject(APPLICATION_SERVICE_V2_SERVICE_NAME)
  private readonly applicationClient: ClientGrpc;
  private applicationServiceClient: ApplicationServiceV2Client;

  @Inject(SUBSCRIPTION_SERVICE_NAME)
  private readonly subscriptionClient: ClientGrpc;
  private subscriptionServiceClient: SubscriptionServiceClient;

  @Inject(COREOS_AGENT_SERVICE_NAME)
  private readonly coreosAgentClient: ClientGrpc;
  private coreosAgentServiceClient: CoreosAgentServiceClient;

  @Inject(FILE_SERVICE_NAME)
  private readonly fileClient: ClientGrpc;
  private fileServiceClient: FileServiceClient;

  @Inject(RedisService)
  private redisService: RedisService;

  onModuleInit() {
    this.applicationServiceClient =
      this.applicationClient.getService<ApplicationServiceV2Client>(
        APPLICATION_SERVICE_V2_SERVICE_NAME,
      );
    this.subscriptionServiceClient =
      this.subscriptionClient.getService<SubscriptionServiceClient>(
        SUBSCRIPTION_SERVICE_NAME,
      );
    this.coreosAgentServiceClient =
      this.coreosAgentClient.getService<CoreosAgentServiceClient>(
        COREOS_AGENT_SERVICE_NAME,
      );
    this.fileServiceClient =
      this.fileClient.getService<FileServiceClient>(FILE_SERVICE_NAME);
  }

  async getCoreosAppsAssignedToUserAndSaveToRedis(
    ctx: PlatformRequestContext,
    userId: string,
    tenantId: string,
  ): Promise<Array<string>> {
    const getAppsForCoreosUserRequest: GetAppsForCoreosUserRequest = {
      tenantId: tenantId,
      coreosUserId: userId,
    };

    // TODO: filter response only based on apps assigned to the user
    let corsAppsAssignedToUser: string[] = [];
    await firstValueFrom(
      this.coreosAgentServiceClient
        .getAppsForCoreosUser(getAppsForCoreosUserRequest, ctx.rpcMetadata)
        .pipe(map((response) => response.apps)),
    )
      .then((apps) => {
        corsAppsAssignedToUser = apps;
      })
      .catch((error) => {
        const message = `Error while fetching apps assigned to user ${userId} from coreos`;
        throw new InternalServerErrorException(message, error);
      });
    this.logger.log('corsAppsAssignedToUser: ' + corsAppsAssignedToUser);

    await this.redisService.setEx(
      RedisConstants.getAppsForCoreosUserKey(`${userId}_${tenantId}`),
      JSON.stringify(corsAppsAssignedToUser),
      RedisConstants.one_day_in_seconds,
    );
    return corsAppsAssignedToUser;
  }

  async getCoreosAppsAssignedToUser(
    ctx: PlatformRequestContext,
    userId: string,
    tenantId: string,
  ): Promise<Array<string>> {
    const apps = await this.redisService.get(
      RedisConstants.getAppsForCoreosUserKey(`${userId}_${tenantId}`),
    );

    if (apps) {
      this.getCoreosAppsAssignedToUserAndSaveToRedis(
        ctx,
        userId,
        tenantId,
      ).catch((error) => {
        this.logger.error(error.message);
      });
      return JSON.parse(apps);
    } else
      return await this.getCoreosAppsAssignedToUserAndSaveToRedis(
        ctx,
        userId,
        tenantId,
      );
  }

  async getActiveSubscriptionsAndSaveToRedis(
    ctx: PlatformRequestContext,
    userId: string,
    tenantId: string,
  ): Promise<Array<Subscription>> {
    // get subscriptions for tenant
    let subscriptions: Subscription[] = await firstValueFrom(
      this.getSubscriptionsByTenantId(ctx, tenantId),
    ).catch((error) => {
      if (error.code === 5) {
        throw new NotFoundException(
          `No subscriptions found for tenant ${tenantId}`,
        );
      }
      const message = `Error occuret while getting subscriptions for tenant ${tenantId}`;
      this.logger.error(message, error.stack);
      throw new InternalServerErrorException(message);
    });

    if (subscriptions && subscriptions.length === 0) {
      throw new InternalServerErrorException(
        `No subscriptions found for tenant ${tenantId}`,
      );
    }

    subscriptions = subscriptions.filter(
      (subscription) =>
        subscription.recordStatus.isActive &&
        !subscription.recordStatus.isDeleted,
    );

    await this.redisService.setEx(
      RedisConstants.getSubscriptionsKey(tenantId),
      JSON.stringify(subscriptions),
      RedisConstants.one_day_in_seconds,
    );
    return subscriptions;
  }

  async getActiveSubscriptions(
    ctx: PlatformRequestContext,
    userId: string,
    tenantId: string,
  ): Promise<Array<Subscription>> {
    const subs = await this.redisService.get(
      RedisConstants.getSubscriptionsKey(tenantId),
    );

    if (subs) {
      this.getActiveSubscriptionsAndSaveToRedis(ctx, userId, tenantId).catch(
        (error) => {
          this.logger.error(error.message);
        },
      );
      return JSON.parse(subs);
    } else
      return await this.getActiveSubscriptionsAndSaveToRedis(
        ctx,
        userId,
        tenantId,
      );
  }

  async getSolutionByVersionIdAndSaveToRedis(
    ctx: PlatformRequestContext,
    solutionVersionIdentifier: SolutionVersionIdentifier,
  ): Promise<Solution | void> {
    const solution = await firstValueFrom(
      this.getSolutionsBySolutionVersionIdentifier(
        ctx,
        solutionVersionIdentifier,
      ),
    ).catch((error) => {
      if (error.code === 5) {
        // app not found. no action required
      } else {
        const message = `Error occured while getting solution for solutionVersionIdentifier ${solutionVersionIdentifier}`;
        this.logger.error(message, error.stack);
        throw new InternalServerErrorException(message);
      }
    });

    await this.redisService.setEx(
      RedisConstants.getSolutionByVersionIdKey(
        solutionVersionIdentifier.solutionVersionId,
      ),
      JSON.stringify(solution),
      RedisConstants.one_day_in_seconds,
    );
    return solution;
  }

  async getApplicationByVersionIdAndSaveToRedis(
    ctx: PlatformRequestContext,
    appVersionIdentifier: ApplicationVersionIdentifier,
  ): Promise<Application | void> {
    const application = await firstValueFrom(
      this.getApplicationByApplicationVersionIdentifier(
        ctx,
        appVersionIdentifier,
      ),
    ).catch((error) => {
      if (error.code === 5) {
        // app not found. no action required
      } else {
        const message = `Error while getting application details for ${appVersionIdentifier.appId} and ${appVersionIdentifier.appVersionId}. Reson: ${error.message}`;
        this.logger.error(message, error);
        throw new InternalServerErrorException(message);
      }
    });

    await this.redisService.setEx(
      RedisConstants.getApplicationByVersionIdKey(
        appVersionIdentifier.appVersionId,
      ),
      JSON.stringify(application),
      RedisConstants.one_day_in_seconds,
    );
    return application;
  }

  // returns only one subscription for now. Should return all subscriptions for a tenant in the future
  async getAllSubscriptions(
    ctx: PlatformRequestContext,
    userId: string,
    tenantId: string,
  ): Promise<Array<SubscriptionDTO>> {
    const subscriptions = await this.getActiveSubscriptions(
      ctx,
      userId,
      tenantId,
    );
    const corsAppsAssignedToUser = await this.getCoreosAppsAssignedToUser(
      ctx,
      userId,
      tenantId,
    );

    const stackId = await firstValueFrom(
      this.getStackIdByTenantId(ctx, tenantId),
    );
    const subscriptionResponseDTOs: Array<SubscriptionDTO> = [];
    for (const subscription of subscriptions || []) {
      this.logger.log(
        'processing subscriptions: ' + subscription.id.subscriptionId,
      );

      const subscriptionDTO: SubscriptionDTO = {
        subscriptionId: '',
        applications: [],
        solutions: [],
        status: undefined,
        tier: undefined,
      };

      subscriptionDTO.subscriptionId = subscription.id.subscriptionId;
      subscriptionDTO.tier = {
        displayName: subscription.tier.displayName,
        periodInDays: subscription.tier.periodInDays,
        planType: subscriptionTier_PlanTypeToJSON(subscription.tier.planType),
      };
      subscriptionDTO.status = {
        status: subscription.status.status,
        activatedAt: subscription.status.activatedAt,
        requestedAt: subscription.status.requestedAt,
      };

      if (subscription.item.solution) {
        let solution: Solution;
        let solutionDto: SolutionDTO;

        const solutionFromRedis = await this.redisService.get(
          RedisConstants.getSolutionByVersionIdKey(
            subscription.item.solution.id.solutionVersionId,
          ),
        );

        if (solutionFromRedis) {
          this.getSolutionByVersionIdAndSaveToRedis(
            ctx,
            subscription.item.solution.id,
          ).catch();
          solution = JSON.parse(solutionFromRedis);
          solutionDto =
            SolutionResponseSchemaToDtoMapper.mapToSolutionDTO(solution);
          subscriptionDTO.solutions.push(solutionDto);
        } else {
          const res = await this.getSolutionByVersionIdAndSaveToRedis(
            ctx,
            subscription.item.solution.id,
          );
          if (res) {
            solution = res;
            solutionDto =
              SolutionResponseSchemaToDtoMapper.mapToSolutionDTO(solution);
            subscriptionDTO.solutions.push(solutionDto);
          }
        }

        // return empty subscription if solution not found
        if (solution) {
          let appsReferencedInSolution: Array<SolutionVersion_Application> =
            solution.version[0].associatedApplications ?? [];

          // sort applications by display order descending
          appsReferencedInSolution = this.sortSolutionApplications(
            appsReferencedInSolution,
          );
          // get app details and build a map of app id to app for all apps referenced in solution
          for (const app of appsReferencedInSolution) {
            // collect all applciations referenced in solution

            const appFromRedis = await this.redisService.get(
              RedisConstants.getApplicationByVersionIdKey(app.id.appVersionId),
            );

            if (appFromRedis) {
              this.getApplicationByVersionIdAndSaveToRedis(ctx, app.id).catch();
              const application: Application = JSON.parse(appFromRedis);
              if (
                this.isAppToBeAddedToSolution(
                  subscriptionDTO,
                  application,
                  corsAppsAssignedToUser,
                )
              ) {
                this.sortApplicationMenuItems(
                  application.versions[0]?.appNavigation?.menuItems || [],
                );
                application.versions[0].appUrlOverrides =
                  this.filterUrlOverridesByStackId(
                    application.versions[0]?.appUrlOverrides || [],
                    stackId,
                  );
                solutionDto.applications.push(
                  ApplicationResponseSchemaToDtoMapper.mapToApplicationDTO(
                    application,
                  ),
                );
              }
            } else {
              const application =
                await this.getApplicationByVersionIdAndSaveToRedis(ctx, app.id);
              if (
                application &&
                this.isAppToBeAddedToSolution(
                  subscriptionDTO,
                  application,
                  corsAppsAssignedToUser,
                )
              ) {
                this.sortApplicationMenuItems(
                  application.versions[0]?.appNavigation?.menuItems || [],
                );
                application.versions[0].appUrlOverrides =
                  this.filterUrlOverridesByStackId(
                    application.versions[0]?.appUrlOverrides || [],
                    stackId,
                  );
                solutionDto.applications.push(
                  ApplicationResponseSchemaToDtoMapper.mapToApplicationDTO(
                    application,
                  ),
                );
              }
            }
          }
        }
      }
      if (subscription.item.application) {
        const appFromRedis = await this.redisService.get(
          RedisConstants.getApplicationByVersionIdKey(
            subscription.item.application.id.appVersionId,
          ),
        );

        if (appFromRedis) {
          this.getApplicationByVersionIdAndSaveToRedis(
            ctx,
            subscription.item.application.id,
          ).catch();
          if (
            this.isAppToBeAddedToSolution(
              subscriptionDTO,
              JSON.parse(appFromRedis),
              corsAppsAssignedToUser,
            )
          ) {
            subscriptionDTO.applications.push(
              ApplicationResponseSchemaToDtoMapper.mapToApplicationDTO(
                JSON.parse(appFromRedis),
              ),
            );
          }
        } else {
          const app = await this.getApplicationByVersionIdAndSaveToRedis(
            ctx,
            subscription.item.application.id,
          );
          if (
            app &&
            this.isAppToBeAddedToSolution(
              subscriptionDTO,
              app,
              corsAppsAssignedToUser,
            )
          ) {
            subscriptionDTO.applications.push(
              ApplicationResponseSchemaToDtoMapper.mapToApplicationDTO(app),
            );
          }
        }
      }
      subscriptionResponseDTOs.push(subscriptionDTO);
    }
    return subscriptionResponseDTOs;
  }

  async getAllSubscriptionsWithAddonApps(
    ctx: PlatformRequestContext,
    userId: string,
    tenantId: string,
  ): Promise<Array<SubscriptionDTO>> {
    const allSubscriptions = await this.getAllSubscriptions(
      ctx,
      userId,
      tenantId,
    );
    const solutions = allSubscriptions
      .map((subscription) => subscription.solutions)
      .flat();
    const subscriptions = await this.getActiveSubscriptions(
      ctx,
      userId,
      tenantId,
    );
    for (const subscription of subscriptions || []) {
      if (subscription.item.application) {
        const appFromRedis = await this.redisService.get(
          RedisConstants.getApplicationByVersionIdKey(
            subscription.item.application.id.appVersionId,
          ),
        );
        if (appFromRedis) {
          this.getApplicationByVersionIdAndSaveToRedis(
            ctx,
            subscription.item.application.id,
          ).catch();
          const app = JSON.parse(appFromRedis);
          const compatibleSolutionsForApp =
            app.versions[0]?.applicationCompitablity?.compitableSolutions;
          if (compatibleSolutionsForApp) {
            for (const compatibleSolutionId of compatibleSolutionsForApp) {
              const solution = this.findSolutionBySolutionId(
                solutions,
                compatibleSolutionId.solutionId,
              );
              if (!solution) {
                this.logger.log(
                  'solution not found for id: ' + compatibleSolutionId,
                );
                continue;
              }
              this.logger.log('solution found for id: ' + compatibleSolutionId);
              if (
                solution.applications.find(
                  (application) => application.appId === app.id.appId,
                )
              ) {
                this.logger.log(
                  'application already added to solution: ' +
                  compatibleSolutionId,
                );
                continue;
              }
              this.logger.log(
                'adding application to solution: ' + compatibleSolutionId,
              );
              solution.applications.push(
                ApplicationResponseSchemaToDtoMapper.mapToApplicationDTO(app),
              );
            }
          }
        } else {
          const app = await this.getApplicationByVersionIdAndSaveToRedis(
            ctx,
            subscription.item.application.id,
          );
          if (app) {
            const compatibleSolutionsForApp =
              app.versions[0]?.applicationCompitablity?.compitableSolutions;
            if (compatibleSolutionsForApp) {
              for (const compatibleSolutionId of compatibleSolutionsForApp) {
                const solution = this.findSolutionBySolutionId(
                  solutions,
                  compatibleSolutionId.solutionId,
                );
                if (!solution) {
                  this.logger.log(
                    'solution not found for id: ' + compatibleSolutionId,
                  );
                  continue;
                }
                this.logger.log(
                  'solution found for id: ' + compatibleSolutionId,
                );
                if (
                  solution.applications.find(
                    (application) => application.appId === app.id.appId,
                  )
                ) {
                  this.logger.log(
                    'application already added to solution: ' +
                    compatibleSolutionId,
                  );
                  continue;
                }
                this.logger.log(
                  'adding application to solution: ' + compatibleSolutionId,
                );
                solution.applications.push(
                  ApplicationResponseSchemaToDtoMapper.mapToApplicationDTO(app),
                );
              }
            }
          }
        }
      }
    }

    return allSubscriptions;
  }


  async getAllSolutionSetting(
    ctx: PlatformRequestContext,
    userId: string,
    tenantId: string,
  ): Promise<SubscriptionSettings> {
    const allSubscriptions = await this.getAllSubscriptionsWithAddonApps(
      ctx,
      userId,
      tenantId,
    );
    let solutionsSettings: (SolutionSettingsDTO)[] = [];
    let foundationalAppsSetting: (FoundationalAppsSettingsDTO)[] = [];
    let foundationAppIdSet = new Set<string>()

    for (const subscription of allSubscriptions || []) {
      const solutions = subscription.solutions
      for (const solution of solutions || []) {
        const setting = SolutionSettingsResponseSchema.mapSolutionSettingsDTO(solution);

        if (solution.solutionAppSetting) {
          this.aggregateFoundationalSettings(solution.solutionAppSetting, foundationalAppsSetting, foundationAppIdSet)
        }
        solutionsSettings?.push(setting)
      }
    }
    return {
      foundation: foundationalAppsSetting,
      solutions: solutionsSettings
    }
  }

  findSolutionBySolutionId(
    solutions: SolutionDTO[],
    solutionId: string,
  ): SolutionDTO {
    return solutions.find((solution) => solution.solutionId === solutionId);
  }

  private aggregateFoundationalSettings(
    solutionAppSetting: Array<systemAppSettingItem>,
    foundationalAppsSettingsDTO: (FoundationalAppsSettingsDTO)[],
    foundationAppIdSet: Set<string>
  ) {

    solutionAppSetting?.map((setting) => {
      if (!(foundationAppIdSet.has(setting.appUrn))) {
        foundationAppIdSet.add(setting.appUrn)
        foundationalAppsSettingsDTO.push({
          coreAppId: setting.appUrn,
          displayName: setting.displayName,
          settingsUrl: setting.settingsUrl
        })
      }
    })
  }

  private sortSolutionApplications(
    appsReferencedInSolution: SolutionVersion_Application[],
  ): SolutionVersion_Application[] {
    return appsReferencedInSolution
      .sort((a, b) => {
        // default undefined display order to 0 so it always moved at bottom of the list
        return (b.displayOrder ?? 0) - (a.displayOrder ?? 0);
      })
      .filter((a) => a.displayOrder > 0);
  }

  private sortApplicationMenuItems(
    appMenuItems: ApplicationNavigation_MenuItem[],
  ) {
    appMenuItems.sort((a, b) => {
      // default undefined display order to 0 so it always moved at bottom of the list
      return (b.displayOrder ?? 0) - (a.displayOrder ?? 0);
    });
  }

  private isAppToBeAddedToSolution(
    subscriptionDTO: SubscriptionDTO,
    app: Application,
    corsAppsAssignedToUser: string[],
  ): boolean {
    // filter out which are not console compatable apps not assigned to user
    // return all apps for developer subscription
    return (
      app.versions[0]?.applicationCompitablity?.isConsoleCompatible &&
      (this.isDeveloperSubscription(subscriptionDTO) ||
        corsAppsAssignedToUser?.includes(app.urn))
    );
  }

  private isDeveloperSubscription(subscriptionDTO: SubscriptionDTO) {
    return (
      subscriptionDTO.tier.planType === 'DEVELOPER' ||
      subscriptionDTO.tier.planType === 'SANDBOX'
    );
  }

  private getSubscriptionsByTenantId(
    ctx: PlatformRequestContext,
    tenantId: string,
  ): Observable<Subscription[]> {
    const request: GetSubscriptionsByTenantIdRequest = {
      tenantId: tenantId,
    };
    return this.subscriptionServiceClient
      .getSubscriptionsByTenantId(request, ctx.rpcMetadata)
      .pipe(map((response) => response.subscriptions));
  }

  private getSolutionsBySolutionVersionIdentifier(
    ctx: PlatformRequestContext,
    solutionVersionIdentifier: SolutionVersionIdentifier,
  ) {
    const request: GetSolutionByVersionIdRequest = {
      id: solutionVersionIdentifier,
    };
    return this.applicationServiceClient
      .getSolutionByVersionId(request, ctx.rpcMetadata)
      .pipe(map((response) => response.solution));
  }

  private getApplicationByApplicationVersionIdentifier(
    ctx: PlatformRequestContext,
    applicationVersionIdentifier: ApplicationVersionIdentifier,
  ): Observable<Application> {
    const request: GetApplicationByVersionIdRequest = {
      id: applicationVersionIdentifier,
    };
    return this.applicationServiceClient
      .getApplicationByVersionId(request, ctx.rpcMetadata)
      .pipe(map((response) => response.application));
  }

  private getStackIdByTenantId(
    ctx: PlatformRequestContext,
    tenantId: string,
  ): Observable<string> {
    const request: GetTenantByIdRequest = {
      tenantId,
    };
    return this.coreosAgentServiceClient
      .getTenantById(request, ctx.rpcMetadata)
      .pipe(map((response) => response.tenant.stackId));
  }

  private filterUrlOverridesByStackId(
    urlOverrides: ApplicationUrlOverride[],
    stackId: string,
  ): ApplicationUrlOverride[] {
    return urlOverrides.filter((override) => override.stackId === stackId);
  }
}
