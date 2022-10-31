import { PlatformRequestContext } from '@foxtrotplatform/developer-platform-core-lib';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ApplicationResponseSchemaToDtoMapper } from 'src/common/dto/application/response.dto.mapper';
import { SolutionResponseSchemaToDtoMapper } from 'src/common/dto/solution/response.dto.mapper';
import { SolutionDTO } from 'src/common/dto/solution/solution.dto';
import { SubscriptionDTO } from 'src/common/dto/subscription/subscription.dto';
import { GetAppsForCoreosUserRequest } from 'src/shared/schemas/os1/core/coreosagent/request.pb';

import {
  CoreosAgentServiceClient,
  COREOS_AGENT_SERVICE_NAME,
} from 'src/shared/schemas/os1/core/service/coreosagent.pb';
import {
  FileServiceClient,
  FILE_SERVICE_NAME,
} from 'src/shared/schemas/os1/core/service/file.pb';
import { Application, ApplicationNavigation_MenuItem } from 'src/shared/schemas/os1/developerportal/application/application.pb';
import { ApplicationVersionIdentifier } from 'src/shared/schemas/os1/developerportal/application/identifiers.pb';
import { GetApplicationByVersionIdRequest } from 'src/shared/schemas/os1/developerportal/application/request.pb';
import {
  ApplicationServiceClient,
  APPLICATION_SERVICE_NAME,
} from 'src/shared/schemas/os1/developerportal/service/application.pb';
import {
  SolutionServiceClient,
  SOLUTION_SERVICE_NAME,
} from 'src/shared/schemas/os1/developerportal/service/solution.pb';
import { SolutionVersionIdentifier } from 'src/shared/schemas/os1/developerportal/solution/identifiers.pb';
import { GetSolutionByVersionIdRequest } from 'src/shared/schemas/os1/developerportal/solution/request.pb';
import {
  Solution,
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

  @Inject(APPLICATION_SERVICE_NAME)
  private readonly applicationClient: ClientGrpc;
  private applicationServiceClient: ApplicationServiceClient;

  @Inject(SOLUTION_SERVICE_NAME)
  private readonly solutionClient: ClientGrpc;
  private solutionServiceClient: SolutionServiceClient;

  @Inject(SUBSCRIPTION_SERVICE_NAME)
  private readonly subscriptionClient: ClientGrpc;
  private subscriptionServiceClient: SubscriptionServiceClient;

  @Inject(COREOS_AGENT_SERVICE_NAME)
  private readonly coreosAgentClient: ClientGrpc;
  private coreosAgentServiceClient: CoreosAgentServiceClient;

  @Inject(FILE_SERVICE_NAME)
  private readonly fileClient: ClientGrpc;
  private fileServiceClient: FileServiceClient;

  onModuleInit() {
    this.applicationServiceClient =
      this.applicationClient.getService<ApplicationServiceClient>(
        APPLICATION_SERVICE_NAME,
      );
    this.solutionServiceClient =
      this.solutionClient.getService<SolutionServiceClient>(
        SOLUTION_SERVICE_NAME,
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

  // returns only one subscription for now. Should return all subscriptions for a tenant in the future
  async getAllSubscriptions(
    ctx: PlatformRequestContext,
    userId: string,
    tenantId: string,
  ): Promise<Array<SubscriptionDTO>> {
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

        await firstValueFrom(
          this.getSolutionsBySolutionVersionIdentifier(
            ctx,
            subscription.item.solution.id,
          ),
        )
          .then((response) => {
            solution = response;
            solutionDto =
              SolutionResponseSchemaToDtoMapper.mapToSolutionDTO(solution);
            subscriptionDTO.solutions.push(solutionDto);
          })
          .catch((error) => {
            if (error.code === 5) {
              // app not found. no action required
            } else {
              const message = `Error occuret while getting solution for solutionVersionIdentifier ${subscription.item.solution}`;
              this.logger.error(message, error.stack);
              throw new InternalServerErrorException(message);
            }
          });

        // return empty subscription if solution not found
        if (solution) {
          const appsReferencedInSolution: Array<SolutionVersion_Application> =
            solution.version[0].associatedApplications ?? [];

          // sort applications by display order descending
          this.sortSolutionApplications(appsReferencedInSolution);
          // get app details and build a map of app id to app for all apps referenced in solution
          for (const app of appsReferencedInSolution) {
            // collect all applciations referenced in solution
            await firstValueFrom(
              this.getApplicationByApplicationVersionIdentifier(ctx, app.id),
            )
              .then((app) => {
                if (
                  this.isAppToBeAddedToSolution(
                    subscriptionDTO,
                    app,
                    corsAppsAssignedToUser,
                  )
                ) {
                  this.sortApplicationMenuItems(
                    app.versions[0]?.appNavigation?.menuItems || [],
                  );
                  solutionDto.applications.push(
                    ApplicationResponseSchemaToDtoMapper.mapToApplicationDTO(
                      app,
                    ),
                  );
                }
              })
              .catch((error) => {
                if (error.code === 5) {
                  // app not found. no action required
                } else {
                  const message = `Error while getting application details for ${app.id.appId} and ${app.id.appVersionId}. Reson: ${error.message}`;
                  this.logger.error(message, error);
                  throw new InternalServerErrorException(message);
                }
              });
          }
        }
      }
      if (subscription.item.application) {
        await firstValueFrom(
          this.getApplicationByApplicationVersionIdentifier(
            ctx,
            subscription.item.application.id,
          ),
        )
          .then((app) => {
            if (
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
          })
          .catch((error) => {
            if (error.code === 5) {
              // app not found. no action required
            } else {
              const message = `Error while getting application details for ${subscription.item.application.id.appId} and ${subscription.item.application.id.appVersionId}. Reson: ${error.message}`;
              this.logger.error(message, error);
              throw new InternalServerErrorException(message);
            }
          });
      }
      subscriptionResponseDTOs.push(subscriptionDTO);
    }
    return subscriptionResponseDTOs;
  }

  private sortSolutionApplications(
    appsReferencedInSolution: SolutionVersion_Application[],
  ) {
    appsReferencedInSolution.sort((a, b) => {
      // default undefined display order to 0 so it always moved at bottom of the list
      return (b.displayOrder ?? 0) - (a.displayOrder ?? 0);
    });
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
        corsAppsAssignedToUser.includes(app.urn))
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
    return this.solutionServiceClient
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
}
