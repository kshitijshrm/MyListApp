/* eslint-disable */
import {
  ApplicationType,
  ApplicationClassification,
  ApplicationCompitablity,
  ApplicationUrl,
  EncryptedAppSecret,
  applicationTypeFromJSON,
  applicationTypeToJSON,
  applicationClassificationFromJSON,
  applicationClassificationToJSON,
} from './application.pb';
import {
  OrganizationTeamMetadata,
  OrganizationTeamIdentifier,
} from '../../core/organization/identifiers.pb';
import {
  ApplicationIdentifier,
  ApplicationVersionIdentifier,
} from './identifiers.pb';
import { FileMetadata } from '../../core/file/file.pb';

export const protobufPackage = 'os1.developerportal.application';

export interface RegisterApplicationRequest {
  organizationTeam: OrganizationTeamMetadata | undefined;
  attributes:
    | RegisterApplicationRequest_ApplicationRegistrationAttributes
    | undefined;
}

export interface RegisterApplicationRequest_ApplicationRegistrationAttributes {
  name: string;
  urlPath: string;
  displayName: string;
  version: string;
  description: string;
  type: ApplicationType;
  compitablity: ApplicationCompitablity | undefined;
  appUrls: ApplicationUrl[];
  appSecret?: EncryptedAppSecret | undefined;
  shortDescription: string;
  longDescription: string;
}

export interface AddApplicationVersionRequest {
  id: ApplicationIdentifier | undefined;
  version: string;
}

export interface ApplicationLifeCycleTransitionRequest {
  id: ApplicationVersionIdentifier | undefined;
}

export interface GetApplicationByVersionIdRequest {
  id: ApplicationVersionIdentifier | undefined;
}

export interface UpsertApplicationIconRequest {
  id: ApplicationVersionIdentifier | undefined;
  appIcon: FileMetadata | undefined;
}

export interface AddApplicationDocumentRequest {
  id: ApplicationVersionIdentifier | undefined;
  appDocument: FileMetadata | undefined;
  category: string;
}

export interface DeleteApplicationDocumentRequest {
  id: ApplicationVersionIdentifier | undefined;
  fileId: string;
}

export interface ApplicationUrlOverridesRequest {
  id: ApplicationVersionIdentifier | undefined;
  stackId: string;
  overrideUrl: string;
}

export interface ClassifyApplicationRequest {
  id: ApplicationVersionIdentifier | undefined;
  appClassification: ApplicationClassification;
}

export interface GetApplicationByApplicationIdRequest {
  id: ApplicationIdentifier | undefined;
}

export interface ListApplicationsByOrgTeamRequest {
  id: OrganizationTeamIdentifier | undefined;
}

export interface GetApplicationByUrlPathRequest {
  urlPath: string;
}

export interface ChangeApplicationDisplayAttributesRequest {
  id: ApplicationVersionIdentifier | undefined;
  displayName: string;
  shortDescription: string;
  longDescription: string;
}

export const OS1_DEVELOPERPORTAL_APPLICATION_PACKAGE_NAME =
  'os1.developerportal.application';

function createBaseRegisterApplicationRequest(): RegisterApplicationRequest {
  return { organizationTeam: undefined, attributes: undefined };
}

export const RegisterApplicationRequest = {
  fromJSON(object: any): RegisterApplicationRequest {
    return {
      organizationTeam: isSet(object.organizationTeam)
        ? OrganizationTeamMetadata.fromJSON(object.organizationTeam)
        : undefined,
      attributes: isSet(object.attributes)
        ? RegisterApplicationRequest_ApplicationRegistrationAttributes.fromJSON(
            object.attributes,
          )
        : undefined,
    };
  },

  toJSON(message: RegisterApplicationRequest): unknown {
    const obj: any = {};
    message.organizationTeam !== undefined &&
      (obj.organizationTeam = message.organizationTeam
        ? OrganizationTeamMetadata.toJSON(message.organizationTeam)
        : undefined);
    message.attributes !== undefined &&
      (obj.attributes = message.attributes
        ? RegisterApplicationRequest_ApplicationRegistrationAttributes.toJSON(
            message.attributes,
          )
        : undefined);
    return obj;
  },
};

function createBaseRegisterApplicationRequest_ApplicationRegistrationAttributes(): RegisterApplicationRequest_ApplicationRegistrationAttributes {
  return {
    name: '',
    urlPath: '',
    displayName: '',
    version: '',
    description: '',
    type: 0,
    compitablity: undefined,
    appUrls: [],
    appSecret: undefined,
    shortDescription: '',
    longDescription: '',
  };
}

