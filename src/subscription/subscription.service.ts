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
import * as _ from 'lodash';
import * as pluralize from 'pluralize';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { RedisConstants } from 'src/common/constants/redis.constants';
import { ApplicationResponseSchemaToDtoMapper } from 'src/common/dto/application/response.dto.mapper';
import { SolutionResponseSchemaToDtoMapper } from 'src/common/dto/solution/response.dto.mapper';
import { SolutionDTO } from 'src/common/dto/solution/solution.dto';
import { SolutionSettingsResponseSchema } from 'src/common/dto/solutionSettings/response.dto.mapper';
import {
  FoundationalAppsSettingsDTO,
  SolutionSettingsDTO,
  SubscriptionSettings,
} from 'src/common/dto/solutionSettings/solutionSettings.dto';
import {
  SubscriptionDTO,
  SubscriptionsResponseDTO,
} from 'src/common/dto/subscription/subscription.dto';
import {
  GetAppsForCoreosUserRequest,
  GetTenantByIdRequest,
  GetTenantConfigsByTenantIdRequest,
} from 'src/shared/schemas/os1/core/coreosagent/request.pb';
import { GetTenantConfigsByTenantIdResponse_Config } from 'src/shared/schemas/os1/core/coreosagent/response.pb';
import { Tenant } from 'src/shared/schemas/os1/core/coreosagent/tenant.pb';
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

    let coreosAppsAssignerToUserFromAAA: string[] = [];
    if (apps) {
      this.getCoreosAppsAssignedToUserAndSaveToRedis(
        ctx,
        userId,
        tenantId,
      ).catch((error) => {
        this.logger.error(error.message);
      });
      coreosAppsAssignerToUserFromAAA = JSON.parse(apps);
    } else {
      coreosAppsAssignerToUserFromAAA =
        await this.getCoreosAppsAssignedToUserAndSaveToRedis(
          ctx,
          userId,
          tenantId,
        );
    }

    return coreosAppsAssignerToUserFromAAA;
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
      const message = `Error occured while getting subscriptions for tenant ${tenantId}`;
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
    tenantConfigs: GetTenantConfigsByTenantIdResponse_Config[],
    fetchSettingsCompatible: boolean,
  ): Promise<SubscriptionsResponseDTO> {
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

    const userGroups = await firstValueFrom(
      this.coreosAgentServiceClient
        .getCoreosUserById(
          {
            tenantId,
            coreosUserId: userId,
          },
          ctx.rpcMetadata,
        )
        .pipe(
          map((response) => {
            return response.groups;
          }),
        ),
    );

    const tenant = await firstValueFrom(
      this.getTenantByTenantId(ctx, tenantId),
    );
    const stackId = tenant.stackId;
    const subscriptionResponseDTOs: Array<SubscriptionDTO> = [];
    let isSettingsAvailable = false;
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
          if (solution.version[0].systemAppSettings?.length > 0) {
            isSettingsAvailable = true;
          }

          let appsReferencedInSolution: Array<SolutionVersion_Application> =
            solution.version[0].associatedApplications ?? [];

          // sort applications by display order descending
          appsReferencedInSolution = this.sortSolutionApplications(
            appsReferencedInSolution,
            fetchSettingsCompatible,
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
                  application,
                  tenant,
                  corsAppsAssignedToUser,
                  fetchSettingsCompatible,
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
                this.updateAppDisplayNameBasedOnConfig(
                  application,
                  tenantConfigs,
                );
                solutionDto.applications.push(
                  ApplicationResponseSchemaToDtoMapper.mapToApplicationDTO(
                    application,
                  ),
                );
                if (
                  application.versions[0].appUrls?.find(
                    (url) => url.name === 'setting',
                  )?.url?.length > 0
                ) {
                  isSettingsAvailable = true;
                }
              }
            } else {
              const application =
                await this.getApplicationByVersionIdAndSaveToRedis(ctx, app.id);
              if (
                application &&
                this.isAppToBeAddedToSolution(
                  application,
                  tenant,
                  corsAppsAssignedToUser,
                  fetchSettingsCompatible,
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
                this.updateAppDisplayNameBasedOnConfig(
                  application as Application,
                  tenantConfigs,
                );
                solutionDto.applications.push(
                  ApplicationResponseSchemaToDtoMapper.mapToApplicationDTO(
                    application,
                  ),
                );
                if (
                  application.versions[0].appUrls?.find(
                    (url) => url.name === 'setting',
                  )?.url?.length > 0
                ) {
                  isSettingsAvailable = true;
                }
              }
            }
          }

          //add solution landing page to the DTO
          solutionDto.landingPage = this.getSolutionLandingPage(
            tenantId,
            solutionDto,
            solution,
            userGroups,
          );
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
              JSON.parse(appFromRedis),
              tenant,
              corsAppsAssignedToUser,
              fetchSettingsCompatible,
            )
          ) {
            this.updateAppDisplayNameBasedOnConfig(
              JSON.parse(appFromRedis),
              tenantConfigs,
            );
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
              app,
              tenant,
              corsAppsAssignedToUser,
              fetchSettingsCompatible,
            )
          ) {
            this.updateAppDisplayNameBasedOnConfig(app, tenantConfigs);
            subscriptionDTO.applications.push(
              ApplicationResponseSchemaToDtoMapper.mapToApplicationDTO(app),
            );
          }
        }
      }
      subscriptionResponseDTOs.push(subscriptionDTO);
    }
    return { isSettingsAvailable, subscriptions: subscriptionResponseDTOs };
  }

  async getAllSubscriptionsWithAddonApps(
    ctx: PlatformRequestContext,
    userId: string,
    tenantId: string,
    shouldInvalidateCache: boolean,
    fetchSettingsCompatible = false,
  ): Promise<SubscriptionsResponseDTO> {
    if (shouldInvalidateCache) {
      await this.invalidateCaches(ctx, tenantId);
    }
    const tenantConfigs = await this.getTenantConfigsByTenantId(ctx, tenantId);

    const subscriptionsResponse = await this.getAllSubscriptions(
      ctx,
      userId,
      tenantId,
      tenantConfigs,
      fetchSettingsCompatible,
    );
    const solutions = subscriptionsResponse.subscriptions
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
              this.updateAppDisplayNameBasedOnConfig(app, tenantConfigs);
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
                this.updateAppDisplayNameBasedOnConfig(app, tenantConfigs);
                solution.applications.push(
                  ApplicationResponseSchemaToDtoMapper.mapToApplicationDTO(app),
                );
              }
            }
          }
        }
      }
    }

    return subscriptionsResponse;
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
      true,
    );
    let solutionsSettings: SolutionSettingsDTO[] = [];
    let foundationalAppsSetting: FoundationalAppsSettingsDTO[] = [];
    let foundationAppIdSet = new Set<string>();

    for (const subscription of allSubscriptions.subscriptions || []) {
      const solutions = subscription.solutions;
      for (const solution of solutions || []) {
        const setting =
          SolutionSettingsResponseSchema.mapSolutionSettingsDTO(solution);

        if (solution.solutionAppSetting) {
          this.aggregateFoundationalSettings(
            solution.solutionAppSetting,
            foundationalAppsSetting,
            foundationAppIdSet,
          );
        }
        solutionsSettings?.push(setting);
      }
    }
    return {
      foundation: foundationalAppsSetting,
      solutions: solutionsSettings,
    };
  }

  findSolutionBySolutionId(
    solutions: SolutionDTO[],
    solutionId: string,
  ): SolutionDTO {
    return solutions.find((solution) => solution.solutionId === solutionId);
  }

  private aggregateFoundationalSettings(
    solutionAppSetting: Array<systemAppSettingItem>,
    foundationalAppsSettingsDTO: FoundationalAppsSettingsDTO[],
    foundationAppIdSet: Set<string>,
  ) {
    solutionAppSetting?.map((setting) => {
      if (!foundationAppIdSet.has(setting.appUrn)) {
        foundationAppIdSet.add(setting.appUrn);
        foundationalAppsSettingsDTO.push({
          coreAppId: setting.appUrn,
          displayName: setting.displayName,
          settingsUrl: setting.settingsUrl,
          description: setting.description,
          icon: setting.iconUrl,
        });
      }
    });
  }

  private sortSolutionApplications(
    appsReferencedInSolution: SolutionVersion_Application[],
    fetchSettingsCompatible: boolean,
  ): SolutionVersion_Application[] {
    return fetchSettingsCompatible
      ? appsReferencedInSolution.sort((a, b) => {
          // default undefined display order to 0 so it always moved at bottom of the list
          return (b.displayOrder ?? 0) - (a.displayOrder ?? 0);
        })
      : appsReferencedInSolution
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
    app: Application,
    tenant: Tenant,
    coreosAppsAssignedToUser: string[],
    fetchSettingsCompatible: boolean,
  ): boolean {
    // filter out which are not console compatable apps not assigned to user
    return fetchSettingsCompatible
      ? tenant.isDeveloperTenant || coreosAppsAssignedToUser?.includes(app.urn)
      : app.versions[0]?.applicationCompitablity?.isConsoleCompatible &&
          (tenant.isDeveloperTenant ||
            coreosAppsAssignedToUser?.includes(app.urn));
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

  private getTenantByTenantId(
    ctx: PlatformRequestContext,
    tenantId: string,
  ): Observable<Tenant> {
    const request: GetTenantByIdRequest = {
      tenantId,
    };
    return this.coreosAgentServiceClient
      .getTenantById(request, ctx.rpcMetadata)
      .pipe(
        map((response) => {
          return response.tenant;
        }),
      );
  }

  private async getTenantConfigsByTenantId(
    ctx: PlatformRequestContext,
    tenantId: string,
  ): Promise<GetTenantConfigsByTenantIdResponse_Config[]> {
    const cachedConfigs = await this.redisService.get(
      RedisConstants.getConfigKey(tenantId),
    );
    if (cachedConfigs) {
      return JSON.parse(cachedConfigs);
    }
    const request: GetTenantConfigsByTenantIdRequest = {
      tenantId,
    };
    const configs = await firstValueFrom(
      this.coreosAgentServiceClient
        .getTenantConfigsByTenantId(request, ctx.rpcMetadata)
        .pipe(
          map((response) => {
            return response.configs;
          }),
          catchError((err) => {
            const message = `Error while fetching config for tenant ${tenantId}. Reson: ${err.message}`;
            this.logger.error(message, err);
            throw new InternalServerErrorException(message);
          }),
        ),
    ).catch((error) => {
      return [];
    });

    if (configs && configs.length) {
      await this.redisService.set(
        RedisConstants.getConfigKey(tenantId),
        JSON.stringify(configs),
      );
    }

    return configs;
  }

  private async invalidateCaches(
    ctx: PlatformRequestContext,
    tenantId: string,
  ) {
    await this.redisService
      .del(RedisConstants.getConfigKey(tenantId))
      .then((response) => {
        this.logger.log(
          `Tenant Config cache has been successfully reset for: ${tenantId}`,
        );
      });
  }

  private filterUrlOverridesByStackId(
    urlOverrides: ApplicationUrlOverride[],
    stackId: string,
  ): ApplicationUrlOverride[] {
    return urlOverrides.filter((override) => override.stackId === stackId);
  }

  private getSolutionLandingPage(
    tenantId: string,
    solutionDto: SolutionDTO,
    solution: Solution,
    userGroups: string[],
  ) {
    const usersLandingPage = solution.version[0].usersLandingPage;
    const solutionLandingPage = solution.version[0].solutionUrls?.find(
      (url) => url.name === 'landingPage',
    );
    if (usersLandingPage) {
      const userMatchedGroups = usersLandingPage.filter((uGroup) =>
        (userGroups ?? []).includes(
          `platform:${tenantId}:group:${uGroup.userGroupName.trim()}`,
        ),
      );
      if (userMatchedGroups.length) {
        const highestRankedGroup = userMatchedGroups
          .sort((groupA, groupB) => groupA.rank - groupB.rank)
          .shift();
        return highestRankedGroup.url;
      }
    }
    if (solutionLandingPage) {
      return solutionLandingPage.url;
    }
    const firstSideNavAppInSolution = solutionDto.applications[0];
    const appRelPath = firstSideNavAppInSolution?.appUrls?.find(
      (url) => url.name === 'relativePath',
    );
    if (appRelPath) {
      return appRelPath.url;
    }
    this.logger.error(
      `No landing page configured for ${tenantId} - ${solutionDto.solutionVersionId}`,
    );
    return '';
  }

  private updateAppDisplayNameBasedOnConfig(
    application: Application,
    tenantConfigs: GetTenantConfigsByTenantIdResponse_Config[],
  ) {
    const appDisplayName = application.versions[0]?.displayName;
    if (appDisplayName) {
      const appDisplayNameSingular = pluralize.singular(appDisplayName.trim());
      const appTenantConfig = tenantConfigs.find(
        (config) =>
          config.typeName === appDisplayNameSingular.trim().toLocaleLowerCase(),
      );
      if (appTenantConfig) {
        if (pluralize.isSingular(appDisplayName.trim())) {
          application.versions[0].displayName = _.capitalize(
            appTenantConfig.alias.singular,
          );
        }
        if (pluralize.isPlural(appDisplayName.trim())) {
          application.versions[0].displayName = _.capitalize(
            appTenantConfig.alias.plural,
          );
        }
      }
    }
    if (application.versions[0]?.appNavigation?.menuItems) {
      application.versions[0]?.appNavigation?.menuItems.forEach((menuItem) => {
        const menuItemDisplayName = menuItem.displayName;
        if (menuItemDisplayName) {
          const menuItemDisplayNameSingular = pluralize.singular(
            menuItemDisplayName.trim(),
          );
          const itemTenantConfig = tenantConfigs.find(
            (config) =>
              config.typeName ===
              menuItemDisplayNameSingular.trim().toLocaleLowerCase(),
          );
          if (itemTenantConfig) {
            if (pluralize.isSingular(menuItemDisplayName.trim())) {
              menuItem.displayName = _.capitalize(
                itemTenantConfig.alias.singular,
              );
            }
            if (pluralize.isPlural(menuItemDisplayName.trim())) {
              menuItem.displayName = _.capitalize(
                itemTenantConfig.alias.plural,
              );
            }
          }
        }
      });
    }
  }
}
