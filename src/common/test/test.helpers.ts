import { faker } from '@faker-js/faker';
import { TestHelpersBase } from '@foxtrotplatform/developer-platform-core-lib';
import { File } from 'src/shared/schemas/os1/core/file/file.pb';
import { CoreosAgentServiceClient } from 'src/shared/schemas/os1/core/service/coreosagent.pb';
import { FileServiceClient } from 'src/shared/schemas/os1/core/service/file.pb';
import { DateTime } from 'luxon';
import {
  GetApplicationByApplicationIdResponse,
  GetApplicationByVersionIdResponse,
} from 'src/shared/schemas/os1/developerportal/application/response.pb';
import {
  GetSolutionBySolutionIdResponse,
  GetSolutionByVersionIdResponse,
} from 'src/shared/schemas/os1/developerportal/solution/response.pb';
import {
  SolutionInitializationConfiguration_AppInitializationSequence,
  SolutionPhase,
  SolutionVersion_Application,
  SolutionVersion,
} from 'src/shared/schemas/os1/developerportal/solution/solution.pb';
import { SubscriptionDTO } from '../dto/subscription/subscription.dto';
import { ApplicationServiceV2Client } from 'src/shared/schemas/os1/developerportal/service/application-v2.pb';
import mock from 'jest-mock-extended/lib/Mock';
import { SubscriptionServiceClient } from 'src/shared/schemas/os1/marketplace/service/subscription.pb';
import { SolutionDTO } from '../dto/solution/solution.dto';
import {
  AppType,
  ApplicationDTO,
  ApplicationUrlDTO,
} from '../dto/application/application.dto';
import { FileMetadataDTO } from '../dto/common/common.dto';
import {
  GetTenantByIdResponse,
  GetTenantConfigsByTenantIdResponse,
} from 'src/shared/schemas/os1/core/coreosagent/response.pb';
export class TestHelpers extends TestHelpersBase {
  static ClientGrpcMock(name: string) {
    return {
      provide: name,
      useValue: {},
    };
  }

  static ApplicationServiceClientMock(): ApplicationServiceV2Client {
    return mock<ApplicationServiceV2Client>();
  }

  static SubscriptionServiceClientMock(): SubscriptionServiceClient {
    return mock<SubscriptionServiceClient>();
  }

