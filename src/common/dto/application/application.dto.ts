import { ApiProperty } from '@nestjs/swagger';
import { FileMetadataDTO } from '../common/common.dto';

export enum AppStatus {
  APPLICATION_PHASE_UNSPECIFIED = 'APPLICATION_PHASE_UNSPECIFIED',
  DEVELOPMENT = 'DEVELOPMENT',
}

export enum AppType {
  unspecified = 'unspecified',
  web = 'web',
  mobile = 'mobile',
  backend = 'backend',
}

export enum AppClassification {
  UNSPECIFIED = 'UNSPECIFIED',
  CORE = 'CORE',
  STANDARD = 'STANDARD',
  ADDON = 'ADDON',
  CONFIGURATION = 'CONFIGURATION',
}

export enum LifecycleEventCommand {
  SUBMIT_FOR_TECH_REVIEW = 'SUBMIT_FOR_TECH_REVIEW',
  DECLINE_TECH_REVIEW = 'DECLINE_TECH_REVIEW',
  WITHDRAW_FROM_TECH_REVIEW = 'WITHDRAW_FROM_TECH_REVIEW',
  APPROVE_TECH_REVIEW = 'APPROVE_TECH_REVIEW',
  SUBMIT_FOR_INTERNAL_PUBLISH_REVIEW = 'SUBMIT_FOR_INTERNAL_PUBLISH_REVIEW',
  SUBMIT_FOR_MARKETPLACE_PUBLISH_REVIEW = 'SUBMIT_FOR_MARKETPLACE_PUBLISH_REVIEW',
  APPROVE_INTERNAL_PUBLISH = 'APPROVE_INTERNAL_PUBLISH',
  APPROVE_MARKETPLACE_PUBLISH = 'APPROVE_MARKETPLACE_PUBLISH',
  DEPRECIATE = 'DEPRECIATE',
}

export class ApplicationUrlDTO {
  @ApiProperty({
    description: 'The name of the url',
    example: 'relativePath',
    examples: ['relativePath', 'interface'],
  })
  name: string;
  @ApiProperty({
    description: 'The actual url item',
    example: '/app/my-app',
    examples: ['/app/my-app', 'https://mytenant.os1.delhivery.com/app/my-app'],
  })
  url: string;
  @ApiProperty({
    description: 'The actual item description',
    example: 'this is the description of app settings',
  })
  description?: string | undefined;
}

export class ApplicationMenuDTO {
  @ApiProperty({
    description: 'The unique identifier of the menu item',
    example: '5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
  })
  id: string;
  @ApiProperty({
    description: 'The name of the menu item',
    example: 'Create Order',
  })
  displayName: string;
  @ApiProperty({
    description: 'The order in which the menu item should be displayed',
    example: 1,
  })
  displayOrder: number;
  @ApiProperty({
    description: 'The relative path of the menu item',
    example: '/app/my-app/create-order',
  })
  relativePath: string;
  @ApiProperty({
    description: 'The icon associated with the menu item',
    type: FileMetadataDTO,
  })
  icon: FileMetadataDTO;
}

export class ApplicationDTO {
  @ApiProperty({
    description: 'The unique identifier of the application',
    example: 'app:5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
  })
  appId: string;
  @ApiProperty({
    description: 'The unique identifier of the application version',
    example: 'appversion:5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
  })
  appVersionId: string;
  @ApiProperty({
    description: 'The name of the application',
    example: 'My App',
  })
  listingName: string;
  @ApiProperty({
    description: 'The human readable semantic version of the application',
    example: '1.0.0',
  })
  version: string;
  @ApiProperty({
    deprecated: true,
    description: `
The relative url path of the application. This field is deprecated. Use **appUrls:relativePath** instead`,
  })
  urlPath: string;
  @ApiProperty({
    description: 'The Type of the application',
    example: 'web',
    enum: AppType,
  })
  appType: AppType;
  @ApiProperty({
    description: 'The description of the application to show in the UI',
    example: 'My App is a sample application',
  })
  description: string;
  @ApiProperty({
    description: 'coreos appId',
    example: 'platform:app:258a0fcc-d0c6-5964-bace-c15109ed21b5',
  })
  coreosUrn: string;
  @ApiProperty({
    description: 'Is the application to be displayed in the marketplace',
  })
  isPrivate: boolean;
  @ApiProperty({
    description: 'Is the application to be displayed in the console',
  })
  consoleCompatible: boolean;
  @ApiProperty({
    description: `
The list of url paths that are associated with the application. For web apps, relativePath should be used to access the application. In the presense of interface in the urlOverrides, the interface should be used to access the application`,
    type: ApplicationUrlDTO,
    isArray: true,
  })
  appUrls: Array<ApplicationUrlDTO>;
  @ApiProperty({
    description: `
Url overrides are stack specific urls that needs to take periority over the appUrls when the application is accessed from the tenant that belongs to the stack that is configured in the urlOverrides.

For exmaple, When the console is being accessed from the tenant mytenant.os1.delhivery.com, and the teant mytenant belongs to stack logistax and the urlOverrides contains an entry for logistax, then the urlOverrides should be used to access the application insteand of appUrls. This logic is already performed as part of the API.
`,
    type: ApplicationUrlDTO,
    isArray: true,
  })
  urlOverrides: Array<ApplicationUrlDTO>;
  @ApiProperty({
    description: 'The icon associated with the application',
    type: FileMetadataDTO,
  })
  icon: FileMetadataDTO;
  @ApiProperty({
    description:
      'The image or screenshots associated with the application to be displayed in the marketplace',
    type: FileMetadataDTO,
    isArray: true,
  })
  images: Array<FileMetadataDTO>;
  @ApiProperty({
    description:
      'The short description of the application to be displayed in the marketplace',
    example: 'My App is a sample application',
  })
  shortDescription: string;
  @ApiProperty({
    description:
      'The long description of the application to be displayed in the marketplace',
    example: 'My App is a sample application. This is a long description',
  })
  longDescription: string;
  @ApiProperty({
    description: `Collection of sub menuitems that belong in the console sidenav.`,
    type: ApplicationMenuDTO,
    isArray: true,
  })
  applicationMenu: Array<ApplicationMenuDTO>;
  @ApiProperty({
    description: 'The icon associated with the application',
    type: FileMetadataDTO,
  })
  settingsIcon?: FileMetadataDTO;
}