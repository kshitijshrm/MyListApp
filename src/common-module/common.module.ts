import { Module } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ServiceConstants } from 'src/common/constants/service.constants';

@Module({
  imports: [
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
  ],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
