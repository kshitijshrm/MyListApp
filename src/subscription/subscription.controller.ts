import { PlatformRequestContext } from '@foxtrotplatform/developer-platform-core-lib';
import {
  Controller,
  Get,
  Headers,
  HttpCode,
  Inject,
  Logger,
  Param,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  SubscriptionDTO,
  SubscriptionsResponseDTO,
} from 'src/common/dto/subscription/subscription.dto';
import { SubscriptionSettings } from 'src/common/dto/solutionSettings/solutionSettings.dto';
import { SubscriptionService } from './subscription.service';
import { GetAllSubscriptionsResponseInterceptor } from 'src/common/interceptor/custom.response.interceptor';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ServiceConstants } from 'src/common/constants/service.constants';

@ApiTags('Subscription')
@ApiHeaders([
  {
    name: ServiceConstants.access_token_header,
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
    @Req() request,
    @Param('tenantId') tenantId: string,
    @Headers() headers,
  ): Promise<SubscriptionsResponseDTO> {
    const ctx: PlatformRequestContext =
      PlatformRequestContext.createFromHttpHeaders(headers);
    return this.subscriptionService
      .getAllSubscriptionsWithAddonApps(ctx, request.userId, tenantId)
      .then((response) => response.subscriptionsResponse);
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
    @Req() request,
    @Param('tenantId') tenantId: string,
    @Headers() headers,
  ): Promise<SubscriptionSettings> {
    const ctx: PlatformRequestContext =
      PlatformRequestContext.createFromHttpHeaders(headers);
    return this.subscriptionService.getAllSolutionSetting(
      ctx,
      request.userId,
      tenantId,
    );
  }
  @Get('/:tenantId/solutions/:solutionVersionId')
  @ApiOperation({
    summary: 'Get all apps associated with a solution version',
    description: `Get all apps associated with a solution version. This list includes both solution and app subscriptions along with the addOn apps.
`,
  })
  @HttpCode(200)
  @ApiResponse({
    type: SubscriptionSettings,
    isArray: true,
    status: 200,
  })
  private getAllSolutionApps(
    @Req() request,
    @Param('tenantId') tenantId: string,
    @Param('solutionVersionId') solutionVersionId: string,
    @Headers() headers,
  ): Promise<any> {
    const ctx: PlatformRequestContext =
      PlatformRequestContext.createFromHttpHeaders(headers);
    return this.subscriptionService.getAllSolutionApps(
      ctx,
      tenantId,
      solutionVersionId,
    );
  }
}
