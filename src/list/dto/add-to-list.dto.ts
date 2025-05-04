import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsArray, IsOptional, IsDate } from 'class-validator';
import { ContentType, Genre } from '../interfaces/content.interface';

export class AddToListDto {
  @ApiProperty({
    description: 'Unique identifier of the content',
    example: 'movie123'
  })
  @IsString()
  @IsNotEmpty()
  contentId: string;

  @ApiProperty({
    description: 'Type of content',
    enum: ['movie', 'tvshow'],
    example: 'movie'
  })
  @IsEnum(['movie', 'tvshow'])
  contentType: ContentType;

  @ApiProperty({
    description: 'Title of the content',
    example: 'The Shawshank Redemption'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the content',
    example: 'Two imprisoned men bond over a number of years...',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Genres of the content',
    type: [String],
    enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'],
    example: ['Drama'],
    required: false
  })
  @IsArray()
  @IsEnum(['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'], { each: true })
  @IsOptional()
  genres?: Genre[];
}