  static CoreosAgentServiceClientMock(): CoreosAgentServiceClient {
    return mock<CoreosAgentServiceClient>();
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

  static CreateGetApplicationByVersionIdResponse(): GetApplicationByVersionIdResponse {
    // Leaving it as json for this PR.
    // All testing utils needs to be moved to a shared testing library.
    return GetApplicationByApplicationIdResponse.fromJSON({
      application: {
        id: {
          appId: 'app:1a209038-ab3d-5066-b64c-42bfeef091db',
        },
        name: faker.random.word(),
        urlPath: faker.random.word(),
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
            description: '',
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

  static CreateGetTenantByIdResponse(
    isDeveloperTenant: boolean = true,
  ): GetTenantByIdResponse {
    // Leaving it as json for this PR.
    // All testing utils needs to be moved to a shared testing library.
    return GetTenantByIdResponse.fromJSON({
      tenant: {
        tenantId: 'random',
        tenantName: 'random',
        tenantDescription: 'dummy tenant',
        tenantStatus: 'ALLOCATED',
        tenantDns: 'random.getos1.com',
        stackId: 'sb1',
        isDeveloperTenant,
      },
    });
  }

  static CreateGetTenantConfigsByTenantIdResponse(): GetTenantConfigsByTenantIdResponse {
    return {
      configs: [
        {
          typeName: 'type',
          alias: {
            singular: 'dummy',
            plural: 'dummies',
          },
          attributes: {},
        },
      ],
    };
  }

  static CreateRandomAppVersionId(): string {
    return `appversion:${faker.datatype.uuid()}`;
  }

  static CreateRandomSolutionId(): string {
    return `solution:${faker.datatype.uuid()}`;
  }

  static CreateRandomSolutionVersionId(): string {
    return `solutionversion:${faker.datatype.uuid()}`;
  }

  static CreateRandomOrganizationId(): string {
    return faker.datatype.uuid();
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
        solutionType: 0,
        productFamily: this.CreateRandomSolutionId(),
        supportedCountries: [],
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
        listingId: faker.datatype.string(),
        semver: faker.datatype.string(),
      },
      {
        id: {
          appId: this.CreateRandomAppId(),
          appVersionId: this.CreateRandomAppVersionId(),
        },
        displayOrder: faker.datatype.number(),
        listingId: faker.datatype.string(),
        semver: faker.datatype.string(),
      },
      {
        id: {
          appId: this.CreateRandomAppId(),
          appVersionId: this.CreateRandomAppVersionId(),
        },
        displayOrder: faker.datatype.number(),
        listingId: faker.datatype.string(),
        semver: faker.datatype.string(),
      },
      {
        id: {
          appId: this.CreateRandomAppId(),
          appVersionId: this.CreateRandomAppVersionId(),
        },
        displayOrder: faker.datatype.number(),
        listingId: faker.datatype.string(),
        semver: faker.datatype.string(),
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

  static CreateGetSolutionByVersionIdResponse(
    solutionId?: string,
    solutionVersionId?: string,
  ): GetSolutionByVersionIdResponse {
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
        solutionType: 0,
        productFamily: this.CreateRandomSolutionId(),
        supportedCountries: [],
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
        listingId: faker.datatype.string(),
        semver: faker.datatype.string(),
      },
      {
        id: {
          appId: this.CreateRandomAppId(),
          appVersionId: this.CreateRandomAppVersionId(),
        },
        displayOrder: faker.datatype.number(),
        listingId: faker.datatype.string(),
        semver: faker.datatype.string(),
      },
      {
        id: {
          appId: this.CreateRandomAppId(),
          appVersionId: this.CreateRandomAppVersionId(),
        },
        displayOrder: faker.datatype.number(),
        listingId: faker.datatype.string(),
        semver: faker.datatype.string(),
      },
      {
        id: {
          appId: this.CreateRandomAppId(),
          appVersionId: this.CreateRandomAppVersionId(),
        },
        displayOrder: faker.datatype.number(),
        listingId: faker.datatype.string(),
        semver: faker.datatype.string(),
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
  static createSolutionDTO(): SolutionDTO {
    const solutionDTO: SolutionDTO = {
      solutionId: faker.datatype.uuid(),
      solutionVersionId: faker.datatype.uuid(),
      displayName: faker.random.words(),
      shortDescription: faker.lorem.sentence(),
      longDescription: faker.lorem.paragraph(),
      version: faker.system.semver(),
      images: [],
      icon: {
        fileId: faker.datatype.uuid(),
        fileName: faker.system.fileName(),
        fileUrl: faker.internet.url(),
        fileDescription: '',
      },
      applications: [this.createApplicationDTO(false)],
      isMarketplaceCompatible: faker.datatype.boolean(),
      isConsoleCompatible: faker.datatype.boolean(),
      solutionAppSetting: [
        {
          appName: faker.random.word(),
          appUrn: faker.random.word(),
          displayName: faker.random.words(),
          settingsUrl: faker.internet.url(),
        },
      ],
      landingPage: faker.system.directoryPath(),
    };

    return solutionDTO;
  }

  static createApplicationDTO(
    hasSettings: boolean,
    hasIcon = true,
    hasDescription = true,
  ): ApplicationDTO {
    const applicationDTO: ApplicationDTO = {
      appId: faker.datatype.uuid(),
      appVersionId: faker.datatype.uuid(),
      listingName: faker.random.words(),
      version: faker.system.semver(),
      urlPath: faker.random.word(),
      appType: faker.random.word() as AppType,
      isPrivate: faker.datatype.boolean(),
      consoleCompatible: faker.datatype.boolean(),
      appUrls: [
        hasSettings
          ? ({
              name: 'setting',
              url: '/settings',
              description: hasDescription ? 'description' : undefined,
            } as ApplicationUrlDTO)
          : ({
              name: 'relativePath',
              url: `/analytics/${faker.random.word()}/`,
            } as ApplicationUrlDTO),
      ],
      urlOverrides: [
        {
          name: 'interface',
          url: `/analytics/${faker.random.word()}/`,
        } as ApplicationUrlDTO,
      ],
      icon: {
        fileId: faker.datatype.uuid(),
        fileName: faker.system.fileName(),
        fileDescription: faker.system.mimeType(),
        fileUrl:
          'https://cdn.getos1.com/7adcf59e-c5df-418f-8645-e82f2a5231b6-default_icon.png',
      } as FileMetadataDTO,
      images: [],
      shortDescription: faker.lorem.sentence(),
      description: '',
      longDescription: '',
      applicationMenu: [],
      settingsIcon: hasIcon
        ? ({
            fileId: faker.datatype.uuid(),
            fileName: faker.system.fileName(),
            fileDescription: faker.system.mimeType(),
            fileUrl:
              'https://cdn.getos1.com/7adcf59e-c5df-418f-8645-e82f2a5231b6-default_icon.png',
          } as FileMetadataDTO)
        : undefined,
    };

    return applicationDTO;
  }
}