/* eslint-disable */
import { FileIdentifier } from './identifiers.pb';

export const protobufPackage = 'os1.core.file';

export interface CreateFileRequest {
  fileBinary: Uint8Array;
  fileName: string;
  fileContentType: string;
  fileDescription: string;
  isCdnRequired: boolean;
}

export interface GetFileRequest {
  id: FileIdentifier | undefined;
}

export const OS1_CORE_FILE_PACKAGE_NAME = 'os1.core.file';

function createBaseCreateFileRequest(): CreateFileRequest {
  return {
    fileBinary: new Uint8Array(),
    fileName: '',
    fileContentType: '',
    fileDescription: '',
    isCdnRequired: false,
  };
}

export const CreateFileRequest = {
  fromJSON(object: any): CreateFileRequest {
    return {
      fileBinary: isSet(object.fileBinary)
        ? bytesFromBase64(object.fileBinary)
        : new Uint8Array(),
      fileName: isSet(object.fileName) ? String(object.fileName) : '',
      fileContentType: isSet(object.fileContentType)
        ? String(object.fileContentType)
        : '',
      fileDescription: isSet(object.fileDescription)
        ? String(object.fileDescription)
        : '',
      isCdnRequired: isSet(object.isCdnRequired)
        ? Boolean(object.isCdnRequired)
        : false,
    };
  },

  toJSON(message: CreateFileRequest): unknown {
    const obj: any = {};
    message.fileBinary !== undefined &&
      (obj.fileBinary = base64FromBytes(
        message.fileBinary !== undefined
          ? message.fileBinary
          : new Uint8Array(),
      ));
    message.fileName !== undefined && (obj.fileName = message.fileName);
    message.fileContentType !== undefined &&
      (obj.fileContentType = message.fileContentType);
    message.fileDescription !== undefined &&
      (obj.fileDescription = message.fileDescription);
    message.isCdnRequired !== undefined &&
      (obj.isCdnRequired = message.isCdnRequired);
    return obj;
  },
};

function createBaseGetFileRequest(): GetFileRequest {
  return { id: undefined };
}

export const GetFileRequest = {
  fromJSON(object: any): GetFileRequest {
    return {
      id: isSet(object.id) ? FileIdentifier.fromJSON(object.id) : undefined,
    };
  },

  toJSON(message: GetFileRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id ? FileIdentifier.toJSON(message.id) : undefined);
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
