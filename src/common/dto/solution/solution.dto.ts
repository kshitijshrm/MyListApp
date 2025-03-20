import { ApiProperty } from '@nestjs/swagger';
import { ApplicationDTO, ApplicationVersionIdentifierDTO } from '../application/application.dto';
import { FileMetadataDTO } from '../common/common.dto';
import { systemAppSettingItem } from 'src/shared/schemas/os1/developerportal/solution/solution.pb';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { PlatformRegexConfig } from '@foxtrotplatform/developer-platform-core-lib';

export enum SolutionPhase {
  SOLUTION_PHASE_UNSPECIFIED = 'SOLUTION_PHASE_UNSPECIFIED',
  DRAFT = 'DRAFT',
  TECH_REVIEW = 'TECH_REVIEW',
  READY_TO_PUBLISH = 'READY_TO_PUBLISH',
  MARKETPLACE_PUBLISH_REVIEW = 'MARKETPLACE_PUBLISH_REVIEW',
  INTERNAL_PUBLISH_REVIEW = 'INTERNAL_PUBLISH_REVIEW',
  LIVE = 'LIVE',
  DEPRECIATED = 'DEPRECIATED',
}

export enum SolutionLifecycleEventCommand {
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

// document category is not identified by product yet
// using solutions phase as document category for now
export enum SolutionDocumentCategory {
  DRAFT = 'DRAFT',
  TECH_REVIEW = 'TECH_REVIEW',
  READY_TO_PUBLISH = 'READY_TO_PUBLISH',
  MARKETPLACE_PUBLISH_REVIEW = 'MARKETPLACE_PUBLISH_REVIEW',
  INTERNAL_PUBLISH_REVIEW = 'INTERNAL_PUBLISH_REVIEW',
  LIVE = 'LIVE',
  DEPRECIATED = 'DEPRECIATED',
}

export class SolutionDTO {
  @ApiProperty({
    description: 'Solution identifier in the OS1 platform',
    example: 'solution:5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
  })
  solutionId: string;
  @ApiProperty({
    description:
      'Identifier for the solution version whis is unique within the solution',
    example: 'solutionVersion:5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
  })
  solutionVersionId: string;
  @ApiProperty({
    description: 'Name of the solution to be displayed in the UI',
    example: 'My Solution',
  })
  displayName: string;
  @ApiProperty({
    description: 'Short description of the solution to be displayed in the UI',
    example: 'My Solution Short Description',
  })
  shortDescription: string;
  @ApiProperty({
    description: 'Description of the solution to be displayed in the UI',
    example: 'My Solution Description',
  })
  longDescription: string;
  @ApiProperty({
    description: 'Human readable semantic version of the solution',
    example: '1.0.0',
  })
  version: string;
  @ApiProperty({
    description:
      'Images associated with the solution to be displayed in the UI',
    type: FileMetadataDTO,
    isArray: true,
    example: [
      {
        fileId: 'file:5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
        fileName: 'solution-image.png',
        fileUrl:
          'https://cdn.os1.delhivery.com/5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
      },
    ],
  })
  images: Array<FileMetadataDTO>;
  @ApiProperty({
    description: 'Icon of the solution to be displayed in the UI',
    type: FileMetadataDTO,
    example: {
      fileId: '5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
      fileName: 'solution-icon.png',
      fileUrl:
        'https://cdn.os1.delhivery.com/5f9b9c0e-7c1e-4b5d-8f9c-0e7c1eab5d8f',
    },
  })
  icon: FileMetadataDTO;
  @ApiProperty({
    description: 'Video of the solution to be displayed in the UI',
    type: ApplicationDTO,
    isArray: true,
  })
  applications: Array<ApplicationDTO>;
  @ApiProperty({
    description: 'Is the solution compatible with the marketplace',
    example: true,
  })
  isMarketplaceCompatible: boolean;
  @ApiProperty({
    description: 'Is the solution compatible with the console',
    example: true,
  })
  isConsoleCompatible: boolean;
  @ApiProperty({
    description: 'Displays list of system apps settings for solution',
    example: [
      {
        appUrn: 'platform:app:mts',
        displayName: 'MTS',
        settingsUrl: '/mts/settings',
      },
    ],
  })
  coreAppSettings: Array<systemAppSettingItem>;
  @ApiProperty({
    description: 'relative url path of the landing page (launch page)',
    example: '/launch/control-tower',
  })
  landingPage: string;
  @ApiProperty({
    description:
      'list of relative paths allowed to be accessed on this solution',
    example: ['/orders', '/application/settings'],
  })
  allowedRedirectUrls: string[];
  @ApiProperty({
    description: 'url of the product guide for the current selected solution',
    example: ['www.dispatchoneguide.com'],
  })
  productGuideUrl: string;
}


export class SolutionApplicationDTO extends ApplicationVersionIdentifierDTO {

  @ApiProperty({
    description:
      'Initilization sequence of the application within the solution',
    required: false,
    example: 1,
  })
  initSequence?: number;

  @ApiProperty({
    description: 'ListingId of the application in the solution',
    required: false,
  })
  listingId?: string;

  @ApiProperty({
    description: 'DisplayName of the application in the solution',
    required: false,
  })
  listingName?: string;

