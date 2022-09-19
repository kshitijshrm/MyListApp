/* eslint-disable */
import { ApplicationVersionIdentifier } from './identifiers.pb';
import { Application } from './application.pb';

export const protobufPackage = 'os1.developerportal.application';

export interface RegisterApplicationResponse {
  id: ApplicationVersionIdentifier | undefined;
}

export interface AddApplicationVersionResponse {
  id: ApplicationVersionIdentifier | undefined;
}

export interface GetApplicationByVersionIdResponse {
  application: Application | undefined;
}

export interface GetApplicationByApplicationIdResponse {
  application: Application | undefined;
}

export interface ListApplicationsByOrgTeamResponse {
  applications: Application[];
}

export interface GetApplicationByUrlPathResponse {
  application: Application | undefined;
}

export const OS1_DEVELOPERPORTAL_APPLICATION_PACKAGE_NAME =
  'os1.developerportal.application';

function createBaseRegisterApplicationResponse(): RegisterApplicationResponse {
  return { id: undefined };
}

export const RegisterApplicationResponse = {
  fromJSON(object: any): RegisterApplicationResponse {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: RegisterApplicationResponse): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseAddApplicationVersionResponse(): AddApplicationVersionResponse {
  return { id: undefined };
}

export const AddApplicationVersionResponse = {
  fromJSON(object: any): AddApplicationVersionResponse {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: AddApplicationVersionResponse): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseGetApplicationByVersionIdResponse(): GetApplicationByVersionIdResponse {
  return { application: undefined };
}

export const GetApplicationByVersionIdResponse = {
  fromJSON(object: any): GetApplicationByVersionIdResponse {
    return {
      application: isSet(object.application)
        ? Application.fromJSON(object.application)
        : undefined,
    };
  },

  toJSON(message: GetApplicationByVersionIdResponse): unknown {
    const obj: any = {};
    message.application !== undefined &&
      (obj.application = message.application
        ? Application.toJSON(message.application)
        : undefined);
    return obj;
  },
};

function createBaseGetApplicationByApplicationIdResponse(): GetApplicationByApplicationIdResponse {
  return { application: undefined };
}

export const GetApplicationByApplicationIdResponse = {
  fromJSON(object: any): GetApplicationByApplicationIdResponse {
    return {
      application: isSet(object.application)
        ? Application.fromJSON(object.application)
        : undefined,
    };
  },

  toJSON(message: GetApplicationByApplicationIdResponse): unknown {
    const obj: any = {};
    message.application !== undefined &&
      (obj.application = message.application
        ? Application.toJSON(message.application)
        : undefined);
    return obj;
  },
};

function createBaseListApplicationsByOrgTeamResponse(): ListApplicationsByOrgTeamResponse {
  return { applications: [] };
}

export const ListApplicationsByOrgTeamResponse = {
  fromJSON(object: any): ListApplicationsByOrgTeamResponse {
    return {
      applications: Array.isArray(object?.applications)
        ? object.applications.map((e: any) => Application.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ListApplicationsByOrgTeamResponse): unknown {
    const obj: any = {};
    if (message.applications) {
      obj.applications = message.applications.map((e) =>
        e ? Application.toJSON(e) : undefined,
      );
    } else {
      obj.applications = [];
    }
    return obj;
  },
};

function createBaseGetApplicationByUrlPathResponse(): GetApplicationByUrlPathResponse {
  return { application: undefined };
}

export const GetApplicationByUrlPathResponse = {
  fromJSON(object: any): GetApplicationByUrlPathResponse {
    return {
      application: isSet(object.application)
        ? Application.fromJSON(object.application)
        : undefined,
    };
  },

  toJSON(message: GetApplicationByUrlPathResponse): unknown {
    const obj: any = {};
    message.application !== undefined &&
      (obj.application = message.application
        ? Application.toJSON(message.application)
        : undefined);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
