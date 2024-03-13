import { ApiProperty } from '@nestjs/swagger';

export class RecordStatus {
  @ApiProperty({
    description: 'Is the record active or not',
  })
  isActive?: boolean;
  @ApiProperty({
    description: 'Is the record deleted or not',
  })
  isDeleted?: boolean;
}

export class FileMetadataDTO {
  @ApiProperty({
    description: 'File identifier',
    example: '5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
  })
  fileId: string;
  @ApiProperty({
    description: 'File name',
    example: 'solution-image.png',
  })
  fileName: string;
  @ApiProperty({
    description: 'File description',
    example: 'Solution Image',
  })
  fileDescription: string;
  @ApiProperty({
    description: 'File URL',
    example:
      'https://cdn.os1.delhivery.com/5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
  })
  fileUrl?: string | undefined;
}

export class SettingsMetaDTO {
  @ApiProperty({
    description: 'Display Name',
    example: 'My app',
  })
  displayName: string;
  @ApiProperty({
    description: 'Settings URL',
    example:
      '/my-app/settings',
  })
  settingsUrl?: string | undefined;
  @ApiProperty({
    description: 'Icon Url',
    example: 'https://cdn.getos1.com/7adcf59e-c5df-418f-8645-e82f2a5231b6-default_icon.png',
  })
  icon?: string | undefined
  @ApiProperty({
    description: 'The actual item description',
    example: 'this is the description of app settings',
  })
  description?: string | undefined
}
export class DocumentMetadataDTO {
  @ApiProperty({
    description: 'Document category',
    example: 'DRAFT',
  })
  category: string;
  @ApiProperty({
    description: 'File metadata',
    type: FileMetadataDTO,
  })
  document: FileMetadataDTO;
}

export class ConfigurationMetadataDTO {
  @ApiProperty()
  category: string;
  @ApiProperty()
  configurationFile: FileMetadataDTO;
}
