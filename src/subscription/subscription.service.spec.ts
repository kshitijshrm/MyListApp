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
        true,
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
      },
    ];
    const sampleSubscriptionResponse: SubscriptionsResponseDTO = {
      subscriptions: [
        {
          subscriptionId: 'subscription:3e134368-ca90-4941-b210-ba2d803439ca',
          applications: [],
          solutions: [
            {
              solutionId: 'solution:dce2047a-32c2-5475-98de-e2b2857bcd4c',
              solutionVersionId:
                'solutionversion:bf442532-fa83-5ded-b6b8-4c5b6979b741',
              displayName: 'SampleSolution',
              shortDescription: 'short',
              longDescription: 'long',
              icon: {
                fileId: 'file:123',
                fileDescription: 'xyz',
                fileName: 'file',
              },
              version: '1.0.0',
              images: [
                {
                  fileId: 'f8777b66-3b33-4c87-8c31-8900e7345e50',
                  fileName: 'DispatchOne_logo_1000x500 (1).png',
                  fileDescription: '',
                  fileUrl:
                    'https://d1ravn1ruyfjdn.cloudfront.net/f8777b66-3b33-4c87-8c31-8900e7345e50-DispatchOne_logo_1000x500-(1).png',
                },
              ],
              applications: [
                {
                  appId: 'app:5187e0bf-8f3c-536e-82ed-61296a01b691',
                  appVersionId:
                    'appversion:904498c9-71ec-5b59-ba14-28ea13746963',
                  listingName: 'Route Optimizer',
                  description: 'random',
                  applicationMenu: [],
                  version: '2.0.4',
                  urlPath: '/optimizer',
                  appType: AppType.mobile,
                  isPrivate: true,
                  consoleCompatible: false,
                  appUrls: [
                    {
                      name: 'relativePath',
                      url: '/myTestRelPath',
                    },
                    {
                      name: 'docs',
                      url: 'my-docs',
                    },
                  ],
                  urlOverrides: [
                    {
                      name: 'override1',
                      url: 'override54534.com',
                    },
                  ],
                  icon: {
                    fileId: 'c3de156d-1440-4602-b570-a8db1b9f3e19',
                    fileName: 'rute_optimizer.svg',
                    fileDescription: 'image/svg+xml',
                    fileUrl: 'randomUrl',
                  },
                  images: [
                    {
                      fileId: '5610d337-3ec8-44f3-818a-f8e8d275789b',
                      fileName: '01.png',
                      fileDescription: '',
                      fileUrl: 'imageUrl',
                    },
                  ],
                  shortDescription: 'Reduce costs',
                  longDescription: 'Reduce costs and delivery times',
                },
              ],
              isMarketplaceCompatible: true,
              isConsoleCompatible: true,
              solutionAppSetting: [],
              landingPage: '/control-tower',
            },
          ],
          status: {
            status: 'Active',
            activatedAt: '2024-03-26T09:49:58.867Z',
            requestedAt: '2024-03-26T09:49:53.463Z',
          },
          tier: {
            planType: 'UNRECOGNIZED',
            displayName: 'Starter',
            periodInDays: 30,
          },
        },
      ],
      isSettingsAvailable: false,
    };

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

    it('should return subscription response', async () => {
      jest
        .spyOn(subscriptionServiceClient, 'getSubscriptionsByTenantId')
        .mockImplementation(() => of({ subscriptions: sampleSubscriptions }))
        .mockClear();
      jest.spyOn(redisService, 'get').mockImplementation(async () => undefined);
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getAllSubscriptionsWithAddonApps(
        ctx,
        'user-id',
        'tenant-id',
        false,
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
      expect(result.isSettingsAvailable).toBe(false);
      expect(result.subscriptions).toHaveLength(1);
    });
    it('should return subscription response from cache', async () => {
      jest
        .spyOn(subscriptionServiceClient, 'getSubscriptionsByTenantId')
        .mockImplementation(() => of({ subscriptions: sampleSubscriptions }))
        .mockClear();
      jest
        .spyOn(redisService, 'get')
        .mockImplementation(async () =>
          JSON.stringify(sampleSubscriptionResponse),
        );
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getAllSubscriptionsWithAddonApps(
        ctx,
        'user-id',
        'tenant-id',
        false,
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(0);
      expect(result).toBeDefined();
      expect(result.subscriptions).toHaveLength(1);
    });
    it('should return subscription response with isSettingsAvailable flag as true when solution system settings is defined', async () => {
      jest
        .spyOn(subscriptionServiceClient, 'getSubscriptionsByTenantId')
        .mockImplementation(() => of({ subscriptions: sampleSubscriptions }))
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
        false,
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
      expect(result.isSettingsAvailable).toBe(true);
      expect(result.subscriptions).toHaveLength(1);
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
        .mockImplementation(() => of({ subscriptions: sampleSubscriptions }))
        .mockClear();
      jest.spyOn(redisService, 'get').mockImplementation(async () => undefined);
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getAllSubscriptionsWithAddonApps(
        ctx,
        'user-id',
        'tenant-id',
        false,
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
      expect(result.isSettingsAvailable).toBe(true);
      expect(result.subscriptions).toHaveLength(1);
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
        .mockImplementation(() => of({ subscriptions: sampleSubscriptions }))
        .mockClear();
      jest.spyOn(redisService, 'get').mockImplementation(async () => undefined);
      const ctx = TestHelpersBase.CreatePlatformContext();
      const result = await service.getAllSubscriptionsWithAddonApps(
        ctx,
        'user-id',
        'tenant-id',
        false,
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
      expect(result.isSettingsAvailable).toBe(false);
      expect(result.subscriptions).toHaveLength(1);
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
        false,
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
      expect(result.isSettingsAvailable).toBe(false);
      expect(result.subscriptions).toHaveLength(1);
      expect(redisSetSpy).toHaveBeenCalledWith(
        RedisConstants.getConfigKey('tenant-id'),
        JSON.stringify(
          TestHelpers.CreateGetTenantConfigsByTenantIdResponse().configs,
        ),
      );
    });

    it('should evit tenant config cache when getting subscriptions with "no-cache" cache directive', async () => {
      jest
        .spyOn(subscriptionServiceClient, 'getSubscriptionsByTenantId')
        .mockImplementation(() => of({ subscriptions: sampleSubscriptions }))
        .mockClear();
      jest.spyOn(redisService, 'get').mockImplementation(async () => undefined);
      jest.spyOn(redisService, 'set').mockImplementation(async (key) => {
        return new Promise<void>((r) => {
          r();
        });
      });
      const redisDelSpy = jest
        .spyOn(redisService, 'del')
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
        true, // flag for cache invalidation
      );
      expect(
        subscriptionServiceClient.getSubscriptionsByTenantId,
      ).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
      expect(result.isSettingsAvailable).toBe(false);
      expect(result.subscriptions).toHaveLength(1);
      expect(redisDelSpy).toHaveBeenCalledWith(
        RedisConstants.getConfigKey('tenant-id'),
      );
    });
  });
});
