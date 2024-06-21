import {
  COREOS_AGENT_SERVICE_NAME,
  OS1_CORE_SERVICE_PACKAGE_NAME,
} from 'src/shared/schemas/os1/core/service/coreosagent.pb';
import { FILE_SERVICE_NAME } from 'src/shared/schemas/os1/core/service/file.pb';
import { APPLICATION_SERVICE_V2_SERVICE_NAME, OS1_DEVELOPERPORTAL_SERVICE_PACKAGE_NAME } from 'src/shared/schemas/os1/developerportal/service/application-v2.pb';

import {
  OS1_MARKETPLACE_SERVICE_PACKAGE_NAME,
  SUBSCRIPTION_SERVICE_NAME,
} from 'src/shared/schemas/os1/marketplace/service/subscription.pb';

export const ServiceConstants = {
  global_filter_skip_routes: [
    '/app/console-api/ping',
    '/app/console-api/health',
    '/app/console-api/subscription/[^/]+$',
  ],
  access_token_header: 'x-coreos-access',
  cache_control_header: 'cache-control',
  health_check_timeout_default: 2000,
  proto_schemas_root:
    './node_modules/@foxtrotplatform/developer-platform-proto-schemas',
  application_service_v2: {
    name: APPLICATION_SERVICE_V2_SERVICE_NAME,
    package: OS1_DEVELOPERPORTAL_SERVICE_PACKAGE_NAME,
    url: process.env.APPLICATION_SERVICE_ENDPOINT || 'localhost:50052',
    protoPath: 'os1/developerportal/service/application-v2.proto',
  },
  subscription_service: {
    name: SUBSCRIPTION_SERVICE_NAME,
    package: OS1_MARKETPLACE_SERVICE_PACKAGE_NAME,
    url: process.env.SUBSCRIPTION_SERVICE_ENDPOINT || 'localhost:50055',
    protoPath: 'os1/marketplace/service/subscription.proto',
  },
  file_service: {
    name: FILE_SERVICE_NAME,
    package: OS1_CORE_SERVICE_PACKAGE_NAME,
    url: process.env.FILE_SERVICE_ENDPOINT || 'localhost:50054',
    protoPath: 'os1/core/service/file.proto',
  },
  coreosagent_service: {
    name: COREOS_AGENT_SERVICE_NAME,
    package: OS1_CORE_SERVICE_PACKAGE_NAME,
    url: process.env.COREOS_AGENT_SERVICE_ENDPOINT || 'localhost:50053',
    protoPath: 'os1/core/service/coreosagent.proto',
  },
};
