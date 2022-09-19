import { ApiProperty } from '@nestjs/swagger';
import { FileMetadata } from 'src/shared/schemas/os1/core/file/file.pb';
import { ApplicationVersionIdentifier } from 'src/shared/schemas/os1/developerportal/application/identifiers.pb';
import { SolutionVersionIdentifier } from 'src/shared/schemas/os1/developerportal/solution/identifiers.pb';
import { AppClassification, AppType, Url } from './application.dto';

export class RegisterAppRequestDTO {
  @ApiProperty()
  listingName: string;
  @ApiProperty()
  version: string;
  @ApiProperty()
  urlPath: string;
  @ApiProperty()
  appType: AppType;
  @ApiProperty()
  description: string;
  @ApiProperty()
  consoleCompatible: boolean;
  @ApiProperty()
  isPrivate: boolean;
  @ApiProperty()
  url: Url;
  @ApiProperty()
  shortDescription: string;
  @ApiProperty()
  longDescription: string;
}

export class MutableAppAttributesDTO {
  @ApiProperty()
  listingName?: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  isPrivate?: boolean;
  @ApiProperty()
  appClassification?: AppClassification;
  @ApiProperty()
  is_marketplace_compatible?: boolean;
  @ApiProperty()
  is_console_compatible?: boolean;
  @ApiProperty()
  shortDescription?: string;
  @ApiProperty()
  longDescription?: string;
}
