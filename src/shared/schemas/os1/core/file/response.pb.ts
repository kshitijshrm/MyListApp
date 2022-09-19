/* eslint-disable */
import { FileMetadata, File } from './file.pb';

export const protobufPackage = 'os1.core.file';

export interface CreateFileResponse {
  fileMetadata: FileMetadata | undefined;
}

export interface GetFileResponse {
  file: File | undefined;
}

export const OS1_CORE_FILE_PACKAGE_NAME = 'os1.core.file';

function createBaseCreateFileResponse(): CreateFileResponse {
  return { fileMetadata: undefined };
}

export const CreateFileResponse = {
  fromJSON(object: any): CreateFileResponse {
    return {
      fileMetadata: isSet(object.fileMetadata)
        ? FileMetadata.fromJSON(object.fileMetadata)
        : undefined,
    };
  },

  toJSON(message: CreateFileResponse): unknown {
    const obj: any = {};
    message.fileMetadata !== undefined &&
      (obj.fileMetadata = message.fileMetadata
        ? FileMetadata.toJSON(message.fileMetadata)
        : undefined);
    return obj;
  },
};

function createBaseGetFileResponse(): GetFileResponse {
  return { file: undefined };
}

export const GetFileResponse = {
  fromJSON(object: any): GetFileResponse {
    return {
      file: isSet(object.file) ? File.fromJSON(object.file) : undefined,
    };
  },

  toJSON(message: GetFileResponse): unknown {
    const obj: any = {};
    message.file !== undefined &&
      (obj.file = message.file ? File.toJSON(message.file) : undefined);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
