/* eslint-disable */
import {
  ApplicationType,
  ClientCredentials,
  applicationTypeFromJSON,
  applicationTypeToJSON,
} from '../../developerportal/application/application.pb';
import { HumanName } from '../user/user.pb';
import { PhoneNumber } from '../common/common.pb';

export const protobufPackage = 'os1.core.coreosagent';

export interface CoreosOrganizationTenantAttributes {
  organizationId: string;
  domain: string;
  dns: string;
  isCustomerTenant: boolean;
}

export interface CreateCoreosAppRequest {
  urlPath: string;
  appType: ApplicationType;
  clientCredentials: ClientCredentials | undefined;
  organization: CoreosOrganizationTenantAttributes | undefined;
}

export interface AddCoreosAppPermissionsRequest {
  appUrn: string;
  fileBinary: Uint8Array;
  organization: CoreosOrganizationTenantAttributes | undefined;
}

export interface GetPermissionsUploadStatusRequest {
  statusId: string;
  tenantId: string;
}

export interface AddTenantToRegistryRequest {
  tenant: AddTenantToRegistryRequest_TenantRegistrationAttributes | undefined;
}

export interface AddTenantToRegistryRequest_TenantRegistrationAttributes {
  tenantId: string;
  tenantDns: string;
  stackId: string;
}

export interface AllocateAnyAvailableTenantToOrganizationRequest {
  organizationId: string;
  adminUser:
    | AllocateAnyAvailableTenantToOrganizationRequest_OrganizationAdminUser
    | undefined;
}

export interface AllocateAnyAvailableTenantToOrganizationRequest_OrganizationAdminUser {
  name: HumanName | undefined;
  email: string;
  primaryMobile: PhoneNumber | undefined;
}

export interface AssignAppToTenantAdminRequest {
  appUrn: string;
  tenantId: string;
}

export interface GetTenantByIdRequest {
  tenantId: string;
}

export interface GetAppsForCoreosUserRequest {
  tenantId: string;
  coreosUserId: string;
}

export const OS1_CORE_COREOSAGENT_PACKAGE_NAME = 'os1.core.coreosagent';

function createBaseCoreosOrganizationTenantAttributes(): CoreosOrganizationTenantAttributes {
  return { organizationId: '', domain: '', dns: '', isCustomerTenant: false };
}

export const CoreosOrganizationTenantAttributes = {
  fromJSON(object: any): CoreosOrganizationTenantAttributes {
    return {
      organizationId: isSet(object.organizationId)
        ? String(object.organizationId)
        : '',
      domain: isSet(object.domain) ? String(object.domain) : '',
      dns: isSet(object.dns) ? String(object.dns) : '',
      isCustomerTenant: isSet(object.isCustomerTenant)
        ? Boolean(object.isCustomerTenant)
        : false,
    };
  },

  toJSON(message: CoreosOrganizationTenantAttributes): unknown {
    const obj: any = {};
    message.organizationId !== undefined &&
      (obj.organizationId = message.organizationId);
    message.domain !== undefined && (obj.domain = message.domain);
    message.dns !== undefined && (obj.dns = message.dns);
    message.isCustomerTenant !== undefined &&
      (obj.isCustomerTenant = message.isCustomerTenant);
    return obj;
  },
};

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
        ? CoreosOrganizationTenantAttributes.fromJSON(object.organization)
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
        ? CoreosOrganizationTenantAttributes.toJSON(message.organization)
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
        ? CoreosOrganizationTenantAttributes.fromJSON(object.organization)
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
        ? CoreosOrganizationTenantAttributes.toJSON(message.organization)
        : undefined);
    return obj;
  },
};

function createBaseGetPermissionsUploadStatusRequest(): GetPermissionsUploadStatusRequest {
  return { statusId: '', tenantId: '' };
}

export const GetPermissionsUploadStatusRequest = {
  fromJSON(object: any): GetPermissionsUploadStatusRequest {
    return {
      statusId: isSet(object.statusId) ? String(object.statusId) : '',
      tenantId: isSet(object.tenantId) ? String(object.tenantId) : '',
    };
  },

  toJSON(message: GetPermissionsUploadStatusRequest): unknown {
    const obj: any = {};
    message.statusId !== undefined && (obj.statusId = message.statusId);
    message.tenantId !== undefined && (obj.tenantId = message.tenantId);
    return obj;
  },
};

function createBaseAddTenantToRegistryRequest(): AddTenantToRegistryRequest {
  return { tenant: undefined };
}

export const AddTenantToRegistryRequest = {
  fromJSON(object: any): AddTenantToRegistryRequest {
    return {
      tenant: isSet(object.tenant)
        ? AddTenantToRegistryRequest_TenantRegistrationAttributes.fromJSON(
            object.tenant,
          )
        : undefined,
    };
  },

  toJSON(message: AddTenantToRegistryRequest): unknown {
    const obj: any = {};
    message.tenant !== undefined &&
      (obj.tenant = message.tenant
        ? AddTenantToRegistryRequest_TenantRegistrationAttributes.toJSON(
            message.tenant,
          )
        : undefined);
    return obj;
  },
};

function createBaseAddTenantToRegistryRequest_TenantRegistrationAttributes(): AddTenantToRegistryRequest_TenantRegistrationAttributes {
  return { tenantId: '', tenantDns: '', stackId: '' };
}

