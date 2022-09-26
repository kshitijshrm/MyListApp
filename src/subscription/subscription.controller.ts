import { PlatformRequestContext } from '@foxtrotplatform/developer-platform-core-lib';
import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Inject,
  Logger,
  NotImplementedException,
  Param,
} from '@nestjs/common';
import { ApiHeaders, ApiTags } from '@nestjs/swagger';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { SubscriptionDTO } from 'src/common/dto/subscription/subscription.dto';
import { SubscriptionService } from './subscription.service';

const X_COREOS_ACCESS = 'x-coreos-access';

@ApiTags('Subscription')
@ApiHeaders([
  {
    name: X_COREOS_ACCESS,
    description: 'coreos access token',
    required: true,
  },
])
@Controller('subscription')
export class SubscriptionController {
  private logger = new Logger(this.constructor.name);

  @Inject(SubscriptionService)
  private readonly subscriptionService: SubscriptionService;

  @Get('/:tenantId')
  private getAllSubscriptions(
    @Param('tenantId') tenantId: string,
    @Headers() headers,
  ): Promise<Array<SubscriptionDTO>> {
    const userId = this.getUserIdFromCoreosToken(headers);
    const ctx: PlatformRequestContext =
      PlatformRequestContext.createFromHttpHeaders(headers);
    return this.subscriptionService.getAllSubscriptions(ctx, userId, tenantId);
  }

  @Get('/:tenantId/solution')
  private getSolutionSubscriptions(
    @Param('tenantId') tenantId: string,
    @Headers() headers,
  ): Observable<any> {
    this.getUserIdFromCoreosToken(headers);
    const ctx: PlatformRequestContext =
      PlatformRequestContext.createFromHttpHeaders(headers);
    throw new NotImplementedException(`getSolutionSubscriptions`);
  }

  @Get(':tenantId/app')
  private getAppSubscriptions(
    @Param('tenantId') tenantId: string,
    @Headers() headers,
  ): Observable<any> {
    this.getUserIdFromCoreosToken(headers);
    const ctx: PlatformRequestContext =
      PlatformRequestContext.createFromHttpHeaders(headers);
    throw new NotImplementedException(`getAppSubscriptions`);
  }

  private getUserIdFromCoreosToken(headers: any): string {
    if (!headers[X_COREOS_ACCESS]) {
      throw new BadRequestException('x-coreos-access header is missing');
    }
    const decodedToken: Record<string, any> = jwtDecode(
      headers[X_COREOS_ACCESS],
    );
    return decodedToken.userId;
  }
}
