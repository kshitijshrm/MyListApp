import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ServiceConstants } from 'src/common/constants/service.constants';
import { FILE_SERVICE_NAME } from 'src/shared/schemas/os1/core/service/file.pb';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServiceConstants.application_service.name,
        transport: Transport.GRPC,
        options: {
          url: ServiceConstants.application_service.url,
          package: ServiceConstants.application_service.package,
          protoPath: ServiceConstants.application_service.protoPath,
          loader: {
            includeDirs: [join(ServiceConstants.proto_schemas_root)],
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: ServiceConstants.solution_service.name,
        transport: Transport.GRPC,
        options: {
          url: ServiceConstants.solution_service.url,
          package: ServiceConstants.solution_service.package,
          protoPath: ServiceConstants.solution_service.protoPath,
          loader: {
            includeDirs: [join(ServiceConstants.proto_schemas_root)],
          },
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
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
