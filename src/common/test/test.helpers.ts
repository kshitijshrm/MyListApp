import { faker } from '@faker-js/faker';
import {
  DEVELOPERPLATFORM_USER_ROLES,
  PlatformRequestContext,
  TestHelpersBase,
  X_DEVELOPERPLATFORM,
} from '@foxtrotplatform/developer-platform-core-lib';
import { Observable } from 'rxjs';
import { CreateFileResponse } from 'src/shared/schemas/os1/core/file/response.pb';
import { ApplicationLifeCycleTransitionRequest } from 'src/shared/schemas/os1/developerportal/application/request.pb';
import { GetApplicationByApplicationIdResponse } from 'src/shared/schemas/os1/developerportal/application/response.pb';
import {
  GetSolutionBySolutionIdResponse,
  RegisterSolutionResponse,
} from 'src/shared/schemas/os1/developerportal/solution/response.pb';
import {
  AppClassification,
  AppStatus,
  AppType,
} from '../dto/application/application.dto';
import {
  MutableAppAttributesDTO,
  RegisterAppRequestDTO,
} from '../dto/application/request.dto';
import {
  AppResponseDTO,
  IsAppAvailableForRegistrationResponse,
  RegisterAppResponseDTO,
} from '../dto/application/response.dto';
import {
  ConfigurationMetadataDTO,
  DocumentMetadataDTO,
  FileMetadataDTO,
} from '../dto/common/common.dto';
import {
  MutableSolutionAttributesDTO,
  RegisterSolutionRequestDTO,
} from '../dto/solution/request.dto';
import {
  RegisterSolutionResponseDTO,
  SolutionResponseDTO,
} from '../dto/solution/response.dto';
import {
  SolutionApplicaitonDTO,
  SolutionPhase,
  SolutionVersionIdentifierDTO,
} from '../dto/solution/solution.dto';
export class TestHelpers extends TestHelpersBase {
  static CreatePlatformContext(): PlatformRequestContext {
    const ctx: PlatformRequestContext = {
      userId: faker.datatype.uuid(),
      requestId: faker.datatype.uuid(),
      correlationId: faker.datatype.uuid(),
      causationId: faker.datatype.uuid(),
    };
    return ctx;
  }

  static CreateRandomOrgId(): string {
    return faker.datatype.uuid();
  }

  static CreateRandomTeamId(): string {
    return faker.datatype.uuid();
  }

  static CreateRandomFileId(): string {
    return faker.datatype.uuid();
  }

  static CreateRandomAppId(): string {
    return `app:${faker.datatype.uuid()}`;
  }

  static CreateRandomAppVersionId(): string {
    return `appversion:${faker.datatype.uuid()}`;
  }

  static CreateRandomUrlPath(): string {
    return faker.random.alpha({
      count: 6,
      casing: 'lower',
    });
  }

  static CreateRandomDisplayName(): string {
    return faker.random.words(3);
  }

  static CreateRandomDescription(): string {
    return faker.random.words(10);
  }

  static CreateRandomLongDescription(): string {
    return faker.random.words(30);
  }

  static CreateRandomClientId(): string {
    return `platfomr:app:${this.CreateRandomUrlPath()}`;
  }

  static CreateRandomClientSecretPlainText(): string {
    return faker.datatype.uuid();
  }

  static CreateRegisterSolutionResponseDTO(): RegisterSolutionResponseDTO {
    const registerSolutionResponseDTO: RegisterSolutionResponseDTO = {
      solutionId: this.CreateRandomSolutionId(),
    };
    return registerSolutionResponseDTO;
  }

  static CreateAppResponseDTO(): AppResponseDTO {
    const appResponseDTO: AppResponseDTO = {
      appId: this.CreateRandomAppId(),
      appVersionId: this.CreateRandomAppVersionId(),
      listingName: this.CreateRandomUrlPath(),
      version: '1.0.0',
      clientId: this.CreateRandomClientId(),
      clientSecret: this.CreateRandomClientSecretPlainText(),
      urlPath: this.CreateRandomUrlPath(),
      appType: AppType.web,
      description: this.CreateRandomDescription(),
      isPrivate: faker.datatype.boolean(),
      consoleCompatible: faker.datatype.boolean(),
      status: AppStatus.DEVELOPMENT,
    };
    return appResponseDTO;
  }

