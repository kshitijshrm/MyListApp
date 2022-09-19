/* eslint-disable */
import {
  ApplicationIdentifier,
  ApplicationVersionIdentifier,
} from './identifiers.pb';
import { OrganizationTeamMetadata } from '../../core/organization/identifiers.pb';
import { RecordStatus, RecordAudit } from '../../core/common/common.pb';
import { FileMetadata } from '../../core/file/file.pb';
import { SolutionVersionIdentifier } from '../solution/identifiers.pb';

export const protobufPackage = 'os1.developerportal.application';

export enum ApplicationType {
  APPLICATION_TYPE_UNSPECIFIED = 0,
  WEB = 1,
  BACKEND = 2,
  MOBILE = 3,
  UNRECOGNIZED = -1,
}

export function applicationTypeFromJSON(object: any): ApplicationType {
  switch (object) {
    case 0:
    case 'APPLICATION_TYPE_UNSPECIFIED':
      return ApplicationType.APPLICATION_TYPE_UNSPECIFIED;
    case 1:
    case 'WEB':
      return ApplicationType.WEB;
    case 2:
    case 'BACKEND':
      return ApplicationType.BACKEND;
    case 3:
    case 'MOBILE':
      return ApplicationType.MOBILE;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ApplicationType.UNRECOGNIZED;
  }
}

