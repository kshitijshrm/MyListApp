export const RedisConstants = {
  getSubscriptionsKey: (tenant: string) => {
    return `subscriptions-for-tenant:${tenant}`;
  },
  one_day_in_seconds: 86400,
  one_day_in_milli_seconds: 86400000,
};
