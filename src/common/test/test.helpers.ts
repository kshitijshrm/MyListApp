import { faker } from '@faker-js/faker';
import { TestHelpersBase } from '@foxtrotplatform/developer-platform-core-lib';
import { File } from 'src/shared/schemas/os1/core/file/file.pb';
import { CoreosAgentServiceClient } from 'src/shared/schemas/os1/core/service/coreosagent.pb';
import { FileServiceClient } from 'src/shared/schemas/os1/core/service/file.pb';
import {
  ApplicationClassification,
  ApplicationHosting,
  ApplicationPhase,
  ApplicationPrivacy_Type,
  ApplicationType,
} from 'src/shared/schemas/os1/developerportal/application/application.pb';
import { GetApplicationByApplicationIdResponse } from 'src/shared/schemas/os1/developerportal/application/response.pb';
import { GetSolutionBySolutionIdResponse } from 'src/shared/schemas/os1/developerportal/solution/response.pb';
import {
  SolutionInitializationConfiguration_AppInitializationSequence,
  SolutionPhase,
} from 'src/shared/schemas/os1/developerportal/solution/solution.pb';
import { SubscriptionServiceClient } from 'src/shared/schemas/os1/marketplace/service/subscription.pb';
import { SubscriptionDTO } from '../dto/subscription/subscription.dto';
export class TestHelpers extends TestHelpersBase {
  static ClientGrpcMock(name: string) {
    return {
      provide: name,
      useValue: {},
    };
  }

  static ApplicationServiceClientMock() {
    return {
      registerApplication: jest.fn(),
      addApplicationVersion: jest.fn(),
      classifyApplication: jest.fn(),
      addUrlOverride: jest.fn(),
      deleteUrlOverride: jest.fn(),
      changeApplicationDisplayAttributes: jest.fn(),
      migrateFirstPartyApplication: jest.fn(),
      addApplicationIcon: jest.fn(),
      replaceApplicationIcon: jest.fn(),
      addApplicationDocument: jest.fn(),
      deleteApplicationDocument: jest.fn(),
      addApplicationPermissions: jest.fn(),
      deleteApplicationPermissions: jest.fn(),
      submitForTechReview: jest.fn(),
      approveTechReview: jest.fn(),
      declineTechReview: jest.fn(),
      withdrawTechReview: jest.fn(),
      submitForInternalPublishReview: jest.fn(),
      submitForMarketplacePublishReview: jest.fn(),
      approveInternalPublish: jest.fn(),
      approveMarketplacePublish: jest.fn(),
      depreciate: jest.fn(),
      getApplicationByVersionId: jest.fn(),
      getApplicationByApplicationId: jest.fn(),
      listApplicationsByOrgTeamId: jest.fn(),
      getApplicationByUrlPath: jest.fn(),
    };
  }

  static SolutionServiceClientMock() {
    return {
      registerSolution: jest.fn(),
      addSolutionVersion: jest.fn(),
      addSolutionIcon: jest.fn(),
      replaceSolutionIcon: jest.fn(),
      addSolutionImage: jest.fn(),
      removeSolutionImage: jest.fn(),
      addSolutionDocument: jest.fn(),
      removeSolutionDocument: jest.fn(),
      addSolutionConfigurationFile: jest.fn(),
      addApplicationToSolution: jest.fn(),
      removeApplicationFromSolution: jest.fn(),
      changeSolutionDisplayAttributes: jest.fn(),
      changeSolutionTerms: jest.fn(),
      classifySolution: jest.fn(),
      submitForTechReview: jest.fn(),
      approveTechReview: jest.fn(),
      declineTechReview: jest.fn(),
      withdrawTechReview: jest.fn(),
      submitForInternalPublishReview: jest.fn(),
      submitForMarketplacePublishReview: jest.fn(),
      approveInternalPublish: jest.fn(),
      approveMarketplacePublish: jest.fn(),
      depreciate: jest.fn(),
      addSolutionInitializationConfiguration: jest.fn(),
      getSolutionByVersionId: jest.fn(),
      getSolutionBySolutionId: jest.fn(),
      listSolutionsByOrgId: jest.fn(),
    };
  }

