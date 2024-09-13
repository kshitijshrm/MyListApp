import {
  COREOS_AGENT_SERVICE_NAME,
  CoreosAgentServiceClient,
} from '@delhivery/developer-platform-proto-schemas/src/index.os1.core.service';
import { PlatformRequestContext } from '@foxtrotplatform/developer-platform-core-lib';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class CommonService {
  logger = new Logger(this.constructor.name);

  @Inject(COREOS_AGENT_SERVICE_NAME)
  private readonly coreosAgentClient: ClientGrpc;
  private coreosAgentServiceClient: CoreosAgentServiceClient;

  onModuleInit() {
    this.coreosAgentServiceClient =
      this.coreosAgentClient.getService<CoreosAgentServiceClient>(
        COREOS_AGENT_SERVICE_NAME,
      );
  }

  async getApplicableBanners(ctx: PlatformRequestContext, tenantId: string) {}
}
