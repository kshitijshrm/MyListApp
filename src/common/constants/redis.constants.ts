export const RedisConstants = {
  developer_platform_backend_access_token_redis_key:
    'developerplatform::client::token::',
  getSubscriptionsKey: (tenant: string) => {
    return `subscriptions-for-tenant:${tenant}`;
  },
  getTenantConfigKey: (tenantId: string) => {
    return `console::configs-for-tenant:${tenantId}`;
  },
  getAppsForCoreosUserKey: (user: string) => {
    return `get-apps-for-coreos-user:${user}`;
  },
  getSolutionByVersionIdKey: (solutionVersionId: string) => {
    return `get-solution-by-version-id:${solutionVersionId}`;
  },
  getApplicationByVersionIdKey: (applicationVersionId: string) => {
    return `get-application-by-version-id:${applicationVersionId}`;
  },
  dpaaa_app_listing_id_key: (appUrn: string) =>
    `dpaaa::listingIdFromUrn::${appUrn}`,
  one_day_in_seconds: 86400,
  one_day_in_milli_seconds: 86400000,
  ten_seconds: 10,
};