  static SubscriptionServiceClientMock(): SubscriptionServiceClient {
    return {
      startSolutionTrial: jest.fn(),
      upgradeSolutionTailToProduction: jest.fn(),
      startApplicationTrial: jest.fn(),
      upgradeApplicationTailToProduction: jest.fn(),
      subscribeSolutionToDeveloperOrg: jest.fn(),
      subscribeApplicationToDeveloperOrg: jest.fn(),
      getSubscriptionsByOrganizationId: jest.fn(),
      getSubscriptionsByOrganizationDomain: jest.fn(),
      getSubscriptionsBySubscriptionId: jest.fn(),
      retryFailedSubscription: jest.fn(),
      getSubscriptionsByTenantId: jest.fn(),
    };
  }

  static CoreosAgentServiceClientMock(): CoreosAgentServiceClient {
    return {
      createCoreosApp: jest.fn(),
      addCoreosAppPermissions: jest.fn(),
      addTenantToRegistry: jest.fn(),
      allocateAnyAvailableTenantToOrganization: jest.fn(),
      assignAppToTenantAdmin: jest.fn(),
      getTenantById: jest.fn(),
      listAllTenants: jest.fn(),
      getAppPermissionsUploadStatus: jest.fn(),
      getAppsForCoreosUser: jest.fn(),
      addUmsAdminDesignationToTenant: jest.fn(),
      changeCoreosTenantOrgCountry: jest.fn(),
      changeCoreosTenantSubscriptionType: jest.fn(),
      getTenantByOrgShortName: jest.fn(),
    };
  }

  static FileServiceClientMock(): FileServiceClient {
    return {
      createFile: jest.fn(),
      getFile: jest.fn(),
    };
  }