  static CreateFileMetadataDTO(): FileMetadataDTO {
    const fileMetadataDTO: FileMetadataDTO = {
      fileId: this.CreateRandomFileId(),
      fileName: faker.system.fileName(),
      fileDescription: faker.lorem.paragraph(),
      fileUrl: faker.internet.url(),
    };
    return fileMetadataDTO;
  }

  static CreateDocumentMetadataDTO(): DocumentMetadataDTO {
    const fileMetadataDTO: DocumentMetadataDTO = {
      category: faker.random.word(),
      document: this.CreateFileMetadataDTO(),
    };
    return fileMetadataDTO;
  }

  static CreateConfigurationMetadataDTO(): ConfigurationMetadataDTO {
    const fileMetadataDTO: ConfigurationMetadataDTO = {
      category: faker.random.word(),
      configurationFile: this.CreateFileMetadataDTO(),
    };
    return fileMetadataDTO;
  }

  static CreateSolutionApplicaitonDTO(): SolutionApplicaitonDTO {
    const solutionApplicationDTO: SolutionApplicaitonDTO = {
      appId: this.CreateRandomAppId(),
      appVersionId: this.CreateRandomAppVersionId(),
    };
    return solutionApplicationDTO;
  }

  static CreateSolutionResponseDTO(): SolutionResponseDTO {
    const solResponseDTO: SolutionResponseDTO = {
      solutionId: this.CreateRandomAppId(),
      solutionVersionId: this.CreateRandomAppVersionId(),
      displayName: this.CreateRandomUrlPath(),
      version: this.CreateRandomSemver(),
      shortDescription: this.CreateRandomDiscription(),
      longDescription: this.CreateRandomDiscription(),
      phase: SolutionPhase.DRAFT,
      categories: [faker.random.word()],
      isCopyrightFree: faker.datatype.boolean(),
      configurations: [this.CreateConfigurationMetadataDTO()],
      icon: this.CreateFileMetadataDTO(),
      images: [this.CreateFileMetadataDTO()],
      documents: [this.CreateDocumentMetadataDTO()],
      applications: [this.CreateSolutionApplicaitonDTO()],
      isMarketplaceCompatible: faker.datatype.boolean(),
      isConsoleCompatible: faker.datatype.boolean(),
    };
    return solResponseDTO;
  }

  static CreateFileResponse(): Observable<CreateFileResponse> {
    const response: CreateFileResponse = {
      fileMetadata: {
        id: {
          fileId: this.CreateRandomFileId(),
        },
        attributes: {
          fileName: 'testFile',
          fileDescription: 'test description',
          fileUrl: 'test.url',
        },
      },
    };
    return new Observable(() => {
      response;
    });
  }

  static CreateRegisterAppRequestDTO(): RegisterAppRequestDTO {
    const registerAppRequestDTO: RegisterAppRequestDTO = {
      listingName: faker.name.firstName(),
      version: '1.0.0',
      urlPath: faker.internet.url(),
      appType: AppType.web,
      description: faker.lorem.paragraph(),
      consoleCompatible: faker.datatype.boolean(),
      isPrivate: faker.datatype.boolean(),
      url: undefined,
      shortDescription: faker.random.words(10),
      longDescription: faker.random.words(30),
    };
    return registerAppRequestDTO;
  }

  static CreateRegisterAppResponseDTO(): RegisterAppResponseDTO {
    const registerAppResponseDTO: RegisterAppResponseDTO = {
      appId: this.CreateRandomAppId(),
    };
    return registerAppResponseDTO;
  }

  static CreateMutableAppAttributesDTO(): MutableAppAttributesDTO {
    const mutableAppAttributesDTO: MutableAppAttributesDTO = {
      listingName: this.CreateRandomDisplayName(),
      description: this.CreateRandomDescription(),
      isPrivate: faker.datatype.boolean(),
      appClassification: faker.helpers.arrayElement([
        AppClassification.ADDON,
        AppClassification.CORE,
        AppClassification.STANDARD,
      ]),
      is_marketplace_compatible: faker.datatype.boolean(),
      is_console_compatible: faker.datatype.boolean(),
      shortDescription: this.CreateRandomDescription(),
      longDescription: this.CreateRandomLongDescription(),
    };
    return mutableAppAttributesDTO;
  }

  static CreateIsAppAvailableForRegistrationResponse(): IsAppAvailableForRegistrationResponse {
    const response: IsAppAvailableForRegistrationResponse = {
      appUrlPath: {
        available: faker.datatype.boolean(),
      },
    };
    return response;
  }

