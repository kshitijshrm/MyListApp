import { ServiceConstants } from 'src/common/constants/service.constants';
import { CommonService } from './common.service';
import {
  BannerAllResponseDTO,
  BannerLatestResponseDTO,
} from 'src/common/dto/common/common.dto';
import { PlatformRequestContext } from '@foxtrotplatform/developer-platform-core-lib';
import {
  Controller,
  Inject,
  Get,
  HttpCode,
  Req,
  Headers,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { GetTenantBannersRequestInterceptor } from 'src/common/interceptor/tenant.banners.request.interceptor';
import { boolean, string } from 'joi';

@ApiTags('Common')
@ApiHeaders([
  {
    name: ServiceConstants.access_token_header,
    description: 'coreos access token',
    required: true,
  },
])
@Controller('common')
@ApiExtraModels(BannerAllResponseDTO, BannerLatestResponseDTO)
export class CommonController {
  @Inject(CommonService)
  private readonly commonService: CommonService;

  @Get('/banners')
  @ApiQuery({
    name: 'solutionId',
    required: false,
    example: 'solution:9d672510-c6a7-4f03-a4b2-01c19dbd63a4',
  })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    example: 'true',
  })
  @UseInterceptors(GetTenantBannersRequestInterceptor)
  @ApiOperation({
    summary: 'Get all active banners applicable on a tenant',
    description: `
**Access:**  Inorder to access this api, one must pass the x-coreos-access header. 
`,
  })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    schema: {
      oneOf: [
        { $ref: getSchemaPath(BannerAllResponseDTO) },
        { $ref: getSchemaPath(BannerLatestResponseDTO) },
      ],
    },
  })
  private async getActiveBanners(
    @Req() request,
    @Headers() headers,
    @Query('solutionId') solutionId?: string,
    @Query('activeOnly') activeOnly?: string,
  ): Promise<BannerAllResponseDTO | BannerLatestResponseDTO> {
    const ctx: PlatformRequestContext =
      PlatformRequestContext.createFromHttpHeaders(headers);
    return await this.commonService.getApplicableBanners(
      ctx,
      request.tenantId,
      {
        solutionId,
        filterActiveOnly: activeOnly === 'true',
      },
    );
  }
}


