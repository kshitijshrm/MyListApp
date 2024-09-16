import { ServiceConstants } from 'src/common/constants/service.constants';
import { CommonService } from './common.service';
import { BannerResponseDTO } from 'src/common/dto/common/common.dto';
import { PlatformRequestContext } from '@foxtrotplatform/developer-platform-core-lib';
import {
  Controller,
  Logger,
  Inject,
  Get,
  HttpCode,
  Req,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Common')
@ApiHeaders([
  {
    name: ServiceConstants.access_token_header,
    description: 'coreos access token',
    required: true,
  },
])
@Controller('common')
export class CommonController {
  private logger = new Logger(this.constructor.name);

  @Inject(CommonService)
  private readonly commonService: CommonService;

  @Get('/banners')
  @ApiOperation({
    summary: 'Get all active banners applicable on a tenant',
    description: `
**Access:**  Inorder to access this api, one must pass the x-coreos-access header. 
`,
  })
  @HttpCode(200)
  @ApiResponse({
    type: BannerResponseDTO,
    status: 200,
  })
  private getActiveBanners(
    @Req() request,
    @Headers() headers,
  ): Promise<BannerResponseDTO> {
    const ctx: PlatformRequestContext =
      PlatformRequestContext.createFromHttpHeaders(headers);
    return null;
  }
}
