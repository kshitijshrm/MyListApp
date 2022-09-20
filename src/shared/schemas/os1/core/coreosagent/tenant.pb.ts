/* eslint-disable */
export const protobufPackage = 'os1.core.coreosagent';

export interface Tenant {
  tenantId: string;
  tenantName: string;
  tenantDescription: string;
  tenantStatus?: string | undefined;
  tenantDns: string;
  stackId: string;
  stackName: string;
  associatedOrganization?: string | undefined;
}

export const OS1_CORE_COREOSAGENT_PACKAGE_NAME = 'os1.core.coreosagent';

function createBaseTenant(): Tenant {
  return {
    tenantId: '',
    tenantName: '',
    tenantDescription: '',
    tenantStatus: undefined,
    tenantDns: '',
    stackId: '',
    stackName: '',
    associatedOrganization: undefined,
  };
}

export const Tenant = {
  fromJSON(object: any): Tenant {
    return {
      tenantId: isSet(object.tenantId) ? String(object.tenantId) : '',
      tenantName: isSet(object.tenantName) ? String(object.tenantName) : '',
      tenantDescription: isSet(object.tenantDescription)
        ? String(object.tenantDescription)
        : '',
      tenantStatus: isSet(object.tenantStatus)
        ? String(object.tenantStatus)
        : undefined,
      tenantDns: isSet(object.tenantDns) ? String(object.tenantDns) : '',
      stackId: isSet(object.stackId) ? String(object.stackId) : '',
      stackName: isSet(object.stackName) ? String(object.stackName) : '',
      associatedOrganization: isSet(object.associatedOrganization)
        ? String(object.associatedOrganization)
        : undefined,
    };
  },

  toJSON(message: Tenant): unknown {
    const obj: any = {};
    message.tenantId !== undefined && (obj.tenantId = message.tenantId);
    message.tenantName !== undefined && (obj.tenantName = message.tenantName);
    message.tenantDescription !== undefined &&
      (obj.tenantDescription = message.tenantDescription);
    message.tenantStatus !== undefined &&
      (obj.tenantStatus = message.tenantStatus);
    message.tenantDns !== undefined && (obj.tenantDns = message.tenantDns);
    message.stackId !== undefined && (obj.stackId = message.stackId);
    message.stackName !== undefined && (obj.stackName = message.stackName);
    message.associatedOrganization !== undefined &&
      (obj.associatedOrganization = message.associatedOrganization);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
