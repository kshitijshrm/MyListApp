/* eslint-disable */
import {
  OrganizationMetadata,
  OrganizationIdentifier,
} from '../../core/organization/identifiers.pb';
import {
  SolutionClassification,
  SolutionDocumentMetadata,
  SolutionDisplayAttributes,
  SolutionTerms,
} from './solution.pb';
import {
  SolutionIdentifier,
  SolutionVersionIdentifier,
} from './identifiers.pb';
import { FileMetadata } from '../../core/file/file.pb';
import { ApplicationVersionIdentifier } from '../application/identifiers.pb';

export const protobufPackage = 'os1.developerportal.solution';

export interface RegisterSolutionRequest {
  organization: OrganizationMetadata | undefined;
  attributes:
    | RegisterSolutionRequest_SolutionRegistrationAttributes
    | undefined;
}

export interface RegisterSolutionRequest_SolutionRegistrationAttributes {
  displayName: string;
  version: string;
  shortDescription: string;
  classification: SolutionClassification | undefined;
}

export interface AddSolutionVersionRequest {
  id: SolutionIdentifier | undefined;
  version: string;
}

export interface UpsertSolutionIconRequest {
  id: SolutionVersionIdentifier | undefined;
  icon: FileMetadata | undefined;
}

export interface AddSolutionImageRequest {
  id: SolutionVersionIdentifier | undefined;
  image: FileMetadata | undefined;
}

export interface RemoveSolutionImageRequest {
  id: SolutionVersionIdentifier | undefined;
  fileId: string;
}

export interface AddSolutionDocumentRequest {
  id: SolutionVersionIdentifier | undefined;
  document: SolutionDocumentMetadata | undefined;
}

export interface RemoveSolutionDocumentRequest {
  id: SolutionVersionIdentifier | undefined;
  fileId: string;
}

export interface AddSolutionConfigurationFileRequest {
  id: SolutionVersionIdentifier | undefined;
  configurationFile: FileMetadata | undefined;
}

export interface AddApplicationToSolutionRequest {
  id: SolutionVersionIdentifier | undefined;
  app: AddApplicationToSolutionRequest_ApplicationMetadata | undefined;
}

export interface AddApplicationToSolutionRequest_ApplicationMetadata {
  id: ApplicationVersionIdentifier | undefined;
}

export interface RemoveApplicationFromSolutionRequest {
  id: SolutionVersionIdentifier | undefined;
  app: RemoveApplicationFromSolutionRequest_ApplicationMetadata | undefined;
}

export interface RemoveApplicationFromSolutionRequest_ApplicationMetadata {
  id: ApplicationVersionIdentifier | undefined;
}

export interface ChangeSolutionDisplayAttributesRequest {
  id: SolutionVersionIdentifier | undefined;
  attributes: SolutionDisplayAttributes | undefined;
}

export interface ChangeSolutionTermsRequest {
  id: SolutionVersionIdentifier | undefined;
  terms: SolutionTerms | undefined;
}

export interface ClassifySolutionRequest {
  id: SolutionVersionIdentifier | undefined;
  classification: SolutionClassification | undefined;
}

export interface SolutionLifeCycleTransitionRequest {
  id: SolutionVersionIdentifier | undefined;
}

export interface GetSolutionBySolutionIdRequest {
  id: SolutionIdentifier | undefined;
}

export interface GetSolutionByVersionIdRequest {
  id: SolutionVersionIdentifier | undefined;
}

export interface ListSolutionsByOrgRequest {
  id: OrganizationIdentifier | undefined;
}

export const OS1_DEVELOPERPORTAL_SOLUTION_PACKAGE_NAME =
  'os1.developerportal.solution';

function createBaseRegisterSolutionRequest(): RegisterSolutionRequest {
  return { organization: undefined, attributes: undefined };
}

export const RegisterSolutionRequest = {
  fromJSON(object: any): RegisterSolutionRequest {
    return {
      organization: isSet(object.organization)
        ? OrganizationMetadata.fromJSON(object.organization)
        : undefined,
      attributes: isSet(object.attributes)
        ? RegisterSolutionRequest_SolutionRegistrationAttributes.fromJSON(
            object.attributes,
          )
        : undefined,
    };
  },

  toJSON(message: RegisterSolutionRequest): unknown {
    const obj: any = {};
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? OrganizationMetadata.toJSON(message.organization)
        : undefined);
    message.attributes !== undefined &&
      (obj.attributes = message.attributes
        ? RegisterSolutionRequest_SolutionRegistrationAttributes.toJSON(
            message.attributes,
          )
        : undefined);
    return obj;
  },
};

function createBaseRegisterSolutionRequest_SolutionRegistrationAttributes(): RegisterSolutionRequest_SolutionRegistrationAttributes {
  return {
    displayName: '',
    version: '',
    shortDescription: '',
    classification: undefined,
  };
}

