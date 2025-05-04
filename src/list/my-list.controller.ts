import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { MyListService } from './my-list.service';
import { AddToListDto } from './dto/add-to-list.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedListResponseDto } from './dto/list-response.dto';
import { MyList } from '../database/schemas/my-list.schema';
import { ServiceConstants } from '../common/constants/service.constants';

@ApiTags('My List')
@Controller('my-list')
@ApiHeader({
  name: ServiceConstants.userId_header,
  description: 'User Id',
  required: true
})
export class MyListController {
  constructor(private readonly myListService: MyListService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add an item to My List' })
  @ApiResponse({ status: 201, description: 'Item added to My List', type: MyList })
  async addToList(
    @Headers(ServiceConstants.userId_header) userId: string,
    @Body() addToListDto: AddToListDto
  ): Promise<MyList> {
    const result = await this.myListService.addToList(userId, addToListDto);
    return result;
  }

  @Delete(':contentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove content from My List' })
  @ApiResponse({ status: 204, description: 'Content removed from My List' })
  @ApiResponse({ status: 404, description: 'Content not found in My List' })
  async removeFromList(
    @Headers(ServiceConstants.userId_header) userId: string,
    @Param('contentId') contentId: string
  ): Promise<void> {
    return this.myListService.removeFromList(userId, contentId);
  }

  @Get()
  @ApiOperation({ summary: 'Get user\'s My List with pagination' })
  @ApiResponse({ status: 200, description: 'Returns paginated My List', type: PaginatedListResponseDto })
  @UseInterceptors(CacheInterceptor)
  async getMyList(
    @Headers(ServiceConstants.userId_header) userId: string,
    @Query() paginationDto: PaginationDto
  ): Promise<PaginatedListResponseDto> {
    return this.myListService.getMyList(userId, paginationDto);
  }

  @Get(':contentId/status')
  @ApiOperation({ summary: 'Check if content is in My List' })
  @ApiResponse({ status: 200, description: 'Returns true if content is in My List, false otherwise' })
  async isInMyList(
    @Headers(ServiceConstants.userId_header) userId: string,
    @Param('contentId') contentId: string
  ): Promise<{ inMyList: boolean }> {
    const inMyList = await this.myListService.isInMyList(userId, contentId);
    return { inMyList };
  }
}
