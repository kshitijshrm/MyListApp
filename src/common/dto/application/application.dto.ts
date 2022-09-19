export interface Url {
  server?: string;
  interface?: string;
  admin?: string;
  setting?: string;
  userguide?: string;
  gitinfo?: string;
}
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
  urlOverrides: Array<UrlOverrideDTO>;
  icons: Array<FileMetadataDTO>;
  images: Array<FileMetadataDTO>;
  shortDescription: string;
  longDescription: string;
}

export interface ApplicationUrlDTO {
  name: string;
  url: string;
}

export interface UrlOverrideDTO {
  stackId: string;
  url: string;
}
export interface FileMetadataDTO {
  fileId: string;
  fileName: string;
  fileDescription: string;
  fileUrl?: string | undefined;
}
