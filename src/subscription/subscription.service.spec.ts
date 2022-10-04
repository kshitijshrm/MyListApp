import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionDTO } from 'src/common/dto/subscription/subscription.dto';
import { TestHelpers } from 'src/common/test/test.helpers';
import {
  CoreosAgentServiceClient,
  COREOS_AGENT_SERVICE_NAME,
} from 'src/shared/schemas/os1/core/service/coreosagent.pb';
import {
  FileServiceClient,
  FILE_SERVICE_NAME,
} from 'src/shared/schemas/os1/core/service/file.pb';
import {
  ApplicationServiceClient,
  APPLICATION_SERVICE_NAME,
} from 'src/shared/schemas/os1/developerportal/service/application.pb';
import {
  SolutionServiceClient,
  SOLUTION_SERVICE_NAME,
} from 'src/shared/schemas/os1/developerportal/service/solution.pb';
import {
  SubscriptionServiceClient,
  SUBSCRIPTION_SERVICE_NAME,
} from 'src/shared/schemas/os1/marketplace/service/subscription.pb';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionService', () => {
  // setting timeout to be 100 seconds to allow aaa testing aaa permissions timed upload retries
  jest.setTimeout(100000);

  let service: SubscriptionService;
  let applicationServiceClient: ApplicationServiceClient;
  let solutionServiceClient: SolutionServiceClient;
  let subscriptionServiceClient: SubscriptionServiceClient;
  let fileServiceClient: FileServiceClient;
  let coreosAgentServiceClient: CoreosAgentServiceClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        TestHelpers.ClientGrpcMock(APPLICATION_SERVICE_NAME),
        TestHelpers.ClientGrpcMock(SOLUTION_SERVICE_NAME),
        TestHelpers.ClientGrpcMock(SUBSCRIPTION_SERVICE_NAME),
        TestHelpers.ClientGrpcMock(FILE_SERVICE_NAME),
        TestHelpers.ClientGrpcMock(COREOS_AGENT_SERVICE_NAME),
      ],
    }).compile();

    service = module.get(SubscriptionService);

    applicationServiceClient = TestHelpers.ApplicationServiceClientMock();
    solutionServiceClient = TestHelpers.SolutionServiceClientMock();
    subscriptionServiceClient = TestHelpers.SubscriptionServiceClientMock();
    fileServiceClient = TestHelpers.FileServiceClientMock();
    coreosAgentServiceClient = TestHelpers.CoreosAgentServiceClientMock();

    Reflect.set(service, 'applicationServiceClient', applicationServiceClient);
    Reflect.set(service, 'solutionServiceClient', solutionServiceClient);
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
});