  @ApiProperty({
    description: 'Semantic version number of the application in the solution',
    required: false,
  })
  semver?: string;
  @ApiProperty({
    description: 'The icon associated with the application',
    type: FileMetadataDTO,
  })
  appIcon?: FileMetadataDTO;
}
export class SolutionVersionIdentifierDTO {
  @ApiProperty({
    description: 'A unique identifier for the solution',
    example: 'solution:b31414f1-bc40-42c9-bcc0-ed7a47126441',
    pattern: PlatformRegexConfig.solutionId.source,
  })
  solutionId: string;
  @ApiProperty({
    description: 'A unique identifier for the solution version in a solution',
    example: 'solutionversion:bf17e158-1951-47f9-84f1-e50aeb59fac2',
    pattern: PlatformRegexConfig.solutionVersionId.source,
  })
  solutionVersionId: string;
}

export class SolutionDisplayAttributesDTO {
  @ApiProperty({
    description: 'Solution name to be displayed in the marketplace',
    example: 'Vehicle Routing',
  })
  displayName: string;
  @ApiProperty({
    description: 'Solution description to be displayed in the marketplace',
    example:
      'This is a solution for vehicle routing used to optimize routes for delivery',
  })
  longDescription: string;
  @ApiProperty({
    description:
      'Solution short description to be displayed in the marketplace',
    example: 'This is a solution for vehicle routing',
  })
  shortDescription: string;
}

export class SolutionCompatibilityDTO {
  isConsoleCompatible: boolean;
}


export class AuditInfoDTO {
  @ApiProperty({
    description: 'UTC timestamp in ISO format of the moment of creation',
    type: 'string',
  })
  createdAt: string;
  @ApiProperty({
    description: 'UserId of the user who initiated the creation',
    type: 'string',
  })
  createdBy: string;
  @ApiProperty({
    description: 'UTC timestamp in ISO format of the moment of updation',
    type: 'string',
  })
  updatedAt: string;
  @ApiProperty({
    description: 'UserId of the user who initiated the updation',
    type: 'string',
  })
  updatedBy: string;
}

export class ApiDetailsDTO {
  @ApiProperty({
    description: 'Display name of the api',
    example: 'Geocoder V1',
  })
  name: string;
  @ApiProperty({
    description: 'Relative path of the api',
    example: 'geocoder/v1',
  })
  relativePath: string;
}

export class SolutionVersionDTO
  extends AuditInfoDTO
  implements
  SolutionVersionIdentifierDTO,
  SolutionDisplayAttributesDTO,
  SolutionCompatibilityDTO {
  @ApiProperty({
    description: 'Solution name to be displayed in the marketplace',
    example: 'Vehicle Routing',
  })
  displayName: string;
  @ApiProperty({
    description: 'Solution description to be displayed in the marketplace',
    example:
      'This is a solution for vehicle routing used to optimize routes for delivery',
  })
  longDescription: string;
  @ApiProperty({
    description:
      'Solution short description to be displayed in the marketplace',
    example: 'This is a solution for vehicle routing',
  })
  shortDescription: string;
  @ApiProperty({
    description:
      'Boolean to indicate if the solution is compatible with marketplace',
    example: true,
  })
  isConsoleCompatible: boolean;
  @ApiProperty({
    description: 'A unique identifier for the solution version',
    example: 'solutionversion:b31414f1-bc40-42c9-bcc0-ed7a47126441',
    pattern: PlatformRegexConfig.solutionVersionId.source,
  })
  solutionId: string;
  @ApiProperty({
    description: 'A unique identifier for the solution version',
    example: 'solutionversion:b31414f1-bc40-42c9-bcc0-ed7a47126441',
    pattern: PlatformRegexConfig.solutionVersionId.source,
  })
  solutionVersionId: string;
  @ApiProperty({
    description: 'Human readable semantic version of the solution',
    example: '1.0.0',
  })
  version: string;
  @ApiProperty({
    description: 'List of images associated with the solution',
    type: [FileMetadataDTO],
  })
  images: Array<FileMetadataDTO>;
  @ApiProperty({
    description: 'Icon associated with the solution',
    type: [FileMetadataDTO],
  })
  icon: FileMetadataDTO;
  @ApiProperty({
    description: 'List of applications that are part of the solution',
    type: [SolutionApplicationDTO],
  })
  applications: Array<SolutionApplicationDTO>;
  @ApiProperty({
    description: 'Listing id of the solution',
  })
  listingId: string;
}

export class SolutionResponseDTO {
  @ApiProperty({
    description: 'A unique identifier for the solution',
    example: 'solution:b31414f1-bc40-42c9-bcc0-ed7a47126441',
    pattern: PlatformRegexConfig.solutionId.source,
  })
  solutionId: string;
  @ApiProperty({
    description:
      'List of solution versions that are associated with the solution',
    type: SolutionVersionDTO,
    isArray: true,
  })
  versions: Array<SolutionVersionDTO>;
  @ApiProperty({
    description: 'Solution type',
    required: false,
    enum: ['APP', 'API'],
    example: 'APP',
    default: 'APP',
  })
  solutionType: 'APP' | 'API';
  @ApiProperty({
    description: 'Product family group of the solution',
  })
  productFamily: string;
  @ApiProperty({
    description: 'Countries where the solution is supported',
  })
  supportedCountries: Array<string>;
  @ApiProperty({
    description: 'Organization ID',
  })
  organizationId: string;
}
