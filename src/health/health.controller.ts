import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import { Controller, Get, Inject } from '@nestjs/common';
import { GrpcOptions } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  GRPCHealthIndicator,
  HealthCheck,
  HealthCheckService,
} from '@nestjs/terminus';
import { Cluster } from 'ioredis';
import { join } from 'path';
import {
  redisClusterHosts,
  redisClusterOptions,
} from 'src/common/config/redis';
import { ServiceConstants } from 'src/common/constants/service.constants';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly redis: Cluster;

  constructor(
    private readonly health: HealthCheckService,
    private readonly redisIndicator: RedisHealthIndicator,
  ) {
    this.redis = new Cluster(redisClusterHosts, redisClusterOptions);
  }

  @Inject(GRPCHealthIndicator)
  private grpc: GRPCHealthIndicator;

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.grpc.checkService<GrpcOptions>(
          ServiceConstants.application_service_v2.name,
          ServiceConstants.application_service_v2.name,
          {
            url: ServiceConstants.application_service_v2.url,
            package: ServiceConstants.application_service_v2.package,
            protoPath: ServiceConstants.application_service_v2.protoPath,
            loader: {
              includeDirs: [join(ServiceConstants.proto_schemas_root)],
            },
            timeout: ServiceConstants.health_check_timeout_default,
            healthServiceName: ServiceConstants.application_service_v2.name,
            healthServiceCheck: (healthService: any, service: string) =>
              healthService.check({ service }).toPromise(),
          },
        ),
      async () =>
        this.grpc.checkService<GrpcOptions>(
          ServiceConstants.subscription_service.name,
          ServiceConstants.subscription_service.name,
          {
            url: ServiceConstants.subscription_service.url,
            package: ServiceConstants.subscription_service.package,
            protoPath: ServiceConstants.subscription_service.protoPath,
            loader: {
              includeDirs: [join(ServiceConstants.proto_schemas_root)],
            },
            timeout: ServiceConstants.health_check_timeout_default,
            healthServiceName: ServiceConstants.subscription_service.name,
            healthServiceCheck: (healthService: any, service: string) =>
              healthService.check({ service }).toPromise(),
          },
        ),
      async () =>
        this.grpc.checkService<GrpcOptions>(
          ServiceConstants.file_service.name,
          ServiceConstants.file_service.name,
          {
            url: ServiceConstants.file_service.url,
            package: ServiceConstants.file_service.package,
            protoPath: ServiceConstants.file_service.protoPath,
            loader: {
              includeDirs: [join(ServiceConstants.proto_schemas_root)],
            },
            timeout: ServiceConstants.health_check_timeout_default,
            healthServiceName: ServiceConstants.file_service.name,
            healthServiceCheck: (healthService: any, service: string) =>
              healthService.check({ service }).toPromise(),
          },
        ),
      async () =>
        this.grpc.checkService<GrpcOptions>(
          ServiceConstants.coreosagent_service.name,
          ServiceConstants.coreosagent_service.name,
          {
            url: ServiceConstants.coreosagent_service.url,
            package: ServiceConstants.coreosagent_service.package,
            protoPath: ServiceConstants.coreosagent_service.protoPath,
            loader: {
              includeDirs: [join(ServiceConstants.proto_schemas_root)],
            },
            timeout: ServiceConstants.health_check_timeout_default,
            healthServiceName: ServiceConstants.coreosagent_service.name,
            healthServiceCheck: (healthService: any, service: string) =>
              healthService.check({ service }).toPromise(),
          },
        ),
      async () =>
        this.redisIndicator.checkHealth('redis', {
          type: 'cluster',
          client: this.redis,
        }),
    ]);
  }
}
