import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { COREOS_AGENT_SERVICE_NAME } from 'src/shared/schemas/os1/core/service/coreosagent.pb';
import {
  FILE_SERVICE_NAME,
  OS1_CORE_SERVICE_PACKAGE_NAME,
} from 'src/shared/schemas/os1/core/service/file.pb';
import {
  APPLICATION_SERVICE_NAME,
  OS1_DEVELOPERPORTAL_SERVICE_PACKAGE_NAME,
} from 'src/shared/schemas/os1/developerportal/service/application.pb';
import { SOLUTION_SERVICE_NAME } from 'src/shared/schemas/os1/developerportal/service/solution.pb';
import {
  OS1_MARKETPLACE_SERVICE_PACKAGE_NAME,
  SUBSCRIPTION_SERVICE_NAME,
} from 'src/shared/schemas/os1/marketplace/service/subscription.pb';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: APPLICATION_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.APPLICATION_SERVICE_ENDPOINT || 'localhost:50052',
          package: OS1_DEVELOPERPORTAL_SERVICE_PACKAGE_NAME,
          protoPath: 'os1/developerportal/service/application.proto',
          loader: {
            includeDirs: [
              join(
                './node_modules/@foxtrotplatform/developer-platform-proto-schemas',
              ),
            ],
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: SOLUTION_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.SOLUTION_SERVICE_ENDPOINT || 'localhost:50056',
          package: OS1_DEVELOPERPORTAL_SERVICE_PACKAGE_NAME,
          protoPath: 'os1/developerportal/service/solution.proto',
          loader: {
            includeDirs: [
              join(
                './node_modules/@foxtrotplatform/developer-platform-proto-schemas',
              ),
            ],
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: SUBSCRIPTION_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.SUBSCRIPTION_SERVICE_ENDPOINT || 'localhost:50055',
          package: OS1_MARKETPLACE_SERVICE_PACKAGE_NAME,
          protoPath: 'os1/marketplace/service/subscription.proto',
          loader: {
            includeDirs: [
              join(
                './node_modules/@foxtrotplatform/developer-platform-proto-schemas',
              ),
            ],
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: COREOS_AGENT_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.COREOS_AGENT_SERVICE_ENDPOINT || 'localhost:50053',
          package: OS1_CORE_SERVICE_PACKAGE_NAME,
          protoPath: 'os1/core/service/coreosagent.proto',
          loader: {
            includeDirs: [
              join(
                './node_modules/@foxtrotplatform/developer-platform-proto-schemas',
              ),
            ],
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: FILE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.FILE_SERVICE_ENDPOINT || 'localhost:50054',
          package: OS1_CORE_SERVICE_PACKAGE_NAME,
          protoPath: 'os1/core/service/file.proto',
          loader: {
            includeDirs: [
              join(
                './node_modules/@foxtrotplatform/developer-platform-proto-schemas',
              ),
            ],
          },
        },
      },
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
