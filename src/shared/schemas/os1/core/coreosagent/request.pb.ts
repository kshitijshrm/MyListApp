/* eslint-disable */
import {
  ApplicationType,
  ClientCredentials,
  applicationTypeFromJSON,
  applicationTypeToJSON,
} from '../../developerportal/application/application.pb';
import { OrganizationMetadata } from '../organization/identifiers.pb';

export const protobufPackage = 'os1.core.coreosagent';

export interface CreateCoreosAppRequest {
  urlPath: string;
  appType: ApplicationType;
  clientCredentials: ClientCredentials | undefined;
  organization: OrganizationMetadata | undefined;
}

export interface AddCoreosAppPermissionsRequest {
  appUrn: string;
  fileBinary: Uint8Array;
  organization: OrganizationMetadata | undefined;
}

export const OS1_CORE_COREOSAGENT_PACKAGE_NAME = 'os1.core.coreosagent';

function createBaseCreateCoreosAppRequest(): CreateCoreosAppRequest {
  return {
    urlPath: '',
    appType: 0,
    clientCredentials: undefined,
    organization: undefined,
  };
}

export const CreateCoreosAppRequest = {
  fromJSON(object: any): CreateCoreosAppRequest {
    return {
      urlPath: isSet(object.urlPath) ? String(object.urlPath) : '',
      appType: isSet(object.appType)
        ? applicationTypeFromJSON(object.appType)
        : 0,
      clientCredentials: isSet(object.clientCredentials)
        ? ClientCredentials.fromJSON(object.clientCredentials)
        : undefined,
      organization: isSet(object.organization)
        ? OrganizationMetadata.fromJSON(object.organization)
        : undefined,
    };
  },

  toJSON(message: CreateCoreosAppRequest): unknown {
    const obj: any = {};
    message.urlPath !== undefined && (obj.urlPath = message.urlPath);
    message.appType !== undefined &&
      (obj.appType = applicationTypeToJSON(message.appType));
    message.clientCredentials !== undefined &&
      (obj.clientCredentials = message.clientCredentials
        ? ClientCredentials.toJSON(message.clientCredentials)
        : undefined);
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? OrganizationMetadata.toJSON(message.organization)
        : undefined);
    return obj;
  },
};

function createBaseAddCoreosAppPermissionsRequest(): AddCoreosAppPermissionsRequest {
  return { appUrn: '', fileBinary: new Uint8Array(), organization: undefined };
}

export const AddCoreosAppPermissionsRequest = {
  fromJSON(object: any): AddCoreosAppPermissionsRequest {
    return {
      appUrn: isSet(object.appUrn) ? String(object.appUrn) : '',
      fileBinary: isSet(object.fileBinary)
        ? bytesFromBase64(object.fileBinary)
        : new Uint8Array(),
      organization: isSet(object.organization)
        ? OrganizationMetadata.fromJSON(object.organization)
        : undefined,
    };
  },

  toJSON(message: AddCoreosAppPermissionsRequest): unknown {
    const obj: any = {};
    message.appUrn !== undefined && (obj.appUrn = message.appUrn);
    message.fileBinary !== undefined &&
      (obj.fileBinary = base64FromBytes(
        message.fileBinary !== undefined
          ? message.fileBinary
          : new Uint8Array(),
      ));
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? OrganizationMetadata.toJSON(message.organization)
        : undefined);
    return obj;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  throw 'Unable to locate global object';
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, 'base64').toString('binary'));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, 'binary').toString('base64'));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  arr.forEach((byte) => {
    bin.push(String.fromCharCode(byte));
  });
  return btoa(bin.join(''));
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
