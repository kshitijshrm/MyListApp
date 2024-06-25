import { Request } from 'express';
import { ServiceConstants } from '../constants/service.constants';

export const getTenantIdFromRequest = function (req: Request) {
  if (
    ServiceConstants.get_tenant_subscriptions_route_regex.test(req.originalUrl)
  ) {
    return req.originalUrl.split('/').at(-1);
  }
  if (ServiceConstants.get_tenant_settings_route_regex.test(req.originalUrl)) {
    return req.originalUrl.split('/').at(-2);
  }
  return null;
};
