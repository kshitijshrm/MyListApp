import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionDTO } from 'src/common/dto/subscription/subscription.dto';
import { TestHelpers } from 'src/common/test/test.helpers';
import {
  COREOS_AGENT_SERVICE_NAME,
  CoreosAgentServiceClient,
} from 'src/shared/schemas/os1/core/service/coreosagent.pb';
import {
  FILE_SERVICE_NAME,
  FileServiceClient,
} from 'src/shared/schemas/os1/core/service/file.pb';

import { mock } from 'jest-mock-extended';
import { APPLICATION_SERVICE_V2_SERVICE_NAME, ApplicationServiceV2Client } from 'src/shared/schemas/os1/developerportal/service/application-v2.pb';
import {
  SUBSCRIPTION_SERVICE_NAME,
  SubscriptionServiceClient,
} from 'src/shared/schemas/os1/marketplace/service/subscription.pb';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionService', () => {
  // setting timeout to be 100 seconds to allow aaa testing aaa permissions timed upload retries
  jest.setTimeout(100000);

  let service: SubscriptionService;
  let applicationServiceClient: ApplicationServiceV2Client;  
  let subscriptionServiceClient: SubscriptionServiceClient;
  let fileServiceClient: FileServiceClient;
  let coreosAgentServiceClient: CoreosAgentServiceClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        TestHelpers.ClientGrpcMock(APPLICATION_SERVICE_V2_SERVICE_NAME),
        TestHelpers.ClientGrpcMock(SUBSCRIPTION_SERVICE_NAME),
        TestHelpers.ClientGrpcMock(FILE_SERVICE_NAME),
        TestHelpers.ClientGrpcMock(COREOS_AGENT_SERVICE_NAME),
      ],
    }).compile();

    service = module.get(SubscriptionService);

    applicationServiceClient = mock<ApplicationServiceV2Client>();    
    subscriptionServiceClient = mock<SubscriptionServiceClient>();
    fileServiceClient = mock<FileServiceClient>();
    coreosAgentServiceClient = mock<CoreosAgentServiceClient>();

    Reflect.set(service, 'applicationServiceClient', applicationServiceClient);
    Reflect.set(
      service,
      'subscriptionServiceClient',
      subscriptionServiceClient,
    );
    Reflect.set(service, 'fileServiceClient', fileServiceClient);
    Reflect.set(service, 'coreosAgentServiceClient', coreosAgentServiceClient);
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isAppToBeAddedToSolution predicate', () => {
    const app =
      TestHelpers.CreateGetApplicationByApplicationIdResponse().application;
    app.versions[0].applicationCompitablity.compitableSolutions = undefined;
    app.versions[0].applicationCompitablity.isConsoleCompatible = undefined;
    app.versions[0].applicationCompitablity.isMarketplaceCompatible = undefined;

    const subscriptionDTO: SubscriptionDTO =
      TestHelpers.CreateSubscriptionDTO();
    const corsAppsAssignedToUser: Array<string> = [];
    it('should return false when app is not console compatible', async () => {
      app.versions[0].applicationCompitablity.isConsoleCompatible = false;
      const servicePrototype = Object.getPrototypeOf(service);
      const result = servicePrototype.isAppToBeAddedToSolution(
        subscriptionDTO,
        app,
        corsAppsAssignedToUser,
      );
      expect(result).toEqual(false);
    });

    it('should return true when subscription is of type developer', async () => {
      app.versions[0].applicationCompitablity.isConsoleCompatible = true;
      subscriptionDTO.tier.planType = 'DEVELOPER';

      const servicePrototype = Object.getPrototypeOf(service);
      const result = servicePrototype.isAppToBeAddedToSolution(
        subscriptionDTO,
        app,
        corsAppsAssignedToUser,
      );
      expect(result).toEqual(true);
    });

    it('should return true when subscription is of type sandbox', async () => {
      app.versions[0].applicationCompitablity.isConsoleCompatible = true;
      subscriptionDTO.tier.planType = 'SANDBOX';

      const servicePrototype = Object.getPrototypeOf(service);
      const result = servicePrototype.isAppToBeAddedToSolution(
        subscriptionDTO,
        app,
        corsAppsAssignedToUser,
      );
      expect(result).toEqual(true);
    });

    it('should return false when subscription is in trail and app is not assigned to user', async () => {
      app.versions[0].applicationCompitablity.isConsoleCompatible = true;
      subscriptionDTO.tier.planType = 'TRIAL';
      corsAppsAssignedToUser.push('some:random:app');

      const servicePrototype = Object.getPrototypeOf(service);
      const result = servicePrototype.isAppToBeAddedToSolution(
        subscriptionDTO,
        app,
        corsAppsAssignedToUser,
      );
      expect(result).toEqual(false);
    });

    it('should return true when subscription is in trail and app is assigned to user', async () => {
      app.versions[0].applicationCompitablity.isConsoleCompatible = true;
      subscriptionDTO.tier.planType = 'TRIAL';
      corsAppsAssignedToUser.push(app.urn);

      const servicePrototype = Object.getPrototypeOf(service);
      const result = servicePrototype.isAppToBeAddedToSolution(
        subscriptionDTO,
        app,
        corsAppsAssignedToUser,
      );
      expect(result).toEqual(true);
    });
  });

  describe('sortSolutionApplications', () => {
    it('should sort the associated applications in decending order', async () => {
      const solutionResponse =
        TestHelpers.CreateGetSolutionBySolutionIdResponse();
      const associatedApplications =
        solutionResponse.solution.version[0].associatedApplications;

      const servicePrototype = Object.getPrototypeOf(service);
      servicePrototype.sortSolutionApplications(associatedApplications);

      expect(associatedApplications.length).toEqual(4);
      for (let i = 0; i < associatedApplications.length - 1; i++) {
        expect(
          associatedApplications[i].displayOrder >=
            associatedApplications[i + 1].displayOrder,
        ).toEqual(true);
      }
    });

    it('should sort the associated applications in decending order when display order is not defined', async () => {
      const solutionResponse =
        TestHelpers.CreateGetSolutionBySolutionIdResponse();
      const associatedApplications =
        solutionResponse.solution.version[0].associatedApplications;

      associatedApplications[0].displayOrder = undefined;

      const servicePrototype = Object.getPrototypeOf(service);
      servicePrototype.sortSolutionApplications(associatedApplications);

      expect(associatedApplications.length).toEqual(4);
      for (let i = 0; i < associatedApplications.length - 1; i++) {
        expect(
          (associatedApplications[i].displayOrder ?? 0) >=
            (associatedApplications[i + 1].displayOrder ?? 0),
        ).toEqual(true);
      }
    });
  });

  describe('filterUrlOverridesByStackId', () => {
    it('filters when stackId matches', () => {
      const testStackId = 'testId';
      const testUrl = 'testUrl';
      const urlOverrides = [
        {
          stackId: testStackId,
          url: {
            name: 'test',
            url: testUrl,
          },
        },
        {
          stackId: 'does not match',
          url: {
            name: 'test',
            url: 'testUrl2',
          },
        },
      ];

      const servicePrototype = Object.getPrototypeOf(service);
      const result = servicePrototype.filterUrlOverridesByStackId(
        urlOverrides,
        testStackId,
      );

      expect(result.length).toEqual(1);
      expect(result[0].url.url).toEqual(testUrl);
    });
  });
});
