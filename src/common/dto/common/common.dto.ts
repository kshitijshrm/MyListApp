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
