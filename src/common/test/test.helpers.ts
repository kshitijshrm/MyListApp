import { faker } from '@faker-js/faker';
import { TestHelpersBase } from '@foxtrotplatform/developer-platform-core-lib';
import { DateTime } from 'luxon';
import { File } from 'src/shared/schemas/os1/core/file/file.pb';
import { CoreosAgentServiceClient } from 'src/shared/schemas/os1/core/service/coreosagent.pb';
import { FileServiceClient } from 'src/shared/schemas/os1/core/service/file.pb';
import { DateTime } from 'luxon';
import { GetApplicationByApplicationIdResponse } from 'src/shared/schemas/os1/developerportal/application/response.pb';
import { GetSolutionBySolutionIdResponse } from 'src/shared/schemas/os1/developerportal/solution/response.pb';
import {
  SolutionInitializationConfiguration_AppInitializationSequence,
  SolutionPhase,
  SolutionVersion,
  SolutionVersion_Application,
  SolutionVersion,
} from 'src/shared/schemas/os1/developerportal/solution/solution.pb';
import { SubscriptionDTO } from '../dto/subscription/subscription.dto';
export class TestHelpers extends TestHelpersBase {
  static ClientGrpcMock(name: string) {
    return {
      provide: name,
      useValue: {},
    };
  }  

  static ApplicationServiceClientMock(): ApplicationServiceClient {
    return {
      registerApplication: jest.fn(),
      addApplicationVersion: jest.fn(),
      classifyApplication: jest.fn(),
      addUrlOverride: jest.fn(),
      deleteUrlOverride: jest.fn(),
      changeApplicationDisplayAttributes: jest.fn(),
      changeApplicationProductionSecrets: jest.fn(),
      changeApplicationUrls: jest.fn(),
      migrateFirstPartyApplication: jest.fn(),
      addApplicationIcon: jest.fn(),
      deleteApplicationUrl: jest.fn(),
      addSolutionCompatablity: jest.fn(),
      removeSolutionCompatablity: jest.fn(),
      lookupRelativePath: jest.fn(),
      listCompatibleAppsBySolutionId: jest.fn(),
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
      addApplicationNavigationMenuItem: jest.fn(),
      deleteApplicationNavigationMenuItem: jest.fn(),
      changeApplicationNavigationMenuItemAttributes: jest.fn(),
      addApplicationPermissionsForWebClient: jest.fn(),
      check: jest.fn(),
      watch: jest.fn(),
    };
  }

  static SolutionServiceClientMock(): SolutionServiceClient {
    return {
      registerSolution: jest.fn(),
      addSolutionVersion: jest.fn(),
      addSolutionIcon: jest.fn(),
      replaceSolutionIcon: jest.fn(),
      addSolutionImage: jest.fn(),
      changeSolutionCompatibility: jest.fn(),
      changeSolutionVisibility: jest.fn(),
      listSolutionsByPhase: jest.fn(),
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
      changeApplicationDisplayOrder: jest.fn(),
      check: jest.fn(),
      watch: jest.fn(),
    };
  }

  static SubscriptionServiceClientMock(): SubscriptionServiceClient {
    return {
      changeRecordStatus: jest.fn(),
      check: jest.fn(),
      watch: jest.fn(),
      disableSubscription: jest.fn(),
      getSubscriptionsByOrganizationDomain: jest.fn(),
      getSubscriptionsByOrganizationId: jest.fn(),
      getSubscriptionsBySubscriptionId: jest.fn(),
      getSubscriptionsByTenantId: jest.fn(),
      listSubscriptionsByTenantIds: jest.fn(),
      retryFailedSubscription: jest.fn(),
      startApplicationTrial: jest.fn(),
      startSolutionTrial: jest.fn(),
      subscribeApplicationToDeveloperOrg: jest.fn(),
      subscribeSolutionToDeveloperOrg: jest.fn(),
      updateSubscriptionItemVersion: jest.fn(),
      upgradeSubscription: jest.fn(),
      changeSubscriptionExpiryDate: jest.fn(),
      listActiveSubscriptions: jest.fn(),
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
      changeCoreosTenantSubscriptionType: jest.fn(),
      getTenantByOrgShortName: jest.fn(),
      addDeveloperTenantToRegistry: jest.fn(),
      allocateAnyAvailableDeveloperTenantToOrganization: jest.fn(),
      changeCoreosTenantOrgDetails: jest.fn(),
      updateTenantState: jest.fn(),
      addUmsUser: jest.fn(),
      check: jest.fn(),
      watch: jest.fn(),
    };
  }