export function applicationTypeToJSON(object: ApplicationType): string {
  switch (object) {
    case ApplicationType.APPLICATION_TYPE_UNSPECIFIED:
      return 'APPLICATION_TYPE_UNSPECIFIED';
    case ApplicationType.WEB:
      return 'WEB';
    case ApplicationType.BACKEND:
      return 'BACKEND';
    case ApplicationType.MOBILE:
      return 'MOBILE';
    case ApplicationType.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum ApplicationClassification {
  APPLICATION_CLASSIFICATION_UNSPECIFIED = 0,
  CORE = 1,
  STANDARD = 2,
  ADDON = 3,
  CONFIGURATION = 4,
  UNRECOGNIZED = -1,
}

export function applicationClassificationFromJSON(
  object: any,
): ApplicationClassification {
  switch (object) {
    case 0:
    case 'APPLICATION_CLASSIFICATION_UNSPECIFIED':
      return ApplicationClassification.APPLICATION_CLASSIFICATION_UNSPECIFIED;
    case 1:
    case 'CORE':
      return ApplicationClassification.CORE;
    case 2:
    case 'STANDARD':
      return ApplicationClassification.STANDARD;
    case 3:
    case 'ADDON':
      return ApplicationClassification.ADDON;
    case 4:
    case 'CONFIGURATION':
      return ApplicationClassification.CONFIGURATION;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ApplicationClassification.UNRECOGNIZED;
  }
}

export function applicationClassificationToJSON(
  object: ApplicationClassification,
): string {
  switch (object) {
    case ApplicationClassification.APPLICATION_CLASSIFICATION_UNSPECIFIED:
      return 'APPLICATION_CLASSIFICATION_UNSPECIFIED';
    case ApplicationClassification.CORE:
      return 'CORE';
    case ApplicationClassification.STANDARD:
      return 'STANDARD';
    case ApplicationClassification.ADDON:
      return 'ADDON';
    case ApplicationClassification.CONFIGURATION:
      return 'CONFIGURATION';
    case ApplicationClassification.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum ApplicationHosting {
  APPLICATION_HOSTING = 0,
  PLATFORM = 1,
  SELF = 2,
  UNRECOGNIZED = -1,
}

export function applicationHostingFromJSON(object: any): ApplicationHosting {
  switch (object) {
    case 0:
    case 'APPLICATION_HOSTING':
      return ApplicationHosting.APPLICATION_HOSTING;
    case 1:
    case 'PLATFORM':
      return ApplicationHosting.PLATFORM;
    case 2:
    case 'SELF':
      return ApplicationHosting.SELF;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ApplicationHosting.UNRECOGNIZED;
  }
}

export function applicationHostingToJSON(object: ApplicationHosting): string {
  switch (object) {
    case ApplicationHosting.APPLICATION_HOSTING:
      return 'APPLICATION_HOSTING';
    case ApplicationHosting.PLATFORM:
      return 'PLATFORM';
    case ApplicationHosting.SELF:
      return 'SELF';
    case ApplicationHosting.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum ApplicationPhase {
  APPLICATION_PHASE_UNSPECIFIED = 0,
  DEVELOPMENT = 1,
  TECH_REVIEW = 2,
  READY_TO_PUBLISH = 3,
  MARKETPLACE_PUBLISH_REVIEW = 4,
  INTERNAL_PUBLISH_REVIEW = 5,
  LIVE = 6,
  DEPRECIATED = 7,
  UNRECOGNIZED = -1,
}

export function applicationPhaseFromJSON(object: any): ApplicationPhase {
  switch (object) {
    case 0:
    case 'APPLICATION_PHASE_UNSPECIFIED':
      return ApplicationPhase.APPLICATION_PHASE_UNSPECIFIED;
    case 1:
    case 'DEVELOPMENT':
      return ApplicationPhase.DEVELOPMENT;
    case 2:
    case 'TECH_REVIEW':
      return ApplicationPhase.TECH_REVIEW;
    case 3:
    case 'READY_TO_PUBLISH':
      return ApplicationPhase.READY_TO_PUBLISH;
    case 4:
    case 'MARKETPLACE_PUBLISH_REVIEW':
      return ApplicationPhase.MARKETPLACE_PUBLISH_REVIEW;
    case 5:
    case 'INTERNAL_PUBLISH_REVIEW':
      return ApplicationPhase.INTERNAL_PUBLISH_REVIEW;
    case 6:
    case 'LIVE':
      return ApplicationPhase.LIVE;
    case 7:
    case 'DEPRECIATED':
      return ApplicationPhase.DEPRECIATED;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ApplicationPhase.UNRECOGNIZED;
  }
}

export function applicationPhaseToJSON(object: ApplicationPhase): string {
  switch (object) {
    case ApplicationPhase.APPLICATION_PHASE_UNSPECIFIED:
      return 'APPLICATION_PHASE_UNSPECIFIED';
    case ApplicationPhase.DEVELOPMENT:
      return 'DEVELOPMENT';
    case ApplicationPhase.TECH_REVIEW:
      return 'TECH_REVIEW';
    case ApplicationPhase.READY_TO_PUBLISH:
      return 'READY_TO_PUBLISH';
    case ApplicationPhase.MARKETPLACE_PUBLISH_REVIEW:
      return 'MARKETPLACE_PUBLISH_REVIEW';
    case ApplicationPhase.INTERNAL_PUBLISH_REVIEW:
      return 'INTERNAL_PUBLISH_REVIEW';
    case ApplicationPhase.LIVE:
      return 'LIVE';
    case ApplicationPhase.DEPRECIATED:
      return 'DEPRECIATED';
    case ApplicationPhase.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export interface Application {
  id: ApplicationIdentifier | undefined;
  /** unique app name (can be same as the url_path) */
  name: string;
  /** unique url path of the application */
  urlPath: string;
  urn: string;
  orgTeam: OrganizationTeamMetadata | undefined;
  clientCredentials: ClientCredentials | undefined;
  appType: ApplicationType;
  versions: ApplicationVersion[];
  appClassification: ApplicationClassification;
}

export interface ApplicationVersion {
  id: ApplicationVersionIdentifier | undefined;
  /** application display name */
  displayName: string;
  version: string;
  description: string;
  applicationPhase: ApplicationPhase;
  applicationCompitablity?: ApplicationCompitablity | undefined;
  privacy: ApplicationPrivacy | undefined;
  hosting: ApplicationHosting;
  recordStatus: RecordStatus | undefined;
  appIcons: FileMetadata[];
  displayImages: FileMetadata[];
  state: ApplicationState | undefined;
  appUrls: ApplicationUrl[];
  appUrlOverrides: ApplicationUrlOverride[];
  recordAudit: RecordAudit | undefined;
  shortDescription: string;
  longDescription: string;
}

export interface ApplicationPrivacy {
  type: ApplicationPrivacy_Type;
}

export enum ApplicationPrivacy_Type {
  PRIVACY_TYPE_UNSPECIFIED = 0,
  PRIVATE = 1,
  PUBLIC = 2,
  UNRECOGNIZED = -1,
}

export function applicationPrivacy_TypeFromJSON(
  object: any,
): ApplicationPrivacy_Type {
  switch (object) {
    case 0:
    case 'PRIVACY_TYPE_UNSPECIFIED':
      return ApplicationPrivacy_Type.PRIVACY_TYPE_UNSPECIFIED;
    case 1:
    case 'PRIVATE':
      return ApplicationPrivacy_Type.PRIVATE;
    case 2:
    case 'PUBLIC':
      return ApplicationPrivacy_Type.PUBLIC;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ApplicationPrivacy_Type.UNRECOGNIZED;
  }
}

export function applicationPrivacy_TypeToJSON(
  object: ApplicationPrivacy_Type,
): string {
  switch (object) {
    case ApplicationPrivacy_Type.PRIVACY_TYPE_UNSPECIFIED:
      return 'PRIVACY_TYPE_UNSPECIFIED';
    case ApplicationPrivacy_Type.PRIVATE:
      return 'PRIVATE';
    case ApplicationPrivacy_Type.PUBLIC:
      return 'PUBLIC';
    case ApplicationPrivacy_Type.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export interface ClientCredentials {
  clientId: string;
  clientSecretPlainText: string | undefined;
  clientSecretEncrypted: EncryptedAppSecret | undefined;
}

export interface EncryptedAppSecret {
  iv: string;
  encryptedText: string;
}

export interface ApplicationCompitablity {
  isMarketplaceCompatible?: boolean | undefined;
  isConsoleCompatible?: boolean | undefined;
  compitableSolutions: SolutionVersionIdentifier[];
}

export interface ApplicationState {
  createApp: string;
  subscribeApp: string;
  grantPerimssions: string;
}

export interface ApplicationUrl {
  /** Name of the link (server, interface, admin, settings, etc) */
  name: string;
  /** Actual url value */
  url: string;
}

export interface ApplicationUrlOverride {
  /** Name of the stack where application to be present */
  stackId: string;
  /** Actual url of the app */
  url: string;
}

export const OS1_DEVELOPERPORTAL_APPLICATION_PACKAGE_NAME =
  'os1.developerportal.application';

function createBaseApplication(): Application {
  return {
    id: undefined,
    name: '',
    urlPath: '',
    urn: '',
    orgTeam: undefined,
    clientCredentials: undefined,
    appType: 0,
    versions: [],
    appClassification: 0,
  };
}

export const Application = {
  fromJSON(object: any): Application {
    return {
      id: isSet(object.id)
        ? ApplicationIdentifier.fromJSON(object.id)
        : undefined,
      name: isSet(object.name) ? String(object.name) : '',
      urlPath: isSet(object.urlPath) ? String(object.urlPath) : '',
      urn: isSet(object.urn) ? String(object.urn) : '',
      orgTeam: isSet(object.orgTeam)
        ? OrganizationTeamMetadata.fromJSON(object.orgTeam)
        : undefined,
      clientCredentials: isSet(object.clientCredentials)
        ? ClientCredentials.fromJSON(object.clientCredentials)
        : undefined,
      appType: isSet(object.appType)
        ? applicationTypeFromJSON(object.appType)
        : 0,
      versions: Array.isArray(object?.versions)
        ? object.versions.map((e: any) => ApplicationVersion.fromJSON(e))
        : [],
      appClassification: isSet(object.appClassification)
        ? applicationClassificationFromJSON(object.appClassification)
        : 0,
    };
  },

  toJSON(message: Application): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationIdentifier.toJSON(message.id)
        : undefined);
    message.name !== undefined && (obj.name = message.name);
    message.urlPath !== undefined && (obj.urlPath = message.urlPath);
    message.urn !== undefined && (obj.urn = message.urn);
    message.orgTeam !== undefined &&
      (obj.orgTeam = message.orgTeam
        ? OrganizationTeamMetadata.toJSON(message.orgTeam)
        : undefined);
    message.clientCredentials !== undefined &&
      (obj.clientCredentials = message.clientCredentials
        ? ClientCredentials.toJSON(message.clientCredentials)
        : undefined);
    message.appType !== undefined &&
      (obj.appType = applicationTypeToJSON(message.appType));
    if (message.versions) {
      obj.versions = message.versions.map((e) =>
        e ? ApplicationVersion.toJSON(e) : undefined,
      );
    } else {
      obj.versions = [];
    }
    message.appClassification !== undefined &&
      (obj.appClassification = applicationClassificationToJSON(
        message.appClassification,
      ));
    return obj;
  },
};

function createBaseApplicationVersion(): ApplicationVersion {
  return {
    id: undefined,
    displayName: '',
    version: '',
    description: '',
    applicationPhase: 0,
    applicationCompitablity: undefined,
    privacy: undefined,
    hosting: 0,
    recordStatus: undefined,
    appIcons: [],
    displayImages: [],
    state: undefined,
    appUrls: [],
    appUrlOverrides: [],
    recordAudit: undefined,
    shortDescription: '',
    longDescription: '',
  };
}

export const ApplicationVersion = {
  fromJSON(object: any): ApplicationVersion {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
      displayName: isSet(object.displayName) ? String(object.displayName) : '',
      version: isSet(object.version) ? String(object.version) : '',
      description: isSet(object.description) ? String(object.description) : '',
      applicationPhase: isSet(object.applicationPhase)
        ? applicationPhaseFromJSON(object.applicationPhase)
        : 0,
      applicationCompitablity: isSet(object.applicationCompitablity)
        ? ApplicationCompitablity.fromJSON(object.applicationCompitablity)
        : undefined,
      privacy: isSet(object.privacy)
        ? ApplicationPrivacy.fromJSON(object.privacy)
        : undefined,
      hosting: isSet(object.hosting)
        ? applicationHostingFromJSON(object.hosting)
        : 0,
      recordStatus: isSet(object.recordStatus)
        ? RecordStatus.fromJSON(object.recordStatus)
        : undefined,
      appIcons: Array.isArray(object?.appIcons)
        ? object.appIcons.map((e: any) => FileMetadata.fromJSON(e))
        : [],
      displayImages: Array.isArray(object?.displayImages)
        ? object.displayImages.map((e: any) => FileMetadata.fromJSON(e))
        : [],
      state: isSet(object.state)
        ? ApplicationState.fromJSON(object.state)
        : undefined,
      appUrls: Array.isArray(object?.appUrls)
        ? object.appUrls.map((e: any) => ApplicationUrl.fromJSON(e))
        : [],
      appUrlOverrides: Array.isArray(object?.appUrlOverrides)
        ? object.appUrlOverrides.map((e: any) =>
            ApplicationUrlOverride.fromJSON(e),
          )
        : [],
      recordAudit: isSet(object.recordAudit)
        ? RecordAudit.fromJSON(object.recordAudit)
        : undefined,
      shortDescription: isSet(object.shortDescription)
        ? String(object.shortDescription)
        : '',
      longDescription: isSet(object.longDescription)
        ? String(object.longDescription)
        : '',
    };
  },

  toJSON(message: ApplicationVersion): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.version !== undefined && (obj.version = message.version);
    message.description !== undefined &&
      (obj.description = message.description);
    message.applicationPhase !== undefined &&
      (obj.applicationPhase = applicationPhaseToJSON(message.applicationPhase));
    message.applicationCompitablity !== undefined &&
      (obj.applicationCompitablity = message.applicationCompitablity
        ? ApplicationCompitablity.toJSON(message.applicationCompitablity)
        : undefined);
    message.privacy !== undefined &&
      (obj.privacy = message.privacy
        ? ApplicationPrivacy.toJSON(message.privacy)
        : undefined);
    message.hosting !== undefined &&
      (obj.hosting = applicationHostingToJSON(message.hosting));
    message.recordStatus !== undefined &&
      (obj.recordStatus = message.recordStatus
        ? RecordStatus.toJSON(message.recordStatus)
        : undefined);
    if (message.appIcons) {
      obj.appIcons = message.appIcons.map((e) =>
        e ? FileMetadata.toJSON(e) : undefined,
      );
    } else {
      obj.appIcons = [];
    }
    if (message.displayImages) {
      obj.displayImages = message.displayImages.map((e) =>
        e ? FileMetadata.toJSON(e) : undefined,
      );
    } else {
      obj.displayImages = [];
    }
    message.state !== undefined &&
      (obj.state = message.state
        ? ApplicationState.toJSON(message.state)
        : undefined);
    if (message.appUrls) {
      obj.appUrls = message.appUrls.map((e) =>
        e ? ApplicationUrl.toJSON(e) : undefined,
      );
    } else {
      obj.appUrls = [];
    }
    if (message.appUrlOverrides) {
      obj.appUrlOverrides = message.appUrlOverrides.map((e) =>
        e ? ApplicationUrlOverride.toJSON(e) : undefined,
      );
    } else {
      obj.appUrlOverrides = [];
    }
    message.recordAudit !== undefined &&
      (obj.recordAudit = message.recordAudit
        ? RecordAudit.toJSON(message.recordAudit)
        : undefined);
    message.shortDescription !== undefined &&
      (obj.shortDescription = message.shortDescription);
    message.longDescription !== undefined &&
      (obj.longDescription = message.longDescription);
    return obj;
  },
};

function createBaseApplicationPrivacy(): ApplicationPrivacy {
  return { type: 0 };
}

export const ApplicationPrivacy = {
  fromJSON(object: any): ApplicationPrivacy {
    return {
      type: isSet(object.type)
        ? applicationPrivacy_TypeFromJSON(object.type)
        : 0,
    };
  },

  toJSON(message: ApplicationPrivacy): unknown {
    const obj: any = {};
    message.type !== undefined &&
      (obj.type = applicationPrivacy_TypeToJSON(message.type));
    return obj;
  },
};

function createBaseClientCredentials(): ClientCredentials {
  return {
    clientId: '',
    clientSecretPlainText: undefined,
    clientSecretEncrypted: undefined,
  };
}

export const ClientCredentials = {
  fromJSON(object: any): ClientCredentials {
    return {
      clientId: isSet(object.clientId) ? String(object.clientId) : '',
      clientSecretPlainText: isSet(object.clientSecretPlainText)
        ? String(object.clientSecretPlainText)
        : undefined,
      clientSecretEncrypted: isSet(object.clientSecretEncrypted)
        ? EncryptedAppSecret.fromJSON(object.clientSecretEncrypted)
        : undefined,
    };
  },

  toJSON(message: ClientCredentials): unknown {
    const obj: any = {};
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.clientSecretPlainText !== undefined &&
      (obj.clientSecretPlainText = message.clientSecretPlainText);
    message.clientSecretEncrypted !== undefined &&
      (obj.clientSecretEncrypted = message.clientSecretEncrypted
        ? EncryptedAppSecret.toJSON(message.clientSecretEncrypted)
        : undefined);
    return obj;
  },
};

function createBaseEncryptedAppSecret(): EncryptedAppSecret {
  return { iv: '', encryptedText: '' };
}

export const EncryptedAppSecret = {
  fromJSON(object: any): EncryptedAppSecret {
    return {
      iv: isSet(object.iv) ? String(object.iv) : '',
      encryptedText: isSet(object.encryptedText)
        ? String(object.encryptedText)
        : '',
    };
  },

  toJSON(message: EncryptedAppSecret): unknown {
    const obj: any = {};
    message.iv !== undefined && (obj.iv = message.iv);
    message.encryptedText !== undefined &&
      (obj.encryptedText = message.encryptedText);
    return obj;
  },
};

function createBaseApplicationCompitablity(): ApplicationCompitablity {
  return {
    isMarketplaceCompatible: undefined,
    isConsoleCompatible: undefined,
    compitableSolutions: [],
  };
}

export const ApplicationCompitablity = {
  fromJSON(object: any): ApplicationCompitablity {
    return {
      isMarketplaceCompatible: isSet(object.isMarketplaceCompatible)
        ? Boolean(object.isMarketplaceCompatible)
        : undefined,
      isConsoleCompatible: isSet(object.isConsoleCompatible)
        ? Boolean(object.isConsoleCompatible)
        : undefined,
      compitableSolutions: Array.isArray(object?.compitableSolutions)
        ? object.compitableSolutions.map((e: any) =>
            SolutionVersionIdentifier.fromJSON(e),
          )
        : [],
    };
  },

  toJSON(message: ApplicationCompitablity): unknown {
    const obj: any = {};
    message.isMarketplaceCompatible !== undefined &&
      (obj.isMarketplaceCompatible = message.isMarketplaceCompatible);
    message.isConsoleCompatible !== undefined &&
      (obj.isConsoleCompatible = message.isConsoleCompatible);
    if (message.compitableSolutions) {
      obj.compitableSolutions = message.compitableSolutions.map((e) =>
        e ? SolutionVersionIdentifier.toJSON(e) : undefined,
      );
    } else {
      obj.compitableSolutions = [];
    }
    return obj;
  },
};

function createBaseApplicationState(): ApplicationState {
  return { createApp: '', subscribeApp: '', grantPerimssions: '' };
}

export const ApplicationState = {
  fromJSON(object: any): ApplicationState {
    return {
      createApp: isSet(object.createApp) ? String(object.createApp) : '',
      subscribeApp: isSet(object.subscribeApp)
        ? String(object.subscribeApp)
        : '',
      grantPerimssions: isSet(object.grantPerimssions)
        ? String(object.grantPerimssions)
        : '',
    };
  },

  toJSON(message: ApplicationState): unknown {
    const obj: any = {};
    message.createApp !== undefined && (obj.createApp = message.createApp);
    message.subscribeApp !== undefined &&
      (obj.subscribeApp = message.subscribeApp);
    message.grantPerimssions !== undefined &&
      (obj.grantPerimssions = message.grantPerimssions);
    return obj;
  },
};

function createBaseApplicationUrl(): ApplicationUrl {
  return { name: '', url: '' };
}

export const ApplicationUrl = {
  fromJSON(object: any): ApplicationUrl {
    return {
      name: isSet(object.name) ? String(object.name) : '',
      url: isSet(object.url) ? String(object.url) : '',
    };
  },

  toJSON(message: ApplicationUrl): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.url !== undefined && (obj.url = message.url);
    return obj;
  },
};

function createBaseApplicationUrlOverride(): ApplicationUrlOverride {
  return { stackId: '', url: '' };
}

export const ApplicationUrlOverride = {
  fromJSON(object: any): ApplicationUrlOverride {
    return {
      stackId: isSet(object.stackId) ? String(object.stackId) : '',
      url: isSet(object.url) ? String(object.url) : '',
    };
  },

  toJSON(message: ApplicationUrlOverride): unknown {
    const obj: any = {};
    message.stackId !== undefined && (obj.stackId = message.stackId);
    message.url !== undefined && (obj.url = message.url);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
