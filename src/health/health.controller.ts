import { Controller, Get, Inject } from '@nestjs/common';
import { GrpcOptions, RedisOptions, Transport } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  GRPCHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { join } from 'path';
import { ServiceConstants } from 'src/common/constants/service.constants';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Inject(HealthCheckService)
  private health: HealthCheckService;

  @Inject(GRPCHealthIndicator)
  private grpc: GRPCHealthIndicator;

  @Inject(MicroserviceHealthIndicator)
  private microservice: MicroserviceHealthIndicator;

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
        this.microservice.pingCheck<RedisOptions>('redis', {
          transport: Transport.REDIS,
          options: {
            host: process.env.f_redis_host,
            port: parseInt(process.env.REDIS_CLUSTER_HOST),
          },
        }),
    ]);
  }
}
