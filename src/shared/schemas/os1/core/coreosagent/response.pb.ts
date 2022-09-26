/* eslint-disable */
import { Tenant } from './tenant.pb';

export const protobufPackage = 'os1.core.coreosagent';

export interface AllocateAnyAvailableTenantToOrganizationResponse {
  tenant: Tenant | undefined;
}

export interface GetTenantByIdResponse {
  tenant: Tenant | undefined;
}

export interface ListAllTenantsResponse {
  tenants: Tenant[];
}

export interface AddCoreosAppPermissionsResponse {
  statusId: string;
}

export interface PermissionFileStatusResponse {
  statusId: string;
  tenantId: string;
  status: string;
  reason: string[];
}

export interface GetAppsForCoreosUserResponse {
  coreosUserId: string;
  apps: string[];
}

export const OS1_CORE_COREOSAGENT_PACKAGE_NAME = 'os1.core.coreosagent';

function createBaseAllocateAnyAvailableTenantToOrganizationResponse(): AllocateAnyAvailableTenantToOrganizationResponse {
  return { tenant: undefined };
}

export const AllocateAnyAvailableTenantToOrganizationResponse = {
  fromJSON(object: any): AllocateAnyAvailableTenantToOrganizationResponse {
    return {
      tenant: isSet(object.tenant) ? Tenant.fromJSON(object.tenant) : undefined,
    };
  },

  toJSON(message: AllocateAnyAvailableTenantToOrganizationResponse): unknown {
    const obj: any = {};
    message.tenant !== undefined &&
      (obj.tenant = message.tenant ? Tenant.toJSON(message.tenant) : undefined);
    return obj;
  },
};

function createBaseGetTenantByIdResponse(): GetTenantByIdResponse {
  return { tenant: undefined };
}

export const GetTenantByIdResponse = {
  fromJSON(object: any): GetTenantByIdResponse {
    return {
      tenant: isSet(object.tenant) ? Tenant.fromJSON(object.tenant) : undefined,
    };
  },

  toJSON(message: GetTenantByIdResponse): unknown {
    const obj: any = {};
    message.tenant !== undefined &&
      (obj.tenant = message.tenant ? Tenant.toJSON(message.tenant) : undefined);
    return obj;
  },
};

function createBaseListAllTenantsResponse(): ListAllTenantsResponse {
  return { tenants: [] };
}

export const ListAllTenantsResponse = {
  fromJSON(object: any): ListAllTenantsResponse {
    return {
      tenants: Array.isArray(object?.tenants)
        ? object.tenants.map((e: any) => Tenant.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ListAllTenantsResponse): unknown {
    const obj: any = {};
    if (message.tenants) {
      obj.tenants = message.tenants.map((e) =>
        e ? Tenant.toJSON(e) : undefined,
      );
    } else {
      obj.tenants = [];
    }
    return obj;
  },
};

function createBaseAddCoreosAppPermissionsResponse(): AddCoreosAppPermissionsResponse {
  return { statusId: '' };
}

export const AddCoreosAppPermissionsResponse = {
  fromJSON(object: any): AddCoreosAppPermissionsResponse {
    return {
      statusId: isSet(object.statusId) ? String(object.statusId) : '',
    };
  },

  toJSON(message: AddCoreosAppPermissionsResponse): unknown {
    const obj: any = {};
    message.statusId !== undefined && (obj.statusId = message.statusId);
    return obj;
  },
};

function createBasePermissionFileStatusResponse(): PermissionFileStatusResponse {
  return { statusId: '', tenantId: '', status: '', reason: [] };
}

export const PermissionFileStatusResponse = {
  fromJSON(object: any): PermissionFileStatusResponse {
    return {
      statusId: isSet(object.statusId) ? String(object.statusId) : '',
      tenantId: isSet(object.tenantId) ? String(object.tenantId) : '',
      status: isSet(object.status) ? String(object.status) : '',
      reason: Array.isArray(object?.reason)
        ? object.reason.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: PermissionFileStatusResponse): unknown {
    const obj: any = {};
    message.statusId !== undefined && (obj.statusId = message.statusId);
    message.tenantId !== undefined && (obj.tenantId = message.tenantId);
    message.status !== undefined && (obj.status = message.status);
    if (message.reason) {
      obj.reason = message.reason.map((e) => e);
    } else {
      obj.reason = [];
    }
    return obj;
  },
};

function createBaseGetAppsForCoreosUserResponse(): GetAppsForCoreosUserResponse {
  return { coreosUserId: '', apps: [] };
}

export const GetAppsForCoreosUserResponse = {
  fromJSON(object: any): GetAppsForCoreosUserResponse {
    return {
      coreosUserId: isSet(object.coreosUserId)
        ? String(object.coreosUserId)
        : '',
      apps: Array.isArray(object?.apps)
        ? object.apps.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: GetAppsForCoreosUserResponse): unknown {
    const obj: any = {};
    message.coreosUserId !== undefined &&
      (obj.coreosUserId = message.coreosUserId);
    if (message.apps) {
      obj.apps = message.apps.map((e) => e);
    } else {
      obj.apps = [];
    }
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
