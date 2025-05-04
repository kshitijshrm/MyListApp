import { ApiProperty } from '@nestjs/swagger';
import { MyList } from '../../database/schemas/my-list.schema';

export class PaginatedListResponseDto {
  @ApiProperty({
    description: 'Array of list items',
    type: [MyList]
  })
  items: MyList[];

  @ApiProperty({
    description: 'Total number of items',
    example: 42
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3
  })
  pages: number;
}
