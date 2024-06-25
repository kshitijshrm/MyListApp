export const getFeatureFlags = function () {
  return {
    abTestTenants:
      process.env['A_B_TEST_TENANTS'] != undefined
        ? (process.env['A_B_TEST_TENANTS'] as string)
            .split(',')
            .map((tenant) => tenant.trim())
        : [],
    autoCachingEnabled:
      process.env['FF_AUTO_CACHING'] != undefined
        ? ['true', '1', 'yes'].includes(
            process.env['FF_AUTO_CACHING'].toLowerCase(),
          )
        : false,
  };
};