export const RegisterApplicationRequest_ApplicationRegistrationAttributes = {
  fromJSON(
    object: any,
  ): RegisterApplicationRequest_ApplicationRegistrationAttributes {
    return {
      name: isSet(object.name) ? String(object.name) : '',
      urlPath: isSet(object.urlPath) ? String(object.urlPath) : '',
      displayName: isSet(object.displayName) ? String(object.displayName) : '',
      version: isSet(object.version) ? String(object.version) : '',
      description: isSet(object.description) ? String(object.description) : '',
      type: isSet(object.type) ? applicationTypeFromJSON(object.type) : 0,
      compitablity: isSet(object.compitablity)
        ? ApplicationCompitablity.fromJSON(object.compitablity)
        : undefined,
      appUrls: Array.isArray(object?.appUrls)
        ? object.appUrls.map((e: any) => ApplicationUrl.fromJSON(e))
        : [],
      appSecret: isSet(object.appSecret)
        ? EncryptedAppSecret.fromJSON(object.appSecret)
        : undefined,
      shortDescription: isSet(object.shortDescription)
        ? String(object.shortDescription)
        : '',
      longDescription: isSet(object.longDescription)
        ? String(object.longDescription)
        : '',
    };
  },

  toJSON(
    message: RegisterApplicationRequest_ApplicationRegistrationAttributes,
  ): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.urlPath !== undefined && (obj.urlPath = message.urlPath);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.version !== undefined && (obj.version = message.version);
    message.description !== undefined &&
      (obj.description = message.description);
    message.type !== undefined &&
      (obj.type = applicationTypeToJSON(message.type));
    message.compitablity !== undefined &&
      (obj.compitablity = message.compitablity
        ? ApplicationCompitablity.toJSON(message.compitablity)
        : undefined);
    if (message.appUrls) {
      obj.appUrls = message.appUrls.map((e) =>
        e ? ApplicationUrl.toJSON(e) : undefined,
      );
    } else {
      obj.appUrls = [];
    }
    message.appSecret !== undefined &&
      (obj.appSecret = message.appSecret
        ? EncryptedAppSecret.toJSON(message.appSecret)
        : undefined);
    message.shortDescription !== undefined &&
      (obj.shortDescription = message.shortDescription);
    message.longDescription !== undefined &&
      (obj.longDescription = message.longDescription);
    return obj;
  },
};

function createBaseAddApplicationVersionRequest(): AddApplicationVersionRequest {
  return { id: undefined, version: '' };
}

export const AddApplicationVersionRequest = {
  fromJSON(object: any): AddApplicationVersionRequest {
    return {
      id: isSet(object.id)
        ? ApplicationIdentifier.fromJSON(object.id)
        : undefined,
      version: isSet(object.version) ? String(object.version) : '',
    };
  },

  toJSON(message: AddApplicationVersionRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationIdentifier.toJSON(message.id)
        : undefined);
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },
};

function createBaseApplicationLifeCycleTransitionRequest(): ApplicationLifeCycleTransitionRequest {
  return { id: undefined };
}

