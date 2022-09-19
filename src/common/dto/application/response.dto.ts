import { AppStatus, AppType } from './application.dto';

export interface RegisterAppResponseDTO {
  appId: string;
}

export interface AppResponseDTO {
  appId: string;
  appVersionId: string;
  listingName: string;
  version: string;
  clientId: string;
  clientSecret: string;
  urlPath: string;
  appType: AppType;
  description: string;
  isPrivate: boolean;
  consoleCompatible: boolean;
  status: AppStatus;
}

export interface IsAppAvailableForRegistrationResponse {
  appUrlPath: {
    available: boolean;
  };
}

export interface CreateFileResponseDTO {
  fileId: string;
  fileName: string;
  fileDescription: string;
  fileUrl?: string | undefined;
}
