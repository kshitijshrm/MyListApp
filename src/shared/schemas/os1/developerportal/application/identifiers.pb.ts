/* eslint-disable */
export const protobufPackage = 'os1.developerportal.application';

export interface ApplicationIdentifier {
  appId: string;
}

export interface ApplicationVersionIdentifier {
  appId: string;
  appVersionId: string;
}

export const OS1_DEVELOPERPORTAL_APPLICATION_PACKAGE_NAME =
  'os1.developerportal.application';

function createBaseApplicationIdentifier(): ApplicationIdentifier {
  return { appId: '' };
}

export const ApplicationIdentifier = {
  fromJSON(object: any): ApplicationIdentifier {
    return {
      appId: isSet(object.appId) ? String(object.appId) : '',
    };
  },

  toJSON(message: ApplicationIdentifier): unknown {
    const obj: any = {};
    message.appId !== undefined && (obj.appId = message.appId);
    return obj;
  },
};

function createBaseApplicationVersionIdentifier(): ApplicationVersionIdentifier {
  return { appId: '', appVersionId: '' };
}

export const ApplicationVersionIdentifier = {
  fromJSON(object: any): ApplicationVersionIdentifier {
    return {
      appId: isSet(object.appId) ? String(object.appId) : '',
      appVersionId: isSet(object.appVersionId)
        ? String(object.appVersionId)
        : '',
    };
  },

  toJSON(message: ApplicationVersionIdentifier): unknown {
    const obj: any = {};
    message.appId !== undefined && (obj.appId = message.appId);
    message.appVersionId !== undefined &&
      (obj.appVersionId = message.appVersionId);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