export const RegisterSolutionRequest_SolutionRegistrationAttributes = {
  fromJSON(
    object: any,
  ): RegisterSolutionRequest_SolutionRegistrationAttributes {
    return {
      displayName: isSet(object.displayName) ? String(object.displayName) : '',
      version: isSet(object.version) ? String(object.version) : '',
      shortDescription: isSet(object.shortDescription)
        ? String(object.shortDescription)
        : '',
      classification: isSet(object.classification)
        ? SolutionClassification.fromJSON(object.classification)
        : undefined,
    };
  },

  toJSON(
    message: RegisterSolutionRequest_SolutionRegistrationAttributes,
  ): unknown {
    const obj: any = {};
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.version !== undefined && (obj.version = message.version);
    message.shortDescription !== undefined &&
      (obj.shortDescription = message.shortDescription);
    message.classification !== undefined &&
      (obj.classification = message.classification
        ? SolutionClassification.toJSON(message.classification)
        : undefined);
    return obj;
  },
};

function createBaseAddSolutionVersionRequest(): AddSolutionVersionRequest {
  return { id: undefined, version: '' };
}

export const AddSolutionVersionRequest = {
  fromJSON(object: any): AddSolutionVersionRequest {
    return {
      id: isSet(object.id) ? SolutionIdentifier.fromJSON(object.id) : undefined,
      version: isSet(object.version) ? String(object.version) : '',
    };
  },

  toJSON(message: AddSolutionVersionRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id ? SolutionIdentifier.toJSON(message.id) : undefined);
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },
};

function createBaseUpsertSolutionIconRequest(): UpsertSolutionIconRequest {
  return { id: undefined, icon: undefined };
}

export const UpsertSolutionIconRequest = {
  fromJSON(object: any): UpsertSolutionIconRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
      icon: isSet(object.icon) ? FileMetadata.fromJSON(object.icon) : undefined,
    };
  },

  toJSON(message: UpsertSolutionIconRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    message.icon !== undefined &&
      (obj.icon = message.icon ? FileMetadata.toJSON(message.icon) : undefined);
    return obj;
  },
};

function createBaseAddSolutionImageRequest(): AddSolutionImageRequest {
  return { id: undefined, image: undefined };
}

export const AddSolutionImageRequest = {
  fromJSON(object: any): AddSolutionImageRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
      image: isSet(object.image)
        ? FileMetadata.fromJSON(object.image)
        : undefined,
    };
  },

  toJSON(message: AddSolutionImageRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    message.image !== undefined &&
      (obj.image = message.image
        ? FileMetadata.toJSON(message.image)
        : undefined);
    return obj;
  },
};

function createBaseRemoveSolutionImageRequest(): RemoveSolutionImageRequest {
  return { id: undefined, fileId: '' };
}

export const RemoveSolutionImageRequest = {
  fromJSON(object: any): RemoveSolutionImageRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
      fileId: isSet(object.fileId) ? String(object.fileId) : '',
    };
  },

  toJSON(message: RemoveSolutionImageRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    message.fileId !== undefined && (obj.fileId = message.fileId);
    return obj;
  },
};

function createBaseAddSolutionDocumentRequest(): AddSolutionDocumentRequest {
  return { id: undefined, document: undefined };
}

export const AddSolutionDocumentRequest = {
  fromJSON(object: any): AddSolutionDocumentRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
      document: isSet(object.document)
        ? SolutionDocumentMetadata.fromJSON(object.document)
        : undefined,
    };
  },

  toJSON(message: AddSolutionDocumentRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    message.document !== undefined &&
      (obj.document = message.document
        ? SolutionDocumentMetadata.toJSON(message.document)
        : undefined);
    return obj;
  },
};

function createBaseRemoveSolutionDocumentRequest(): RemoveSolutionDocumentRequest {
  return { id: undefined, fileId: '' };
}

export const RemoveSolutionDocumentRequest = {
  fromJSON(object: any): RemoveSolutionDocumentRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
      fileId: isSet(object.fileId) ? String(object.fileId) : '',
    };
  },

  toJSON(message: RemoveSolutionDocumentRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    message.fileId !== undefined && (obj.fileId = message.fileId);
    return obj;
  },
};

function createBaseAddSolutionConfigurationFileRequest(): AddSolutionConfigurationFileRequest {
  return { id: undefined, configurationFile: undefined };
}

export const AddSolutionConfigurationFileRequest = {
  fromJSON(object: any): AddSolutionConfigurationFileRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
      configurationFile: isSet(object.configurationFile)
        ? FileMetadata.fromJSON(object.configurationFile)
        : undefined,
    };
  },

  toJSON(message: AddSolutionConfigurationFileRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    message.configurationFile !== undefined &&
      (obj.configurationFile = message.configurationFile
        ? FileMetadata.toJSON(message.configurationFile)
        : undefined);
    return obj;
  },
};

function createBaseAddApplicationToSolutionRequest(): AddApplicationToSolutionRequest {
  return { id: undefined, app: undefined };
}

export const AddApplicationToSolutionRequest = {
  fromJSON(object: any): AddApplicationToSolutionRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
      app: isSet(object.app)
        ? AddApplicationToSolutionRequest_ApplicationMetadata.fromJSON(
            object.app,
          )
        : undefined,
    };
  },

  toJSON(message: AddApplicationToSolutionRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    message.app !== undefined &&
      (obj.app = message.app
        ? AddApplicationToSolutionRequest_ApplicationMetadata.toJSON(
            message.app,
          )
        : undefined);
    return obj;
  },
};

