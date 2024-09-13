import { ApiProperty } from '@nestjs/swagger';
import { string } from 'joi';

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
    example: '/my-app/settings',
  })
  settingsUrl?: string | undefined;
  @ApiProperty({
    description: 'Icon Url',
    example:
      'https://cdn.getos1.com/7adcf59e-c5df-418f-8645-e82f2a5231b6-default_icon.png',
  })
  icon?: string | undefined;
  @ApiProperty({
    description: 'The actual item description',
    example: 'this is the description of app settings',
  })
  description?: string | undefined;
}
export class DocumentMetadataDTO {
  @ApiProperty({
    description: 'Document category',
    example: 'DRAFT',
  })
  category: string;
  @ApiProperty({
    description: 'File metadata',
  })
  document: FileMetadataDTO;
}

export class ConfigurationMetadataDTO {
  @ApiProperty()
  category: string;
  @ApiProperty()
  configurationFile: FileMetadataDTO;
}

export class BannerMessageDataDTO {
  @ApiProperty({
    description: 'banner activity start time in ISO',
    example: '2024-08-29T23:00:00.000Z',
  })
  activityStartTime?: string;
  @ApiProperty({
    description: 'banner activity end time in ISO',
    example: '2024-08-29T23:30:00.000Z',
  })
  activityEndTIme?: string;
  @ApiProperty({
    description: 'banner activity date in ISO',
    example: '2024-08-29',
  })
  activityDate?: string;
}
export class BannerMessageDTO {
  @ApiProperty({
    description: 'content to be displayed',
    example:
      'We have a planned for maintenance from ${activityStartTime} to ${activityEndTime} on ${activityDate}. During this time this application will be temporarily unavailable.',
  })
  content: string;
  @ApiProperty({
    description: 'JSON data whose properties will be injected into the content',
    type: BannerMessageDataDTO,
  })
  data: BannerMessageDataDTO;
}
export class BannerDTO {
  @ApiProperty({
    description: 'Unique ID of the banner',
    example: 'banner:e27f429d-42ce-499a-aa43-dfcb1a1ddf3b',
  })
  id: string;
  @ApiProperty({
    description: 'short title of the banner',
    example: 'Scheduled Maintainance Alert!',
  })
  title: string;
  @ApiProperty({
    description: "tenant's subscription Id this banner is applicable on",
    example: 'subscription:9d672510-c6a7-4f03-a4b2-01c19dbd63a4',
  })
  subscriptionId: string;
  @ApiProperty({
    description: 'time in ISO from which this banner should be shown to users',
    example: '2024-09-04T17:00:00.000Z',
  })
  activeFromTime: string;
  @ApiProperty({
    description:
      'time in ISO till which this banner should remain shown to users',
    example: '2024-09-04T22:00:00.000Z',
  })
  activeUntilTime: string;
  @ApiProperty({
    description: 'The banner message',
    type: BannerMessageDTO,
  })
  message: BannerMessageDTO;
}

export class BannersResponseDTO {
  @ApiProperty({
    description: 'server time at the time of request',
    example: '2024-09-06T17:00:00.000Z',
  })
  serverTime: string;
  @ApiProperty({
    description: 'tenant timezone',
    example: 'Asia/Kolkata',
  })
  tenantTimeZone: string;
  @ApiProperty({
    description: 'list of active banners',
    type: BannerDTO,
    isArray: true,
  })
  banners: Array<BannerDTO>;
}
