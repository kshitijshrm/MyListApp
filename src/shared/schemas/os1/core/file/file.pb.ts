/* eslint-disable */
import { FileIdentifier } from './identifiers.pb';

export const protobufPackage = 'os1.core.file';

export interface File {
  id: FileIdentifier | undefined;
  attributes: FileAttributes | undefined;
  fileBinary: Uint8Array;
}

export interface FileMetadata {
  id: FileIdentifier | undefined;
  attributes: FileAttributes | undefined;
}

export interface FileAttributes {
  fileName: string;
  fileDescription: string;
  /** file_url is a optional string. return url only if file is hosted on a cdn. */
  fileUrl?: string | undefined;
}

export const OS1_CORE_FILE_PACKAGE_NAME = 'os1.core.file';

function createBaseFile(): File {
  return { id: undefined, attributes: undefined, fileBinary: new Uint8Array() };
}

export const File = {
  fromJSON(object: any): File {
    return {
      id: isSet(object.id) ? FileIdentifier.fromJSON(object.id) : undefined,
      attributes: isSet(object.attributes)
        ? FileAttributes.fromJSON(object.attributes)
        : undefined,
      fileBinary: isSet(object.fileBinary)
        ? bytesFromBase64(object.fileBinary)
        : new Uint8Array(),
    };
  },

  toJSON(message: File): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id ? FileIdentifier.toJSON(message.id) : undefined);
    message.attributes !== undefined &&
      (obj.attributes = message.attributes
        ? FileAttributes.toJSON(message.attributes)
        : undefined);
    message.fileBinary !== undefined &&
      (obj.fileBinary = base64FromBytes(
        message.fileBinary !== undefined
          ? message.fileBinary
          : new Uint8Array(),
      ));
    return obj;
  },
};

function createBaseFileMetadata(): FileMetadata {
  return { id: undefined, attributes: undefined };
}

export const FileMetadata = {
  fromJSON(object: any): FileMetadata {
    return {
      id: isSet(object.id) ? FileIdentifier.fromJSON(object.id) : undefined,
      attributes: isSet(object.attributes)
        ? FileAttributes.fromJSON(object.attributes)
        : undefined,
    };
  },

  toJSON(message: FileMetadata): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id ? FileIdentifier.toJSON(message.id) : undefined);
    message.attributes !== undefined &&
      (obj.attributes = message.attributes
        ? FileAttributes.toJSON(message.attributes)
        : undefined);
    return obj;
  },
};

function createBaseFileAttributes(): FileAttributes {
  return { fileName: '', fileDescription: '', fileUrl: undefined };
}

export const FileAttributes = {
  fromJSON(object: any): FileAttributes {
    return {
      fileName: isSet(object.fileName) ? String(object.fileName) : '',
      fileDescription: isSet(object.fileDescription)
        ? String(object.fileDescription)
        : '',
      fileUrl: isSet(object.fileUrl) ? String(object.fileUrl) : undefined,
    };
  },

  toJSON(message: FileAttributes): unknown {
    const obj: any = {};
    message.fileName !== undefined && (obj.fileName = message.fileName);
    message.fileDescription !== undefined &&
      (obj.fileDescription = message.fileDescription);
    message.fileUrl !== undefined && (obj.fileUrl = message.fileUrl);
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