  static CreateApplicationLifeCycleTransitionRequest(): ApplicationLifeCycleTransitionRequest {
    const request: ApplicationLifeCycleTransitionRequest = {
      id: {
        appId: this.CreateRandomAppId(),
        appVersionId: this.CreateRandomAppVersionId(),
      },
    };
    return request;
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

  static CreateRegisterSolutionRequestDTO() {
    const request: RegisterSolutionRequestDTO = {
      displayName: this.CreateRandomDisplayName(),
      version: this.CreateRandomSemver(),
      shortDescription: this.CreateRandomDiscription(),
      categories: [faker.random.word()],
    };
    return request;
  }

  static CreateRegisterSolutionResponse() {
    const response: RegisterSolutionResponse = {
      id: {
        solutionId: this.CreateRandomSolutionId(),
        solutionVersionId: this.CreateRandomSolutionVersionId(),
      },
    };
    return response;
  }

  static CreateGetOrganizationAxiosResponse() {
    const response: any = {
      data: {
        data: [
          {
            orgId: this.CreateRandomOrgId(),
            dnsEntry: this.CreateRandomOrganizationDns(),
            uniqueCode: this.CreateRandomorganizationDomain(),
          },
        ],
      },
    };
    return response;
  }

  static CreateGetSolutionBySolutionIdResponse(): GetSolutionBySolutionIdResponse {
    // Leaving it as json for this PR.
    // All testing utils needs to be moved to a shared testing library.
    return GetSolutionBySolutionIdResponse.fromJSON({
      solution: {
        id: {
          solutionId: 'solution:af575e8b-42f6-5cd6-a8d5-71288b48ab43',
        },
        urn: 'platform:solution:af575e8b-42f6-5cd6-a8d5-71288b48ab43',
        organization: {
          organizationId: '47b33c08-6bc1-41f8-9ef5-92e3ce6d5535',
          domain: 'bcrxc',
          dns: 'humming-sightseeing.frivolous-obedience.net',
        },
        version: [
          {
            id: {
              solutionId: 'solution:af575e8b-42f6-5cd6-a8d5-71288b48ab43',
              solutionVersionId:
                'solutionversion:158c938d-d92a-57cb-9cf7-8a930ca196a7',
            },
            version: '0.5.0',
            displayAttributes: {
              displayName: 'reintermediate Books Non',
              shortDescription:
                'female Loan sheepishly shingle mother Books dearest mole Hatchback Rial',
            },
            classification: {
              categories: ['East'],
            },
            phase: 'DRAFT',
            compatibility: {
              isMarketplaceCompatible: true,
              isConsoleCompatible: true,
            },
            applications: [
              {
                app_id: 'app:995d4607-971d-41ff-a154-5aebeea25557',
                app_version_id:
                  'appversion:4d0b831c-38fb-4c27-ad80-8ecbc2c81093',
              },
            ],
            record_status: {
              isActive: true,
              isDeleted: false,
            },
            record_audit: {
              created_by: '7e9a5d08-f43f-4c6b-8b23-f5b95ec29467',
              created_at:
                'Thu Sep 08 2022 14:27:25 GMT-0400 (Eastern Daylight Time)',
              updated_by: 'c5224715-a52e-4ce4-b245-41070fa6678b',
              updated_at:
                'Thu Sep 08 2022 14:27:27 GMT-0400 (Eastern Daylight Time)',
            },
            submission_id: '0',
          },
        ],
      },
    });
  }

  static CreateRandomSolutionVersionIdentifierDTO() {
    const solutionVersionIdentifierDTO: SolutionVersionIdentifierDTO = {
      solutionId: TestHelpers.CreateRandomSolutionId(),
      solutionVersionId: TestHelpers.CreateRandomSolutionVersionId(),
    };
    return solutionVersionIdentifierDTO;
  }

  static CreateRandomMutableSolutionAttributesDTO() {
    const mutableSolutionAttributesDTO: MutableSolutionAttributesDTO = {
      displayName: TestHelpers.CreateRandomDisplayName(),
      shortDescription: TestHelpers.CreateRandomDiscription(),
      categories: [faker.random.word()],
      isCopyrightFree: faker.datatype.boolean(),
      longDescription: TestHelpers.CreateRandomDiscription(),
    };
    return mutableSolutionAttributesDTO;
  }

  static CreateExpressMutlerFile() {
    const file: Express.Multer.File = {
      fieldname: undefined,
      originalname: faker.system.fileName(),
      encoding: 'UTF-8',
      mimetype: 'application/png',
      size: 100,
      stream: undefined,
      destination: undefined,
      filename: faker.system.fileName(),
      path: undefined,
      buffer: Buffer.from(faker.random.word()),
    };
    return file;
  }

  static ApplicationServiceClientMock() {
    return {
      registerApplication: jest.fn(),
      addApplicationVersion: jest.fn(),
      addApplicationIcon: jest.fn(),
      replaceApplicationIcon: jest.fn(),
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
      classifyApplication: jest.fn(),
      addApplicationDocument: jest.fn(),
      deleteApplicationDocument: jest.fn(),
      changeApplicationDisplayAttributes: jest.fn(),
      addUrlOverride: jest.fn(),
      deleteUrlOverride: jest.fn(),
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
      getSolutionByVersionId: jest.fn(),
      getSolutionBySolutionId: jest.fn(),
      listSolutionsByOrgId: jest.fn(),
    };
  }

  static FileServiceClientMock() {
    return {
      createFile: jest.fn(),
      getFile: jest.fn(),
    };
  }

  static ClientGrpcMock(name: string) {
    return {
      provide: name,
      useValue: {},
    };
  }

  // controller test helpers

  static CreateApiHeaders(roleContext?: string) {
    return {
      [X_DEVELOPERPLATFORM.REQUEST_ID]: faker.datatype.uuid(),
      [X_DEVELOPERPLATFORM.USER_ID]: faker.datatype.uuid(),
      [X_DEVELOPERPLATFORM.ROLE]: roleContext ?? faker.datatype.uuid(),
      [X_DEVELOPERPLATFORM.ACCESS_TOKEN]: faker.random.alphaNumeric(64),
    };
  }

  static CreateRoleContext(roles: string[]): string {
    return roles.reduce((acc, role) => {
      return acc + ',' + role;
    });
  }

  static CreateOrganizationRoleContext(
    organization: string,
    roles: string[],
  ): string {
    return this.CreateRoleContext([
      DEVELOPERPLATFORM_USER_ROLES.DEVELOPER_PLATFORM_USER,
      organization,
      roles
        .map((role) => organization + '#' + role)
        .reduce((acc, orgRole) => {
          return acc + ',' + orgRole;
        }),
    ]);
  }

  static CreateOrganizationTeamRoleContext(
    organization: string,
    team: string,
    roles: string[],
  ): string {
    return this.CreateRoleContext([
      DEVELOPERPLATFORM_USER_ROLES.DEVELOPER_PLATFORM_USER,
      organization,
      organization + '#' + team,
      roles
        .map((role) => organization + '#' + team + '#' + role)
        .reduce((acc, orgTeamRole) => {
          return acc + ',' + orgTeamRole;
        }),
    ]);
  }

  static CreateDeveloperPlatformUserContext(): string {
    return this.CreateRoleContext([
      DEVELOPERPLATFORM_USER_ROLES.DEVELOPER_PLATFORM_USER,
    ]);
  }

  static CreateDeveloperContext(
    organizationId: string,
    teamId: string,
  ): string {
    return this.CreateOrganizationTeamRoleContext(
      organizationId ?? this.CreateRandomOrgId(),
      teamId ?? this.CreateRandomTeamId(),
      [DEVELOPERPLATFORM_USER_ROLES.DEVELOPER],
    );
  }

  static CreateDeveloperTeamAdminContext(
    organizationId: string,
    teamId: string,
  ): string {
    return this.CreateOrganizationTeamRoleContext(
      organizationId ?? this.CreateRandomOrgId(),
      teamId ?? this.CreateRandomTeamId(),
      [DEVELOPERPLATFORM_USER_ROLES.DEVELOPER_TEAM_ADMIN],
    );
  }

  static CreateDeveloperPlatformServiceUserContext(
    organizationId: string,
    teamId: string,
  ): string {
    return this.CreateOrganizationTeamRoleContext(
      organizationId ?? this.CreateRandomOrgId(),
      teamId ?? this.CreateRandomTeamId(),
      [DEVELOPERPLATFORM_USER_ROLES.DEVELOPER_PLATFORM_SERVICE_USER],
    );
  }

  static CreateForbiddenErrorResponse() {
    return {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    };
  }
}
