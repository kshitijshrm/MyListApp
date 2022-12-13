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

export interface ApplicationDTO {
  appId: string;
  appVersionId: string;
  listingName: string;
  version: string;
  urlPath: string;
  appType: AppType;
  description: string;
  isPrivate: boolean;
  consoleCompatible: boolean;
  appUrls: Array<ApplicationUrlDTO>;
  urlOverrides: Array<ApplicationUrlDTO>;
  icon: FileMetadataDTO;
  images: Array<FileMetadataDTO>;
  shortDescription: string;
  longDescription: string;
  applicationMenu: Array<ApplicationMenuDTO>;
}

export interface ApplicationUrlDTO {
  name: string;
  url: string;
}

export interface FileMetadataDTO {
  fileId: string;
  fileName: string;
  fileDescription: string;
  fileUrl?: string | undefined;
}

export interface ApplicationMenuDTO {
  id: string;
  displayName: string;
  displayOrder: number;
  relativePath: string;
  icon: FileMetadataDTO;
}