export const AddTenantToRegistryRequest_TenantRegistrationAttributes = {
  fromJSON(
    object: any,
  ): AddTenantToRegistryRequest_TenantRegistrationAttributes {
    return {
      tenantId: isSet(object.tenantId) ? String(object.tenantId) : '',
      tenantDns: isSet(object.tenantDns) ? String(object.tenantDns) : '',
      stackId: isSet(object.stackId) ? String(object.stackId) : '',
    };
  },

  toJSON(
    message: AddTenantToRegistryRequest_TenantRegistrationAttributes,
  ): unknown {
    const obj: any = {};
    message.tenantId !== undefined && (obj.tenantId = message.tenantId);
    message.tenantDns !== undefined && (obj.tenantDns = message.tenantDns);
    message.stackId !== undefined && (obj.stackId = message.stackId);
    return obj;
  },
};

function createBaseAllocateAnyAvailableTenantToOrganizationRequest(): AllocateAnyAvailableTenantToOrganizationRequest {
  return { organizationId: '', adminUser: undefined };
}

export const AllocateAnyAvailableTenantToOrganizationRequest = {
  fromJSON(object: any): AllocateAnyAvailableTenantToOrganizationRequest {
    return {
      organizationId: isSet(object.organizationId)
        ? String(object.organizationId)
        : '',
      adminUser: isSet(object.adminUser)
        ? AllocateAnyAvailableTenantToOrganizationRequest_OrganizationAdminUser.fromJSON(
            object.adminUser,
          )
        : undefined,
    };
  },

  toJSON(message: AllocateAnyAvailableTenantToOrganizationRequest): unknown {
    const obj: any = {};
    message.organizationId !== undefined &&
      (obj.organizationId = message.organizationId);
    message.adminUser !== undefined &&
      (obj.adminUser = message.adminUser
        ? AllocateAnyAvailableTenantToOrganizationRequest_OrganizationAdminUser.toJSON(
            message.adminUser,
          )
        : undefined);
    return obj;
  },
};

function createBaseAllocateAnyAvailableTenantToOrganizationRequest_OrganizationAdminUser(): AllocateAnyAvailableTenantToOrganizationRequest_OrganizationAdminUser {
  return { name: undefined, email: '', primaryMobile: undefined };
}

export const AllocateAnyAvailableTenantToOrganizationRequest_OrganizationAdminUser =
  {
    fromJSON(
      object: any,
    ): AllocateAnyAvailableTenantToOrganizationRequest_OrganizationAdminUser {
      return {
        name: isSet(object.name) ? HumanName.fromJSON(object.name) : undefined,
        email: isSet(object.email) ? String(object.email) : '',
        primaryMobile: isSet(object.primaryMobile)
          ? PhoneNumber.fromJSON(object.primaryMobile)
          : undefined,
      };
    },

    toJSON(
      message: AllocateAnyAvailableTenantToOrganizationRequest_OrganizationAdminUser,
    ): unknown {
      const obj: any = {};
      message.name !== undefined &&
        (obj.name = message.name ? HumanName.toJSON(message.name) : undefined);
      message.email !== undefined && (obj.email = message.email);
      message.primaryMobile !== undefined &&
        (obj.primaryMobile = message.primaryMobile
          ? PhoneNumber.toJSON(message.primaryMobile)
          : undefined);
      return obj;
    },
  };

function createBaseAssignAppToTenantAdminRequest(): AssignAppToTenantAdminRequest {
  return { appUrn: '', tenantId: '' };
}

export const AssignAppToTenantAdminRequest = {
  fromJSON(object: any): AssignAppToTenantAdminRequest {
    return {
      appUrn: isSet(object.appUrn) ? String(object.appUrn) : '',
      tenantId: isSet(object.tenantId) ? String(object.tenantId) : '',
    };
  },

  toJSON(message: AssignAppToTenantAdminRequest): unknown {
    const obj: any = {};
    message.appUrn !== undefined && (obj.appUrn = message.appUrn);
    message.tenantId !== undefined && (obj.tenantId = message.tenantId);
    return obj;
  },
};

function createBaseGetTenantByIdRequest(): GetTenantByIdRequest {
  return { tenantId: '' };
}

export const GetTenantByIdRequest = {
  fromJSON(object: any): GetTenantByIdRequest {
    return {
      tenantId: isSet(object.tenantId) ? String(object.tenantId) : '',
    };
  },

  toJSON(message: GetTenantByIdRequest): unknown {
    const obj: any = {};
    message.tenantId !== undefined && (obj.tenantId = message.tenantId);
    return obj;
  },
};

function createBaseGetAppsForCoreosUserRequest(): GetAppsForCoreosUserRequest {
  return { tenantId: '', coreosUserId: '' };
}

export const GetAppsForCoreosUserRequest = {
  fromJSON(object: any): GetAppsForCoreosUserRequest {
    return {
      tenantId: isSet(object.tenantId) ? String(object.tenantId) : '',
      coreosUserId: isSet(object.coreosUserId)
        ? String(object.coreosUserId)
        : '',
    };
  },

  toJSON(message: GetAppsForCoreosUserRequest): unknown {
    const obj: any = {};
    message.tenantId !== undefined && (obj.tenantId = message.tenantId);
    message.coreosUserId !== undefined &&
      (obj.coreosUserId = message.coreosUserId);
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