export const ApplicationLifeCycleTransitionRequest = {
  fromJSON(object: any): ApplicationLifeCycleTransitionRequest {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: ApplicationLifeCycleTransitionRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseGetApplicationByVersionIdRequest(): GetApplicationByVersionIdRequest {
  return { id: undefined };
}

export const GetApplicationByVersionIdRequest = {
  fromJSON(object: any): GetApplicationByVersionIdRequest {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: GetApplicationByVersionIdRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseUpsertApplicationIconRequest(): UpsertApplicationIconRequest {
  return { id: undefined, appIcon: undefined };
}

export const UpsertApplicationIconRequest = {
  fromJSON(object: any): UpsertApplicationIconRequest {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
      appIcon: isSet(object.appIcon)
        ? FileMetadata.fromJSON(object.appIcon)
        : undefined,
    };
  },

  toJSON(message: UpsertApplicationIconRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    message.appIcon !== undefined &&
      (obj.appIcon = message.appIcon
        ? FileMetadata.toJSON(message.appIcon)
        : undefined);
    return obj;
  },
};

function createBaseAddApplicationDocumentRequest(): AddApplicationDocumentRequest {
  return { id: undefined, appDocument: undefined, category: '' };
}

export const AddApplicationDocumentRequest = {
  fromJSON(object: any): AddApplicationDocumentRequest {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
      appDocument: isSet(object.appDocument)
        ? FileMetadata.fromJSON(object.appDocument)
        : undefined,
      category: isSet(object.category) ? String(object.category) : '',
    };
  },

  toJSON(message: AddApplicationDocumentRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    message.appDocument !== undefined &&
      (obj.appDocument = message.appDocument
        ? FileMetadata.toJSON(message.appDocument)
        : undefined);
    message.category !== undefined && (obj.category = message.category);
    return obj;
  },
};

function createBaseDeleteApplicationDocumentRequest(): DeleteApplicationDocumentRequest {
  return { id: undefined, fileId: '' };
}

export const DeleteApplicationDocumentRequest = {
  fromJSON(object: any): DeleteApplicationDocumentRequest {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
      fileId: isSet(object.fileId) ? String(object.fileId) : '',
    };
  },

  toJSON(message: DeleteApplicationDocumentRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    message.fileId !== undefined && (obj.fileId = message.fileId);
    return obj;
  },
};

function createBaseApplicationUrlOverridesRequest(): ApplicationUrlOverridesRequest {
  return { id: undefined, stackId: '', overrideUrl: '' };
}

export const ApplicationUrlOverridesRequest = {
  fromJSON(object: any): ApplicationUrlOverridesRequest {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
      stackId: isSet(object.stackId) ? String(object.stackId) : '',
      overrideUrl: isSet(object.overrideUrl) ? String(object.overrideUrl) : '',
    };
  },

  toJSON(message: ApplicationUrlOverridesRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    message.stackId !== undefined && (obj.stackId = message.stackId);
    message.overrideUrl !== undefined &&
      (obj.overrideUrl = message.overrideUrl);
    return obj;
  },
};

function createBaseClassifyApplicationRequest(): ClassifyApplicationRequest {
  return { id: undefined, appClassification: 0 };
}

export const ClassifyApplicationRequest = {
  fromJSON(object: any): ClassifyApplicationRequest {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
      appClassification: isSet(object.appClassification)
        ? applicationClassificationFromJSON(object.appClassification)
        : 0,
    };
  },

  toJSON(message: ClassifyApplicationRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    message.appClassification !== undefined &&
      (obj.appClassification = applicationClassificationToJSON(
        message.appClassification,
      ));
    return obj;
  },
};

function createBaseGetApplicationByApplicationIdRequest(): GetApplicationByApplicationIdRequest {
  return { id: undefined };
}

export const GetApplicationByApplicationIdRequest = {
  fromJSON(object: any): GetApplicationByApplicationIdRequest {
    return {
      id: isSet(object.id)
        ? ApplicationIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: GetApplicationByApplicationIdRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseListApplicationsByOrgTeamRequest(): ListApplicationsByOrgTeamRequest {
  return { id: undefined };
}

export const ListApplicationsByOrgTeamRequest = {
  fromJSON(object: any): ListApplicationsByOrgTeamRequest {
    return {
      id: isSet(object.id)
        ? OrganizationTeamIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: ListApplicationsByOrgTeamRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? OrganizationTeamIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseGetApplicationByUrlPathRequest(): GetApplicationByUrlPathRequest {
  return { urlPath: '' };
}

export const GetApplicationByUrlPathRequest = {
  fromJSON(object: any): GetApplicationByUrlPathRequest {
    return {
      urlPath: isSet(object.urlPath) ? String(object.urlPath) : '',
    };
  },

  toJSON(message: GetApplicationByUrlPathRequest): unknown {
    const obj: any = {};
    message.urlPath !== undefined && (obj.urlPath = message.urlPath);
    return obj;
  },
};

function createBaseChangeApplicationDisplayAttributesRequest(): ChangeApplicationDisplayAttributesRequest {
  return {
    id: undefined,
    displayName: '',
    shortDescription: '',
    longDescription: '',
  };
}

export const ChangeApplicationDisplayAttributesRequest = {
  fromJSON(object: any): ChangeApplicationDisplayAttributesRequest {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
      displayName: isSet(object.displayName) ? String(object.displayName) : '',
      shortDescription: isSet(object.shortDescription)
        ? String(object.shortDescription)
        : '',
      longDescription: isSet(object.longDescription)
        ? String(object.longDescription)
        : '',
    };
  },

  toJSON(message: ChangeApplicationDisplayAttributesRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.shortDescription !== undefined &&
      (obj.shortDescription = message.shortDescription);
    message.longDescription !== undefined &&
      (obj.longDescription = message.longDescription);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