function createBaseAddApplicationToSolutionRequest_ApplicationMetadata(): AddApplicationToSolutionRequest_ApplicationMetadata {
  return { id: undefined };
}

export const AddApplicationToSolutionRequest_ApplicationMetadata = {
  fromJSON(object: any): AddApplicationToSolutionRequest_ApplicationMetadata {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(
    message: AddApplicationToSolutionRequest_ApplicationMetadata,
  ): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseRemoveApplicationFromSolutionRequest(): RemoveApplicationFromSolutionRequest {
  return { id: undefined, app: undefined };
}

export const RemoveApplicationFromSolutionRequest = {
  fromJSON(object: any): RemoveApplicationFromSolutionRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
      app: isSet(object.app)
        ? RemoveApplicationFromSolutionRequest_ApplicationMetadata.fromJSON(
            object.app,
          )
        : undefined,
    };
  },

  toJSON(message: RemoveApplicationFromSolutionRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    message.app !== undefined &&
      (obj.app = message.app
        ? RemoveApplicationFromSolutionRequest_ApplicationMetadata.toJSON(
            message.app,
          )
        : undefined);
    return obj;
  },
};

function createBaseRemoveApplicationFromSolutionRequest_ApplicationMetadata(): RemoveApplicationFromSolutionRequest_ApplicationMetadata {
  return { id: undefined };
}

export const RemoveApplicationFromSolutionRequest_ApplicationMetadata = {
  fromJSON(
    object: any,
  ): RemoveApplicationFromSolutionRequest_ApplicationMetadata {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(
    message: RemoveApplicationFromSolutionRequest_ApplicationMetadata,
  ): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseChangeSolutionDisplayAttributesRequest(): ChangeSolutionDisplayAttributesRequest {
  return { id: undefined, attributes: undefined };
}

export const ChangeSolutionDisplayAttributesRequest = {
  fromJSON(object: any): ChangeSolutionDisplayAttributesRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
      attributes: isSet(object.attributes)
        ? SolutionDisplayAttributes.fromJSON(object.attributes)
        : undefined,
    };
  },

  toJSON(message: ChangeSolutionDisplayAttributesRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    message.attributes !== undefined &&
      (obj.attributes = message.attributes
        ? SolutionDisplayAttributes.toJSON(message.attributes)
        : undefined);
    return obj;
  },
};

function createBaseChangeSolutionTermsRequest(): ChangeSolutionTermsRequest {
  return { id: undefined, terms: undefined };
}

export const ChangeSolutionTermsRequest = {
  fromJSON(object: any): ChangeSolutionTermsRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
      terms: isSet(object.terms)
        ? SolutionTerms.fromJSON(object.terms)
        : undefined,
    };
  },

  toJSON(message: ChangeSolutionTermsRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    message.terms !== undefined &&
      (obj.terms = message.terms
        ? SolutionTerms.toJSON(message.terms)
        : undefined);
    return obj;
  },
};

function createBaseClassifySolutionRequest(): ClassifySolutionRequest {
  return { id: undefined, classification: undefined };
}

export const ClassifySolutionRequest = {
  fromJSON(object: any): ClassifySolutionRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
      classification: isSet(object.classification)
        ? SolutionClassification.fromJSON(object.classification)
        : undefined,
    };
  },

  toJSON(message: ClassifySolutionRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    message.classification !== undefined &&
      (obj.classification = message.classification
        ? SolutionClassification.toJSON(message.classification)
        : undefined);
    return obj;
  },
};

function createBaseSolutionLifeCycleTransitionRequest(): SolutionLifeCycleTransitionRequest {
  return { id: undefined };
}

export const SolutionLifeCycleTransitionRequest = {
  fromJSON(object: any): SolutionLifeCycleTransitionRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: SolutionLifeCycleTransitionRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseGetSolutionBySolutionIdRequest(): GetSolutionBySolutionIdRequest {
  return { id: undefined };
}

export const GetSolutionBySolutionIdRequest = {
  fromJSON(object: any): GetSolutionBySolutionIdRequest {
    return {
      id: isSet(object.id) ? SolutionIdentifier.fromJSON(object.id) : undefined,
    };
  },

  toJSON(message: GetSolutionBySolutionIdRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id ? SolutionIdentifier.toJSON(message.id) : undefined);
    return obj;
  },
};

function createBaseGetSolutionByVersionIdRequest(): GetSolutionByVersionIdRequest {
  return { id: undefined };
}

export const GetSolutionByVersionIdRequest = {
  fromJSON(object: any): GetSolutionByVersionIdRequest {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: GetSolutionByVersionIdRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseListSolutionsByOrgRequest(): ListSolutionsByOrgRequest {
  return { id: undefined };
}

export const ListSolutionsByOrgRequest = {
  fromJSON(object: any): ListSolutionsByOrgRequest {
    return {
      id: isSet(object.id)
        ? OrganizationIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: ListSolutionsByOrgRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? OrganizationIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
