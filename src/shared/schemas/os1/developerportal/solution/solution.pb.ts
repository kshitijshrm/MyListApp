/* eslint-disable */
import {
  SolutionIdentifier,
  SolutionVersionIdentifier,
} from './identifiers.pb';
import { OrganizationMetadata } from '../../core/organization/identifiers.pb';
import { FileMetadata } from '../../core/file/file.pb';
import { ApplicationVersionIdentifier } from '../application/identifiers.pb';
import { RecordStatus, RecordAudit } from '../../core/common/common.pb';

export const protobufPackage = 'os1.developerportal.solution';

export enum SolutionPhase {
  APPLICATION_PHASE_UNSPECIFIED = 0,
  DRAFT = 1,
  TECH_REVIEW = 2,
  READY_TO_PUBLISH = 3,
  MARKETPLACE_PUBLISH_REVIEW = 4,
  INTERNAL_PUBLISH_REVIEW = 5,
  LIVE = 6,
  DEPRECIATED = 7,
  UNRECOGNIZED = -1,
}

export function solutionPhaseFromJSON(object: any): SolutionPhase {
  switch (object) {
    case 0:
    case 'APPLICATION_PHASE_UNSPECIFIED':
      return SolutionPhase.APPLICATION_PHASE_UNSPECIFIED;
    case 1:
    case 'DRAFT':
      return SolutionPhase.DRAFT;
    case 2:
    case 'TECH_REVIEW':
      return SolutionPhase.TECH_REVIEW;
    case 3:
    case 'READY_TO_PUBLISH':
      return SolutionPhase.READY_TO_PUBLISH;
    case 4:
    case 'MARKETPLACE_PUBLISH_REVIEW':
      return SolutionPhase.MARKETPLACE_PUBLISH_REVIEW;
    case 5:
    case 'INTERNAL_PUBLISH_REVIEW':
      return SolutionPhase.INTERNAL_PUBLISH_REVIEW;
    case 6:
    case 'LIVE':
      return SolutionPhase.LIVE;
    case 7:
    case 'DEPRECIATED':
      return SolutionPhase.DEPRECIATED;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return SolutionPhase.UNRECOGNIZED;
  }
}

export function solutionPhaseToJSON(object: SolutionPhase): string {
  switch (object) {
    case SolutionPhase.APPLICATION_PHASE_UNSPECIFIED:
      return 'APPLICATION_PHASE_UNSPECIFIED';
    case SolutionPhase.DRAFT:
      return 'DRAFT';
    case SolutionPhase.TECH_REVIEW:
      return 'TECH_REVIEW';
    case SolutionPhase.READY_TO_PUBLISH:
      return 'READY_TO_PUBLISH';
    case SolutionPhase.MARKETPLACE_PUBLISH_REVIEW:
      return 'MARKETPLACE_PUBLISH_REVIEW';
    case SolutionPhase.INTERNAL_PUBLISH_REVIEW:
      return 'INTERNAL_PUBLISH_REVIEW';
    case SolutionPhase.LIVE:
      return 'LIVE';
    case SolutionPhase.DEPRECIATED:
      return 'DEPRECIATED';
    case SolutionPhase.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export interface Solution {
  id: SolutionIdentifier | undefined;
  urn: string;
  organization: OrganizationMetadata | undefined;
  version: SolutionVersion[];
}

export interface SolutionVersion {
  id: SolutionVersionIdentifier | undefined;
  version: string;
  displayAttributes: SolutionDisplayAttributes | undefined;
  classification: SolutionClassification | undefined;
  phase: SolutionPhase;
  compatibility?: SolutionCompatibility | undefined;
  icons: FileMetadata[];
  displayImages: FileMetadata[];
  documents: SolutionDocumentMetadata[];
  applications: ApplicationVersionIdentifier[];
  recordStatus: RecordStatus | undefined;
  recordAudit: RecordAudit | undefined;
  submissionId: string;
  terms: SolutionTerms | undefined;
  configurations: SolutionConfiguration[];
}

export interface SolutionDisplayAttributes {
  /** solution display name */
  displayName: string;
  shortDescription: string;
  longDescription: string;
}

export interface SolutionClassification {
  categories: string[];
}

export interface SolutionCompatibility {
  isMarketplaceCompatible?: boolean | undefined;
  isConsoleCompatible?: boolean | undefined;
}

export interface SolutionTerms {
  isCopyrightFree?: boolean | undefined;
}

export interface SolutionState {
  createApp: string;
  subscribeApp: string;
  grantPerimssions: string;
}

export interface SolutionConfiguration {
  category: string;
  configurationFile: FileMetadata | undefined;
}

export interface SolutionDocumentMetadata {
  category: string;
  file: FileMetadata | undefined;
}

export const OS1_DEVELOPERPORTAL_SOLUTION_PACKAGE_NAME =
  'os1.developerportal.solution';

function createBaseSolution(): Solution {
  return { id: undefined, urn: '', organization: undefined, version: [] };
}

export const Solution = {
  fromJSON(object: any): Solution {
    return {
      id: isSet(object.id) ? SolutionIdentifier.fromJSON(object.id) : undefined,
      urn: isSet(object.urn) ? String(object.urn) : '',
      organization: isSet(object.organization)
        ? OrganizationMetadata.fromJSON(object.organization)
        : undefined,
      version: Array.isArray(object?.version)
        ? object.version.map((e: any) => SolutionVersion.fromJSON(e))
        : [],
    };
  },

  toJSON(message: Solution): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id ? SolutionIdentifier.toJSON(message.id) : undefined);
    message.urn !== undefined && (obj.urn = message.urn);
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? OrganizationMetadata.toJSON(message.organization)
        : undefined);
    if (message.version) {
      obj.version = message.version.map((e) =>
        e ? SolutionVersion.toJSON(e) : undefined,
      );
    } else {
      obj.version = [];
    }
    return obj;
  },
};