  static CreateGetApplicationByApplicationIdResponse(
    appId?: string,
    appVersionId?: string,
  ): GetApplicationByApplicationIdResponse {
    // Leaving it as json for this PR.
    // All testing utils needs to be moved to a shared testing library.
    appId = appId || this.CreateRandomAppId();
    appVersionId = appVersionId || this.CreateRandomAppVersionId();
    const applicationResponse: GetApplicationByApplicationIdResponse = {
      application: {
        id: {
          appId: appId,
        },
        name: faker.random.word(),
        urlPath: this.CreateRandomUrlPath(),
        urn: this.CreateRandomAppUrn(),
        orgTeam: {
          organization: {
            organizationId: this.CreateRandomOrganizationId(),
            domain: this.CreateRandomorganizationDomain(),
            dns: this.CreateRandomOrganizationDns(),
          },
          teamId: this.CreateRandomOrganizationTeamId(),
        },
        clientCredentials: {
          clientId: this.CreateRandomClientId(),
          clientSecretPlainText: faker.datatype.uuid(),
          clientSecretEncrypted: {
            iv: faker.datatype.uuid(),
            encryptedText:
              faker.datatype.uuid() +
              faker.datatype.uuid() +
              faker.datatype.uuid(),
          },
        },
        appType: ApplicationType.BACKEND,
        appClassification: ApplicationClassification.CORE,
        redirectUris: [faker.internet.url()],
        subscriptionCredentials: {
          clientId: this.CreateRandomClientId(),
          clientSecretEncrypted: {
            iv: faker.datatype.uuid(),
            encryptedText:
              faker.datatype.uuid() +
              faker.datatype.uuid() +
              faker.datatype.uuid(),
          },
          clientSecretPlainText: faker.datatype.uuid(),
        },
        versions: [
          {
            id: {
              appId: appId,
              appVersionId: appVersionId,
            },
            displayName: this.CreateRandomDisplayName(),
            version: this.CreateRandomSemver(),
            description: faker.lorem.paragraph(),
            applicationCompitablity: {
              isMarketplaceCompatible: faker.datatype.boolean(),
              isConsoleCompatible: faker.datatype.boolean(),
              compitableSolutions: [],
            },
            privacy: {
              type: ApplicationPrivacy_Type.PRIVATE,
            },
            applicationPhase: ApplicationPhase.TECH_REVIEW,
            appUrlOverrides: [],
            appUrls: [],
            categories: [],
            appIcons: [],
            displayImages: [],
            documents: [],
            longDescription: faker.lorem.paragraph(),
            shortDescription: faker.lorem.sentence(),
            state: {
              createApp: 'SUCCESS',
              grantPerimssions: 'SUCCESS',
              subscribeApp: 'SUCCESS',
            },
            permissions: [this.CreateGetFileResponse()],
            hosting: ApplicationHosting.PLATFORM,
            recordStatus: {
              isActive: faker.datatype.boolean(),
              isDeleted: faker.datatype.boolean(),
            },
            recordAudit: {
              createdBy: faker.datatype.uuid(),
              updatedBy: faker.datatype.uuid(),
              createdAt: faker.date.past().toISOString(),
              updatedAt: faker.date.past().toISOString(),
            },
          },
        ],
      },
    };
    return applicationResponse;
  }
  static CreateGetSolutionBySolutionIdResponse(
    solutionId?: string,
    solutionVersionId?: string,
  ): GetSolutionBySolutionIdResponse {
    const solutionResponse: GetSolutionBySolutionIdResponse = {
      solution: {
        id: {
          solutionId: solutionId ?? this.CreateRandomSolutionId(),
        },
        urn: this.CreateRandomSolutionUrn(),
        organization: {
          organizationId: this.CreateRandomOrganizationId(),
          domain: this.CreateRandomorganizationDomain(),
          dns: this.CreateRandomOrganizationDns(),
        },
        version: [
          {
            id: {
              solutionId: solutionId ?? this.CreateRandomSolutionId(),
              solutionVersionId:
                solutionVersionId ?? this.CreateRandomSolutionVersionId(),
            },
            version: this.CreateRandomSemver(),
            displayAttributes: {
              displayName: this.CreateRandomDisplayName(),
              shortDescription: faker.lorem.paragraph(),
              longDescription: faker.lorem.paragraphs(),
            },
            classification: {
              categories: [faker.random.word()],
            },
            phase: SolutionPhase.TECH_REVIEW,
            compatibility: {
              isMarketplaceCompatible: true,
              isConsoleCompatible: true,
            },
            applications: [],
            recordStatus: {
              isActive: true,
              isDeleted: false,
            },
            recordAudit: {
              createdBy: faker.datatype.uuid(),
              updatedBy: faker.datatype.uuid(),
              createdAt: faker.date.past().toISOString(),
              updatedAt: faker.date.past().toISOString(),
            },
            submissionId: '0',
            configurations: [],
            terms: {
              isCopyrightFree: faker.datatype.boolean(),
            },
            displayImages: [],
            documents: [],
            icons: [],
            initializationConfiguration: {
              appInitializationSequence: [],
            },
          },
        ],
      },
    };

    const applicationsReferenced = [
      {
        appId: this.CreateRandomAppId(),
        appVersionId: this.CreateRandomAppVersionId(),
      },
      {
        appId: this.CreateRandomAppId(),
        appVersionId: this.CreateRandomAppVersionId(),
      },
      {
        appId: this.CreateRandomAppId(),
        appVersionId: this.CreateRandomAppVersionId(),
      },
      {
        appId: this.CreateRandomAppId(),
        appVersionId: this.CreateRandomAppVersionId(),
      },
    ];

    solutionResponse.solution.version[0].applications = applicationsReferenced;

    // update intialization configuration based on available applications
    for (const app of applicationsReferenced) {
      solutionResponse.solution.version[0].initializationConfiguration.appInitializationSequence.push(
        {
          appUrn: this.CreateRandomAppUrn(),
          id: app,
          initilizationSequenceNumber: faker.datatype.number({
            min: 1,
            max: 10,
          }),
        } as SolutionInitializationConfiguration_AppInitializationSequence,
      );
    }
    return solutionResponse;
  }

  static CreateGetFileResponse(): File {
    return {
      id: {
        fileId: faker.datatype.uuid(),
      },
      attributes: {
        fileName: faker.system.fileName(),
        fileDescription: faker.lorem.paragraph(),
        fileUrl: faker.internet.url(),
      },
      fileBinary: new TextEncoder().encode('file content in string'),
    };
  }

  static CreateSubscriptionDTO(): SubscriptionDTO {
    const subscriptionDTO: SubscriptionDTO = {
      subscriptionId: faker.datatype.uuid(),
      applications: [],
      solutions: [],
      status: {
        status: 'ACTIVE',
        requestedAt: faker.date.past().toISOString(),
        activatedAt: faker.date.past().toISOString(),
      },
      tier: {
        displayName: faker.random.word(),
        periodInDays: faker.datatype.number(),
        planType: faker.random.word(),
      },
    };
    return subscriptionDTO;
  }
}
