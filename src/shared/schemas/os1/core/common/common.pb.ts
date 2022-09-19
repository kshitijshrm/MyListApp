/* eslint-disable */
export const protobufPackage = 'os1.core.common';

export interface RecordStatus {
  isActive: boolean;
  isDeleted: boolean;
}

export interface RecordAudit {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export const OS1_CORE_COMMON_PACKAGE_NAME = 'os1.core.common';

function createBaseRecordStatus(): RecordStatus {
  return { isActive: false, isDeleted: false };
}

export const RecordStatus = {
  fromJSON(object: any): RecordStatus {
    return {
      isActive: isSet(object.isActive) ? Boolean(object.isActive) : false,
      isDeleted: isSet(object.isDeleted) ? Boolean(object.isDeleted) : false,
    };
  },

  toJSON(message: RecordStatus): unknown {
    const obj: any = {};
    message.isActive !== undefined && (obj.isActive = message.isActive);
    message.isDeleted !== undefined && (obj.isDeleted = message.isDeleted);
    return obj;
  },
};

function createBaseRecordAudit(): RecordAudit {
  return { createdBy: '', createdAt: '', updatedBy: '', updatedAt: '' };
}

export const RecordAudit = {
  fromJSON(object: any): RecordAudit {
    return {
      createdBy: isSet(object.createdBy) ? String(object.createdBy) : '',
      createdAt: isSet(object.createdAt) ? String(object.createdAt) : '',
      updatedBy: isSet(object.updatedBy) ? String(object.updatedBy) : '',
      updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : '',
    };
  },

  toJSON(message: RecordAudit): unknown {
    const obj: any = {};
    message.createdBy !== undefined && (obj.createdBy = message.createdBy);
    message.createdAt !== undefined && (obj.createdAt = message.createdAt);
    message.updatedBy !== undefined && (obj.updatedBy = message.updatedBy);
    message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
