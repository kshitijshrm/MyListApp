import { ApplicationDTO } from '../application/application.dto';
import {
  ConfigurationMetadataDTO,
  DocumentMetadataDTO,
  FileMetadataDTO,
} from '../common/common.dto';

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

export interface SolutionDTO
  extends SolutionVersionIdentifierDTO,
    SolutionDisplayAttributesDTO,
    SolutionCompatibilityDTO,
    SolutionDisplayAttributesDTO {
  version: string;
  images: Array<FileMetadataDTO>;
  icon: FileMetadataDTO;
  applications: Array<ApplicationDTO>;
}

export interface SolutionCompatibilityDTO {
  isMarketplaceCompatible: boolean;
  isConsoleCompatible: boolean;
}

export interface SolutionDisplayAttributesDTO {
  displayName: string;
  longDescription: string;
  shortDescription: string;
}

export interface SolutionVersionIdentifierDTO {
  solutionId: string;
  solutionVersionId: string;
}