function createBaseSolutionVersion(): SolutionVersion {
  return {
    id: undefined,
    version: '',
    displayAttributes: undefined,
    classification: undefined,
    phase: 0,
    compatibility: undefined,
    icons: [],
    displayImages: [],
    documents: [],
    applications: [],
    recordStatus: undefined,
    recordAudit: undefined,
    submissionId: '',
    terms: undefined,
    configurations: [],
  };
}

export const SolutionVersion = {
  fromJSON(object: any): SolutionVersion {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
      version: isSet(object.version) ? String(object.version) : '',
      displayAttributes: isSet(object.displayAttributes)
        ? SolutionDisplayAttributes.fromJSON(object.displayAttributes)
        : undefined,
      classification: isSet(object.classification)
        ? SolutionClassification.fromJSON(object.classification)
        : undefined,
      phase: isSet(object.phase) ? solutionPhaseFromJSON(object.phase) : 0,
      compatibility: isSet(object.compatibility)
        ? SolutionCompatibility.fromJSON(object.compatibility)
        : undefined,
      icons: Array.isArray(object?.icons)
        ? object.icons.map((e: any) => FileMetadata.fromJSON(e))
        : [],
      displayImages: Array.isArray(object?.displayImages)
        ? object.displayImages.map((e: any) => FileMetadata.fromJSON(e))
        : [],
      documents: Array.isArray(object?.documents)
        ? object.documents.map((e: any) => SolutionDocumentMetadata.fromJSON(e))
        : [],
      applications: Array.isArray(object?.applications)
        ? object.applications.map((e: any) =>
            ApplicationVersionIdentifier.fromJSON(e),
          )
        : [],
      recordStatus: isSet(object.recordStatus)
        ? RecordStatus.fromJSON(object.recordStatus)
        : undefined,
      recordAudit: isSet(object.recordAudit)
        ? RecordAudit.fromJSON(object.recordAudit)
        : undefined,
      submissionId: isSet(object.submissionId)
        ? String(object.submissionId)
        : '',
      terms: isSet(object.terms)
        ? SolutionTerms.fromJSON(object.terms)
        : undefined,
      configurations: Array.isArray(object?.configurations)
        ? object.configurations.map((e: any) =>
            SolutionConfiguration.fromJSON(e),
          )
        : [],
    };
  },

  toJSON(message: SolutionVersion): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    message.version !== undefined && (obj.version = message.version);
    message.displayAttributes !== undefined &&
      (obj.displayAttributes = message.displayAttributes
        ? SolutionDisplayAttributes.toJSON(message.displayAttributes)
        : undefined);
    message.classification !== undefined &&
      (obj.classification = message.classification
        ? SolutionClassification.toJSON(message.classification)
        : undefined);
    message.phase !== undefined &&
      (obj.phase = solutionPhaseToJSON(message.phase));
    message.compatibility !== undefined &&
      (obj.compatibility = message.compatibility
        ? SolutionCompatibility.toJSON(message.compatibility)
        : undefined);
    if (message.icons) {
      obj.icons = message.icons.map((e) =>
        e ? FileMetadata.toJSON(e) : undefined,
      );
    } else {
      obj.icons = [];
    }
    if (message.displayImages) {
      obj.displayImages = message.displayImages.map((e) =>
        e ? FileMetadata.toJSON(e) : undefined,
      );
    } else {
      obj.displayImages = [];
    }
    if (message.documents) {
      obj.documents = message.documents.map((e) =>
        e ? SolutionDocumentMetadata.toJSON(e) : undefined,
      );
    } else {
      obj.documents = [];
    }
    if (message.applications) {
      obj.applications = message.applications.map((e) =>
        e ? ApplicationVersionIdentifier.toJSON(e) : undefined,
      );
    } else {
      obj.applications = [];
    }
    message.recordStatus !== undefined &&
      (obj.recordStatus = message.recordStatus
        ? RecordStatus.toJSON(message.recordStatus)
        : undefined);
    message.recordAudit !== undefined &&
      (obj.recordAudit = message.recordAudit
        ? RecordAudit.toJSON(message.recordAudit)
        : undefined);
    message.submissionId !== undefined &&
      (obj.submissionId = message.submissionId);
    message.terms !== undefined &&
      (obj.terms = message.terms
        ? SolutionTerms.toJSON(message.terms)
        : undefined);
    if (message.configurations) {
      obj.configurations = message.configurations.map((e) =>
        e ? SolutionConfiguration.toJSON(e) : undefined,
      );
    } else {
      obj.configurations = [];
    }
    return obj;
  },
};

