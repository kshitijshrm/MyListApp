export const ServiceConstants = {
  response_interceptor_skip_routes: [
    '/app/list-api/ping',
    '/app/list-api/health',
  ],
  cache_interceptor_skip_routes: [
    '/app/list-api/ping',
    '/app/list-api/health',
  ],
  userId_header: 'x-list-api-userid',
  cache_control_header: 'cache-control',
  health_check_timeout_default: 2000,
};