  static FileServiceClientMock(): FileServiceClient {
    return {
      createFile: jest.fn(),
      getFile: jest.fn(),
      check: jest.fn(),
      watch: jest.fn(),
      createFileInBucket: jest.fn(),
    };
  }

  static CreateGetApplicationByApplicationIdResponse(): GetApplicationByApplicationIdResponse {
    // Leaving it as json for this PR.
    // All testing utils needs to be moved to a shared testing library.
    return GetApplicationByApplicationIdResponse.fromJSON({
      application: {
        id: {
          appId: 'app:1a209038-ab3d-5066-b64c-42bfeef091db',
        },
        name: 'Baht',
        urlPath: 'Baht',
        urn: 'platform:app:undefined',
        orgTeam: {
          organization: {
            organizationId: '5d5e08b5-b989-4c72-b5b6-134071fe7bd4',
            domain: 'platformcoreos',
            dns: 'platformcoreos.dev.fxtrt.io',
          },
          teamId: '126939ff-e9c1-4da7-866c-aa727d5eef6a',
        },
        clientCredentials: {
          clientId: 'platform:app:undefined-backend',
          clientSecretPlainText: 'df5f683a-2445-4f96-9b1b-9c30065798bd',
          clientSecretEncrypted: {
            iv: '6d86d58d1fefc078a0523b3728ff5f09',
            encryptedText:
              '4d89ba67ff5aab22c1e3ce6e3c5f55ef8a59fc3e65f09254fa96eed8051879515469ae30',
          },
        },
        appType: 'BACKEND',
        versions: [
          {
            id: {
              appId: 'app:1a209038-ab3d-5066-b64c-42bfeef091db',
              appVersionId: 'appversion:8710fa5d-f11c-525d-a702-ed5aae7ce86a',
            },
            displayName: 'Schultz Group',
            version: '1.0.0',
            description:
              'Esse fugit neque in. Earum ut vel tempore dolorem. Sit cum et quaerat cupiditate quos molestias laboriosam ut.',
            applicationCompitablity: {
              isMarketplaceCompatible: false,
              isConsoleCompatible: false,
            },
            privacy: {
              type: 'PRIVATE',
            },
            record_status: {
              isActive: true,
              isDeleted: false,
            },
            recordAudit: {
              createdBy: '49ff2aa4-568c-4471-b534-50e5491d7596',
              createdAt:
                'Thu Aug 25 2022 12:17:23 GMT-0400 (Eastern Daylight Time)',
              updatedBy: '707c8d2d-53f6-4faf-a614-cffbe0e77fe6',
              updatedAt:
                'Thu Aug 25 2022 12:17:28 GMT-0400 (Eastern Daylight Time)',
            },
          },
        ],
      },
    });
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
            phase: SolutionPhase.DRAFT,
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
              createdAt: DateTime.local().toISO(),
              updatedBy: faker.datatype.uuid(),
              updatedAt: DateTime.local().toISO(),
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
            solutionState: {
              status: 'Active',
              requestedAt: DateTime.utc().toISO(),
              activatedAt: DateTime.utc().toISO(),
              logs: [],
            },
            associatedApplications: [],
          } as SolutionVersion,
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

    const associatedApplications: SolutionVersion_Application[] = [
      {
        id: {
          appId: this.CreateRandomAppId(),
          appVersionId: this.CreateRandomAppVersionId(),
        },
        displayOrder: faker.datatype.number(),
      },
      {
        id: {
          appId: this.CreateRandomAppId(),
          appVersionId: this.CreateRandomAppVersionId(),
        },
        displayOrder: faker.datatype.number(),
      },
      {
        id: {
          appId: this.CreateRandomAppId(),
          appVersionId: this.CreateRandomAppVersionId(),
        },
        displayOrder: faker.datatype.number(),
      },
      {
        id: {
          appId: this.CreateRandomAppId(),
          appVersionId: this.CreateRandomAppVersionId(),
        },
        displayOrder: faker.datatype.number(),
      },
    ];

    solutionResponse.solution.version[0].applications = applicationsReferenced;
    solutionResponse.solution.version[0].associatedApplications =
      associatedApplications;

    // update intialization configuration based on available applications
    for (const app of associatedApplications) {
      solutionResponse.solution.version[0].initializationConfiguration.appInitializationSequence.push(
        {
          appUrn: this.CreateRandomAppUrn(),
          id: app.id,
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
        filePath: faker.system.filePath(),
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
