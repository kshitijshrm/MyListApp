import { ApiProperty } from '@nestjs/swagger';
import { ApplicationDTO } from '../application/application.dto';
import { FileMetadataDTO } from '../common/common.dto';
import { systemAppSettingItem } from 'src/shared/schemas/os1/developerportal/solution/solution.pb';

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
  solutionAppSetting: Array<systemAppSettingItem>;
  @ApiProperty({
    name: 'Landing Page',
    description: 'relative url path of the landing page (launch page)',
    example: '/launch/control-tower',
  })
  landingPage: string;
  @ApiProperty({
    name: 'allowed redirect URIs',
    description:
      'list of relative paths allowed to be accessed on this solution',
    example: ['/orders', '/application/settings'],
  })
  allowedRedirectUrls: string[];
}
