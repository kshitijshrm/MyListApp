import { PlatformRequestContext } from '@foxtrotplatform/developer-platform-core-lib';
import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  HttpCode,
  Inject,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import jwtDecode from 'jwt-decode';
import {
  SubscriptionDTO,
  SubscriptionsResponseDTO,
} from 'src/common/dto/subscription/subscription.dto';
import { SubscriptionSettings } from 'src/common/dto/solutionSettings/solutionSettings.dto';
import { SubscriptionService } from './subscription.service';
import { GetAllSubscriptionsResponseInterceptor } from 'src/common/interceptor/custom.response.interceptor';
import { parse } from 'cache-control-parser';

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
  @ApiOperation({
    summary: 'Get all subscriptions associated with a tenant',
    description: `Get all subscriptions associated with a tenant. This list includes both solution and app subscriptions.

When the tenant being queried is a developer tenant, there wont be any access restrictions applied and the user will be able to see all solution and application subscriptions associated with the tenant.

**Access:**  Inorder to access this api, one must porvide the tenant specific user id in x-coreos-access header. In cause of a non-developer tenants, this user id is used to filter the list of subscriptions to only those that the user has access to. 
`,
  })
  @HttpCode(200)
  @ApiResponse({
    type: SubscriptionDTO,
    isArray: true,
    status: 200,
  })
  @UseInterceptors(GetAllSubscriptionsResponseInterceptor)
  private getAllSubscriptions(
    @Param('tenantId') tenantId: string,
    @Headers() headers,
  ): Promise<SubscriptionsResponseDTO> {
    const userId = this.getUserIdFromCoreosToken(headers);
    const ctx: PlatformRequestContext =
      PlatformRequestContext.createFromHttpHeaders(headers);
    const shouldInvalidateCache = this.shouldInvalidateCaches(headers);
    return this.subscriptionService.getAllSubscriptionsWithAddonApps(
      ctx,
      userId,
      tenantId,
      shouldInvalidateCache,
    );
  }

  @Get('/:tenantId/Settings')
  @ApiOperation({
    summary: 'Get all subscriptions settings associated with a tenant',
    description: `Get all subscriptions settings associated with a tenant. This list includes both solution and app subscriptions.

When the tenant being queried is a developer tenant, there wont be any access restrictions applied and the user will be able to see all solution and application subscriptions associated with the tenant.

**Access:**  Inorder to access this api, one must porvide the tenant specific user id in x-coreos-access header. In cause of a non-developer tenants, this user id is used to filter the list of subscriptions to only those that the user has access to. 
`,
  })
  @HttpCode(200)
  @ApiResponse({
    type: SubscriptionSettings,
    isArray: true,
    status: 200,
  })
  private getAllSolutionSettings(
    @Param('tenantId') tenantId: string,
    @Headers() headers,
  ): Promise<SubscriptionSettings> {
    const userId = this.getUserIdFromCoreosToken(headers);
    const ctx: PlatformRequestContext =
      PlatformRequestContext.createFromHttpHeaders(headers);
    return this.subscriptionService.getAllSolutionSetting(
      ctx,
      userId,
      tenantId,
    );
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

  private shouldInvalidateCaches(headers: any): boolean {
    const cacheControlHeader = headers['cache-control'];
    if (cacheControlHeader) {
      const cacheControlDirectives = parse(cacheControlHeader);
      if (cacheControlDirectives['no-cache']) {
        return true;
      }
    }
    return false;
  }
}
