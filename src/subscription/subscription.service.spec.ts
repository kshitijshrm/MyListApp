import {
  SubscriptionDTO,
  SubscriptionsResponseDTO,
} from 'src/common/dto/subscription/subscription.dto';
import { TestHelpers } from 'src/common/test/test.helpers';
import { CoreosAgentServiceClient } from 'src/shared/schemas/os1/core/service/coreosagent.pb';
import { FileServiceClient } from 'src/shared/schemas/os1/core/service/file.pb';
import { mock } from 'jest-mock-extended';
import { ApplicationServiceV2Client } from 'src/shared/schemas/os1/developerportal/service/application-v2.pb';
import { SubscriptionServiceClient } from 'src/shared/schemas/os1/marketplace/service/subscription.pb';
import { SubscriptionService } from './subscription.service';
import {
  RedisService,
  TestHelpersBase,
} from '@foxtrotplatform/developer-platform-core-lib';
import { of } from 'rxjs';
import {
  Subscription,
  SubscriptionTier_PlanType,
} from 'src/shared/schemas/os1/marketplace/subscription/subscription.pb';
import { faker } from '@faker-js/faker';
import { RedisConstants } from 'src/common/constants/redis.constants';
import { AppType } from 'src/common/dto/application/application.dto';

describe('SubscriptionService', () => {
  // setting timeout to be 100 seconds to allow aaa testing aaa permissions timed upload retries
  jest.setTimeout(100000);

  let service: SubscriptionService;
  let applicationServiceClient: ApplicationServiceV2Client;
  let subscriptionServiceClient: SubscriptionServiceClient;
  let fileServiceClient: FileServiceClient;
  let coreosAgentServiceClient: CoreosAgentServiceClient;
  let redisService: RedisService;

  beforeAll(async () => {
    service = new SubscriptionService();

    applicationServiceClient = mock<ApplicationServiceV2Client>();
    subscriptionServiceClient = mock<SubscriptionServiceClient>();
    fileServiceClient = mock<FileServiceClient>();
    coreosAgentServiceClient = mock<CoreosAgentServiceClient>();
    redisService = mock<RedisService>();

    Reflect.set(service, 'applicationServiceClient', applicationServiceClient);
    Reflect.set(
      service,
      'subscriptionServiceClient',
      subscriptionServiceClient,
    );
    Reflect.set(service, 'fileServiceClient', fileServiceClient);
    Reflect.set(service, 'coreosAgentServiceClient', coreosAgentServiceClient);
    Reflect.set(service, 'redisService', redisService);
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

    const tenant = TestHelpers.CreateGetTenantByIdResponse().tenant;

    const subscriptionDTO: SubscriptionDTO =
      TestHelpers.CreateSubscriptionDTO();
    const corsAppsAssignedToUser: Array<string> = [];
    it('should return false when app is not console compatible', async () => {
      app.versions[0].applicationCompitablity.isConsoleCompatible = false;
      const servicePrototype = Object.getPrototypeOf(service);
      const result = servicePrototype.isAppToBeAddedToSolution(
        app,
        tenant,
        corsAppsAssignedToUser,
        true,
      );
      expect(result).toEqual(false);
    });

    it('should return false if the app is not assigned to the user', async () => {
      app.versions[0].applicationCompitablity.isConsoleCompatible = true;

      const servicePrototype = Object.getPrototypeOf(service);
      const result = servicePrototype.isAppToBeAddedToSolution(
        app,
        tenant,
        corsAppsAssignedToUser,
        true,
      );
      expect(result).toEqual(true);
    });

    it('should return false when tenant is not a developer tenant and app is not assigned to user', async () => {
      app.versions[0].applicationCompitablity.isConsoleCompatible = true;
      tenant.isDeveloperTenant = false;
      corsAppsAssignedToUser.push('some:random:app');

      const servicePrototype = Object.getPrototypeOf(service);
      const result = servicePrototype.isAppToBeAddedToSolution(
        app,
        tenant,
        corsAppsAssignedToUser,
        true,
      );
      expect(result).toEqual(false);
    });

    it('should return true when app is not console compatible and is called for getting all settings and app is assigned to user and the tenant is of developer type', async () => {
      app.versions[0].applicationCompitablity.isConsoleCompatible = false;
      tenant.isDeveloperTenant = false;
      corsAppsAssignedToUser.push(app.urn);
      const servicePrototype = Object.getPrototypeOf(service);
      const result = servicePrototype.isAppToBeAddedToSolution(
        app,
        tenant,
        corsAppsAssignedToUser,
        false,
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

  describe('getCoreosAppsAssignedToUser', () => {
    coreosAgentServiceClient = mock<CoreosAgentServiceClient>();
    const sampleApps = ['sample-app1', 'sample-app2'];
    const sampleApps2 = ['sample-app3', 'sample-app4'];

    it('should return sampleApps array from coreosAgent', async () => {
      jest
        .spyOn(coreosAgentServiceClient, 'getAppsForCoreosUser')
        .mockImplementation(() =>
          of({ coreosUserId: 'user-id', apps: sampleApps }),
        );
      jest.spyOn(redisService, 'get').mockImplementation(async () => undefined);
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getCoreosAppsAssignedToUser(
        ctx,
        'user-id',
        'tenant-id',
      );
      expect(
        coreosAgentServiceClient.getAppsForCoreosUser,
      ).toHaveBeenCalledTimes(1);
      expect(result).toEqual(sampleApps);
    });

    it('should return sampleApps array from redis', async () => {
      jest
        .spyOn(coreosAgentServiceClient, 'getAppsForCoreosUser')
        .mockImplementation(() =>
          of({ coreosUserId: 'user-id', apps: sampleApps2 }),
        );
      jest
        .spyOn(redisService, 'get')
        .mockImplementation(async () => JSON.stringify(sampleApps));
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getCoreosAppsAssignedToUser(
        ctx,
        'user-id',
        'tenant-id',
      );
      expect(
        coreosAgentServiceClient.getAppsForCoreosUser,
      ).toHaveBeenCalledTimes(2);
      expect(result).toEqual(sampleApps);
    });

    it('should return sampleApps2 array from redis', async () => {
      jest
        .spyOn(coreosAgentServiceClient, 'getAppsForCoreosUser')
        .mockImplementation(() =>
          of({ coreosUserId: 'user-id', apps: sampleApps }),
        );
      jest
        .spyOn(redisService, 'get')
        .mockImplementation(async () => JSON.stringify(sampleApps2));
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getCoreosAppsAssignedToUser(
        ctx,
        'user-id',
        'tenant-id',
      );
      expect(
        coreosAgentServiceClient.getAppsForCoreosUser,
      ).toHaveBeenCalledTimes(3);
      expect(result).toEqual(sampleApps2);
    });
  });

  describe('getActiveSubscriptions', () => {
    subscriptionServiceClient = mock<SubscriptionServiceClient>();
    const sampleSubscriptions: Subscription[] = [
      {
        id: { subscriptionId: 'sample-subscription-id' },
        organization: undefined,
        tier: undefined,
        item: undefined,
        status: undefined,
        recordStatus: {
          isActive: true,
          isDeleted: false,
        },
        recordAudit: undefined,
        pendingAction: undefined,
        documents: undefined,
        metadata: undefined,
        skuUsage: {},
        publisherPaymentType: '',
      },
    ];
    const sampleSubscriptions2: Subscription[] = [
      {
        id: { subscriptionId: 'sample-subscription-id2' },
        organization: undefined,
        tier: undefined,
        item: undefined,
        status: undefined,
        recordStatus: {
          isActive: true,
          isDeleted: false,
        },
        recordAudit: undefined,
        pendingAction: undefined,
        documents: undefined,
        metadata: undefined,
        skuUsage: {},
        publisherPaymentType: '',
      },
    ];

    it('should return sampleSubscription array from subscription service', async () => {
      jest
        .spyOn(subscriptionServiceClient, 'getSubscriptionsByTenantId')
        .mockImplementation(() => of({ subscriptions: sampleSubscriptions }));
      jest.spyOn(redisService, 'get').mockImplementation(async () => undefined);
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getActiveSubscriptions(
        ctx,
        'user-id',
        'tenant-id',
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(1);
      expect(result).toEqual(sampleSubscriptions);
    });

    it('should return sampleSubscription array from redis', async () => {
      jest
        .spyOn(subscriptionServiceClient, 'getSubscriptionsByTenantId')
        .mockImplementation(() => of({ subscriptions: sampleSubscriptions2 }));
      jest
        .spyOn(redisService, 'get')
        .mockImplementation(async () => JSON.stringify(sampleSubscriptions));
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getActiveSubscriptions(
        ctx,
        'user-id',
        'tenant-id',
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(2);
      expect(result).toEqual(sampleSubscriptions);
    });

    it('should return sampleSubscriptions array from redis', async () => {
      jest
        .spyOn(subscriptionServiceClient, 'getSubscriptionsByTenantId')
        .mockImplementation(() => of({ subscriptions: sampleSubscriptions }));
      jest
        .spyOn(redisService, 'get')
        .mockImplementation(async () => JSON.stringify(sampleSubscriptions2));
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getActiveSubscriptions(
        ctx,
        'user-id',
        'tenant-id',
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(3);
      expect(result).toEqual(sampleSubscriptions2);
    });
  });

  describe('getTenantSubscriptionsWithAddOns', () => {
    subscriptionServiceClient = mock<SubscriptionServiceClient>();
    const [randomSolnId, randomSolnVersionId] = [
      TestHelpers.CreateRandomSolutionId(),
      TestHelpers.CreateRandomSolutionVersionId(),
    ];
    const sampleSubscriptionsWithAddOns: Subscription[] = [
      {
        id: { subscriptionId: 'solution-subscription-id' },
        organization: undefined,
        status: {
          activatedAt: '2024-02-07T00:49:47.917Z',
          expiresAt: '2025-02-06T00:49:47.818Z',
          log: [],
          requestedAt: '2024-02-07T00:49:46.167Z',
          status: 'Active',
          reason: '',
        },
        tier: {
          displayName: 'Sample',
          periodInDays: 365,
          planType: SubscriptionTier_PlanType.DEVELOPER,
          productTierId: {
            id: `tier:${faker.datatype.uuid()}`,
          },
        },
        item: {
          solution: {
            id: {
              solutionId: randomSolnId,
              solutionVersionId: randomSolnVersionId,
            },
          },
        },
        recordStatus: {
          isActive: true,
          isDeleted: false,
        },
        recordAudit: undefined,
        pendingAction: undefined,
        documents: undefined,
        metadata: undefined,
        skuUsage: {},
        publisherPaymentType: '',
      },
      {
        id: {
          subscriptionId: 'addon-app-subscription-id',
        },
        organization: undefined,
        item: {
          application: {
            id: {
              appId: 'app:b2e6d204-e199-5bcc-bec8-5129f20819f0',
              appVersionId: 'appversion:aa06c195-486b-5f02-838b-74082b2929e4',
            },
          },
        },
        tier: {
          displayName: 'Sample',
          periodInDays: 365,
          planType: SubscriptionTier_PlanType.DEVELOPER,
          productTierId: {
            id: `tier:${faker.datatype.uuid()}`,
          },
        },
        status: {
          status: 'Active',
          requestedAt: '2024-02-07T00:49:46.167Z',
          activatedAt: '2024-02-07T00:49:47.917Z',
          log: [],
          reason: '',
          expiresAt: '2025-02-06T00:49:47.818Z',
        },
        recordStatus: {
          isActive: true,
          isDeleted: false,
        },
        skuUsage: {
          orders: {
            usage: [
              {
                from: 1707266987917,
                to: 1709251199999,
                usage: 0,
              },
            ],
          },
        },
        recordAudit: undefined,
        pendingAction: undefined,
        documents: undefined,
        metadata: undefined,
        publisherPaymentType: '',
      },
    ];

    beforeEach(() => {
      applicationServiceClient.getSolutionByVersionId = jest
        .fn()
        .mockImplementation(() =>
          of(
            TestHelpers.CreateGetSolutionByVersionIdResponse(
              randomSolnId,
              randomSolnVersionId,
            ),
          ),
        );
      applicationServiceClient.getApplicationByVersionId = jest
        .fn()
        .mockImplementation(() =>
          of(
            TestHelpers.CreateGetApplicationByVersionIdResponse(
              undefined,
              true,
            ),
          ),
        );
      coreosAgentServiceClient.getAppsForCoreosUser = jest
        .fn()
        .mockImplementation((tenantId, coreosUserId) =>
          of({ coreosUserId, apps: [] }),
        );
      coreosAgentServiceClient.getCoreosUserById = jest
        .fn()
        .mockImplementation((coreosUserId) =>
          of({
            coreosUserId,
            groups: [],
          }),
        );
      coreosAgentServiceClient.getTenantById = jest
        .fn()
        .mockImplementation(() =>
          of(TestHelpers.CreateGetTenantByIdResponse(true)),
        );
      coreosAgentServiceClient.getTenantConfigsByTenantId = jest
        .fn()
        .mockImplementation(() =>
          of(TestHelpers.CreateGetTenantConfigsByTenantIdResponse()),
        );
    });

    it('should return subscription response', async () => {
      applicationServiceClient.getApplicationByVersionId = jest
        .fn()
        .mockImplementation(() =>
          of(
            TestHelpers.CreateGetApplicationByVersionIdResponse(
              {
                solnId: randomSolnId,
                solnVersionId: randomSolnVersionId,
              },
              true,
            ),
          ),
        );
      coreosAgentServiceClient.getUserRolesResults = jest
        .fn()
        .mockImplementation(() => of(TestHelpers.CreateGetUserRolesResult()));
      jest
        .spyOn(subscriptionServiceClient, 'getSubscriptionsByTenantId')
        .mockImplementation(() =>
          of({ subscriptions: sampleSubscriptionsWithAddOns }),
        )
        .mockClear();
      jest.spyOn(redisService, 'get').mockImplementation(async () => undefined);
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getAllSubscriptionsWithAddonApps(
        ctx,
        'user-id',
        'tenant-id',
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result.subscriptionsResponse.isSettingsAvailable).toBe(false);
      expect(result.subscriptionsResponse.subscriptions).toHaveLength(1);
      expect(
        result.subscriptionsResponse.subscriptions[0].solutions[0].applications,
      ).toHaveLength(5);
    });
    it('should return subscription response with isSettingsAvailable flag as true when solution system settings is defined', async () => {
      jest
        .spyOn(subscriptionServiceClient, 'getSubscriptionsByTenantId')
        .mockImplementation(() =>
          of({ subscriptions: sampleSubscriptionsWithAddOns }),
        )
        .mockClear();
      applicationServiceClient.getSolutionByVersionId = jest
        .fn()
        .mockImplementation(() => {
          const mockedSolution =
            TestHelpers.CreateGetSolutionByVersionIdResponse();
          mockedSolution.solution.version[0].systemAppSettings = [
            {
              displayName: 'system',
              settingsUrl: '/system',
              appName: 'systemApp',
              appUrn: 'platform:app:systemapp',
            },
          ];
          return of(mockedSolution);
        });
      jest.spyOn(redisService, 'get').mockImplementation(async () => undefined);
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getAllSubscriptionsWithAddonApps(
        ctx,
        'user-id',
        'tenant-id',
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result.subscriptionsResponse.isSettingsAvailable).toBe(true);
      expect(result.subscriptionsResponse.subscriptions).toHaveLength(1);
    });
    it('should return subscription response with isSettingsAvailable flag as true when system settings is defined for a solution app', async () => {
      applicationServiceClient.getApplicationByVersionId = jest
        .fn()
        .mockImplementation(() => {
          const mockedApp =
            TestHelpers.CreateGetApplicationByVersionIdResponse();
          mockedApp.application.versions[0].applicationCompitablity.isConsoleCompatible =
            true;
          mockedApp.application.versions[0].appUrls = [
            { name: 'setting', url: '/app/settings' },
          ];
          return of(mockedApp);
        });
      jest
        .spyOn(subscriptionServiceClient, 'getSubscriptionsByTenantId')
        .mockImplementation(() =>
          of({ subscriptions: sampleSubscriptionsWithAddOns }),
        )
        .mockClear();
      jest.spyOn(redisService, 'get').mockImplementation(async () => undefined);
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getAllSubscriptionsWithAddonApps(
        ctx,
        'user-id',
        'tenant-id',
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result.subscriptionsResponse.isSettingsAvailable).toBe(true);
      expect(result.subscriptionsResponse.subscriptions).toHaveLength(1);
    });
    it('should return subscription response with isSettingsAvailable flag as false when setting url do not exist for a solution app', async () => {
      applicationServiceClient.getApplicationByVersionId = jest
        .fn()
        .mockImplementation(() => {
          const mockedApp =
            TestHelpers.CreateGetApplicationByVersionIdResponse();
          mockedApp.application.versions[0].applicationCompitablity.isConsoleCompatible =
            true;
          mockedApp.application.versions[0].appUrls = [];
          return of(mockedApp);
        });
      jest
        .spyOn(subscriptionServiceClient, 'getSubscriptionsByTenantId')
        .mockImplementation(() =>
          of({ subscriptions: sampleSubscriptionsWithAddOns }),
        )
        .mockClear();
      jest.spyOn(redisService, 'get').mockImplementation(async () => undefined);
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getAllSubscriptionsWithAddonApps(
        ctx,
        'user-id',
        'tenant-id',
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result.subscriptionsResponse.isSettingsAvailable).toBe(false);
      expect(result.subscriptionsResponse.subscriptions).toHaveLength(1);
    });
  });

  describe('tenantConfigDataCaching', () => {
    subscriptionServiceClient = mock<SubscriptionServiceClient>();
    const sampleSubscriptions: Subscription[] = [
      {
        id: { subscriptionId: 'sample-subscription-id' },
        organization: undefined,
        status: {
          activatedAt: '2024-02-07T00:49:47.917Z',
          expiresAt: '2025-02-06T00:49:47.818Z',
          log: [],
          requestedAt: '2024-02-07T00:49:46.167Z',
          status: 'Active',
          reason: '',
        },
        tier: {
          displayName: 'Sample',
          periodInDays: 365,
          planType: SubscriptionTier_PlanType.DEVELOPER,
          productTierId: {
            id: `tier:${faker.datatype.uuid()}`,
          },
        },
        item: {
          solution: {
            id: {
              solutionId: TestHelpers.CreateRandomSolutionId(),
              solutionVersionId: TestHelpers.CreateRandomSolutionVersionId(),
            },
          },
        },
        recordStatus: {
          isActive: true,
          isDeleted: false,
        },
        recordAudit: undefined,
        pendingAction: undefined,
        documents: undefined,
        metadata: undefined,
        skuUsage: {},
        publisherPaymentType: '',
      },
    ];

    beforeEach(() => {
      applicationServiceClient.getSolutionByVersionId = jest
        .fn()
        .mockImplementation(() =>
          of(TestHelpers.CreateGetSolutionByVersionIdResponse()),
        );
      applicationServiceClient.getApplicationByVersionId = jest
        .fn()
        .mockImplementation(() =>
          of(TestHelpers.CreateGetApplicationByVersionIdResponse()),
        );
      coreosAgentServiceClient.getAppsForCoreosUser = jest
        .fn()
        .mockImplementation((tenantId, coreosUserId) =>
          of({ coreosUserId, apps: [] }),
        );
      coreosAgentServiceClient.getCoreosUserById = jest
        .fn()
        .mockImplementation((coreosUserId) =>
          of({
            coreosUserId,
            groups: [],
          }),
        );
      coreosAgentServiceClient.getTenantById = jest
        .fn()
        .mockImplementation(() =>
          of(TestHelpers.CreateGetTenantByIdResponse(true)),
        );
      coreosAgentServiceClient.getTenantConfigsByTenantId = jest
        .fn()
        .mockImplementation(() =>
          of(TestHelpers.CreateGetTenantConfigsByTenantIdResponse()),
        );
    });

    it('should cache tenant config when getting subscriptions', async () => {
      jest
        .spyOn(subscriptionServiceClient, 'getSubscriptionsByTenantId')
        .mockImplementation(() => of({ subscriptions: sampleSubscriptions }))
        .mockClear();
      jest.spyOn(redisService, 'get').mockImplementation(async () => undefined);
      const redisSetSpy = jest
        .spyOn(redisService, 'set')
        .mockImplementation(async (key) => {
          return new Promise<void>((r) => {
            r();
          });
        });
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getAllSubscriptionsWithAddonApps(
        ctx,
        'user-id',
        'tenant-id',
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result.subscriptionsResponse.isSettingsAvailable).toBe(false);
      expect(result.subscriptionsResponse.subscriptions).toHaveLength(1);
      expect(
        result.subscriptionsResponse.subscriptions[0].solutions[0]
          .productGuideUrl,
      ).toBe('https://sample.com');
      expect(redisSetSpy).toHaveBeenCalledWith(
        RedisConstants.getTenantConfigKey('tenant-id'),
        JSON.stringify(
          TestHelpers.CreateGetTenantConfigsByTenantIdResponse().configs,
        ),
      );
    });
  });
});