function createBaseSolutionDisplayAttributes(): SolutionDisplayAttributes {
  return { displayName: '', shortDescription: '', longDescription: '' };
}

export const SolutionDisplayAttributes = {
  fromJSON(object: any): SolutionDisplayAttributes {
    return {
      displayName: isSet(object.displayName) ? String(object.displayName) : '',
      shortDescription: isSet(object.shortDescription)
        ? String(object.shortDescription)
        : '',
      longDescription: isSet(object.longDescription)
        ? String(object.longDescription)
        : '',
    };
  },

  toJSON(message: SolutionDisplayAttributes): unknown {
    const obj: any = {};
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.shortDescription !== undefined &&
      (obj.shortDescription = message.shortDescription);
    message.longDescription !== undefined &&
      (obj.longDescription = message.longDescription);
    return obj;
  },
};

function createBaseSolutionClassification(): SolutionClassification {
  return { categories: [] };
}

export const SolutionClassification = {
  fromJSON(object: any): SolutionClassification {
    return {
      categories: Array.isArray(object?.categories)
        ? object.categories.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: SolutionClassification): unknown {
    const obj: any = {};
    if (message.categories) {
      obj.categories = message.categories.map((e) => e);
    } else {
      obj.categories = [];
    }
    return obj;
  },
};

function createBaseSolutionCompatibility(): SolutionCompatibility {
  return { isMarketplaceCompatible: undefined, isConsoleCompatible: undefined };
}

export const SolutionCompatibility = {
  fromJSON(object: any): SolutionCompatibility {
    return {
      isMarketplaceCompatible: isSet(object.isMarketplaceCompatible)
        ? Boolean(object.isMarketplaceCompatible)
        : undefined,
      isConsoleCompatible: isSet(object.isConsoleCompatible)
        ? Boolean(object.isConsoleCompatible)
        : undefined,
    };
  },

  toJSON(message: SolutionCompatibility): unknown {
    const obj: any = {};
    message.isMarketplaceCompatible !== undefined &&
      (obj.isMarketplaceCompatible = message.isMarketplaceCompatible);
    message.isConsoleCompatible !== undefined &&
      (obj.isConsoleCompatible = message.isConsoleCompatible);
    return obj;
  },
};

function createBaseSolutionTerms(): SolutionTerms {
  return { isCopyrightFree: undefined };
}

export const SolutionTerms = {
  fromJSON(object: any): SolutionTerms {
    return {
      isCopyrightFree: isSet(object.isCopyrightFree)
        ? Boolean(object.isCopyrightFree)
        : undefined,
    };
  },

  toJSON(message: SolutionTerms): unknown {
    const obj: any = {};
    message.isCopyrightFree !== undefined &&
      (obj.isCopyrightFree = message.isCopyrightFree);
    return obj;
  },
};

function createBaseSolutionState(): SolutionState {
  return { createApp: '', subscribeApp: '', grantPerimssions: '' };
}

export const SolutionState = {
  fromJSON(object: any): SolutionState {
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

  toJSON(message: SolutionState): unknown {
    const obj: any = {};
    message.createApp !== undefined && (obj.createApp = message.createApp);
    message.subscribeApp !== undefined &&
      (obj.subscribeApp = message.subscribeApp);
    message.grantPerimssions !== undefined &&
      (obj.grantPerimssions = message.grantPerimssions);
    return obj;
  },
};

function createBaseSolutionConfiguration(): SolutionConfiguration {
  return { category: '', configurationFile: undefined };
}

export const SolutionConfiguration = {
  fromJSON(object: any): SolutionConfiguration {
    return {
      category: isSet(object.category) ? String(object.category) : '',
      configurationFile: isSet(object.configurationFile)
        ? FileMetadata.fromJSON(object.configurationFile)
        : undefined,
    };
  },

  toJSON(message: SolutionConfiguration): unknown {
    const obj: any = {};
    message.category !== undefined && (obj.category = message.category);
    message.configurationFile !== undefined &&
      (obj.configurationFile = message.configurationFile
        ? FileMetadata.toJSON(message.configurationFile)
        : undefined);
    return obj;
  },
};

function createBaseSolutionDocumentMetadata(): SolutionDocumentMetadata {
  return { category: '', file: undefined };
}

export const SolutionDocumentMetadata = {
  fromJSON(object: any): SolutionDocumentMetadata {
    return {
      category: isSet(object.category) ? String(object.category) : '',
      file: isSet(object.file) ? FileMetadata.fromJSON(object.file) : undefined,
    };
  },

  toJSON(message: SolutionDocumentMetadata): unknown {
    const obj: any = {};
    message.category !== undefined && (obj.category = message.category);
    message.file !== undefined &&
      (obj.file = message.file ? FileMetadata.toJSON(message.file) : undefined);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
