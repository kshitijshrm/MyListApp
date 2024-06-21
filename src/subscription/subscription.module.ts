import { Module } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ServiceConstants } from 'src/common/constants/service.constants';
import { FILE_SERVICE_NAME } from 'src/shared/schemas/os1/core/service/file.pb';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { RedisService } from '@foxtrotplatform/developer-platform-core-lib';
import { redisStore } from 'cache-manager-ioredis-yet';
import { redisClusterOptions } from 'src/common/config/redis';
import { RedisConstants } from 'src/common/constants/redis.constants';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalCustomCacheInterceptor } from 'src/common/interceptor/global.cache.interceptor';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServiceConstants.application_service_v2.name,
        transport: Transport.GRPC,
        options: {
          url: ServiceConstants.application_service_v2.url,
          package: ServiceConstants.application_service_v2.package,
          protoPath: ServiceConstants.application_service_v2.protoPath,
          loader: {
            includeDirs: [join(ServiceConstants.proto_schemas_root)],
          },
          credentials:
            process.env.f_stage === 'local'
              ? grpc.ChannelCredentials.createSsl()
              : undefined,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: ServiceConstants.subscription_service.name,
        transport: Transport.GRPC,
        options: {
          url: ServiceConstants.subscription_service.url,
          package: ServiceConstants.subscription_service.package,
          protoPath: ServiceConstants.subscription_service.protoPath,
          loader: {
            includeDirs: [join(ServiceConstants.proto_schemas_root)],
          },
          credentials:
            process.env.f_stage === 'local'
              ? grpc.ChannelCredentials.createSsl()
              : undefined,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: ServiceConstants.coreosagent_service.name,
        transport: Transport.GRPC,
        options: {
          url: ServiceConstants.coreosagent_service.url,
          package: ServiceConstants.coreosagent_service.package,
          protoPath: ServiceConstants.coreosagent_service.protoPath,
          loader: {
            includeDirs: [join(ServiceConstants.proto_schemas_root)],
          },
          credentials:
            process.env.f_stage === 'local'
              ? grpc.ChannelCredentials.createSsl()
              : undefined,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: FILE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: ServiceConstants.file_service.url,
          package: ServiceConstants.file_service.package,
          protoPath: ServiceConstants.file_service.protoPath,
          loader: {
            includeDirs: [join(ServiceConstants.proto_schemas_root)],
          },
        },
      },
    ]),
    CacheModule.register({
      store: redisStore,
      ...redisClusterOptions,
      ttl: RedisConstants.one_day_in_milli_seconds,
    }),
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    RedisService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalCustomCacheInterceptor,
    },
  ],
})
export class SubscriptionModule {}
