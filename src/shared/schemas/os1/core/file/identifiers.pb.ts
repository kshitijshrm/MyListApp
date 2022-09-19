/* eslint-disable */
export const protobufPackage = 'os1.core.file';

export interface FileIdentifier {
  fileId: string;
}

export const OS1_CORE_FILE_PACKAGE_NAME = 'os1.core.file';

function createBaseFileIdentifier(): FileIdentifier {
  return { fileId: '' };
}

export const FileIdentifier = {
  fromJSON(object: any): FileIdentifier {
    return {
      fileId: isSet(object.fileId) ? String(object.fileId) : '',
    };
  },

  toJSON(message: FileIdentifier): unknown {
    const obj: any = {};
    message.fileId !== undefined && (obj.fileId = message.fileId);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
