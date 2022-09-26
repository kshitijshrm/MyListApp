/* eslint-disable */
import {
  OrganizationMetadata,
  OrganizationIdentifier,
} from '../../core/organization/identifiers.pb';
import { SolutionVersionIdentifier } from '../../developerportal/solution/identifiers.pb';
import { ApplicationVersionIdentifier } from '../../developerportal/application/identifiers.pb';
import { SubscriptionAdminUser } from './subscription.pb';

export const protobufPackage = 'os1.marketplace.subscription';

export interface SubscribeSolutionToDeveloperOrgRequest {
  organization: OrganizationMetadata | undefined;
  item: SubscriptionItemRequest_Solution | undefined;
}

export interface SubscribeApplicationToDeveloperOrgRequest {
  organization: OrganizationMetadata | undefined;
  item: SubscriptionItemRequest_Application | undefined;
}

export interface SubscriberOrganizationRequestAttributes {
  id: OrganizationIdentifier | undefined;
}

export interface SubscriptionItemRequest {}

export interface SubscriptionItemRequest_Solution {
  id: SolutionVersionIdentifier | undefined;
}

export interface SubscriptionItemRequest_Application {
  id: ApplicationVersionIdentifier | undefined;
}

export interface StartSolutionTrialRequest {
  organization: SubscriberOrganizationRequestAttributes | undefined;
  item: SubscriptionItemRequest_Solution | undefined;
  adminUser: SubscriptionAdminUser | undefined;
}

export interface StartApplicationTrialRequest {
  organization: SubscriberOrganizationRequestAttributes | undefined;
  item: SubscriptionItemRequest_Application | undefined;
  adminUser: SubscriptionAdminUser | undefined;
}

export interface UpgradeSolutionSubscriptionRequest {
  organization: SubscriberOrganizationRequestAttributes | undefined;
  item: SubscriptionItemRequest_Solution | undefined;
}

export interface UpgradeApplicationSubscriptionRequest {
  organization: SubscriberOrganizationRequestAttributes | undefined;
  item: SubscriptionItemRequest_Application | undefined;
}

export interface Application {
  id: ApplicationVersionIdentifier | undefined;
}

export interface GetSubscriptionsByOrgDomainRequest {
  organizationDomain: string;
}

export const OS1_MARKETPLACE_SUBSCRIPTION_PACKAGE_NAME =
  'os1.marketplace.subscription';

function createBaseSubscribeSolutionToDeveloperOrgRequest(): SubscribeSolutionToDeveloperOrgRequest {
  return { organization: undefined, item: undefined };
}

export const SubscribeSolutionToDeveloperOrgRequest = {
  fromJSON(object: any): SubscribeSolutionToDeveloperOrgRequest {
    return {
      organization: isSet(object.organization)
        ? OrganizationMetadata.fromJSON(object.organization)
        : undefined,
      item: isSet(object.item)
        ? SubscriptionItemRequest_Solution.fromJSON(object.item)
        : undefined,
    };
  },

  toJSON(message: SubscribeSolutionToDeveloperOrgRequest): unknown {
    const obj: any = {};
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? OrganizationMetadata.toJSON(message.organization)
        : undefined);
    message.item !== undefined &&
      (obj.item = message.item
        ? SubscriptionItemRequest_Solution.toJSON(message.item)
        : undefined);
    return obj;
  },
};

function createBaseSubscribeApplicationToDeveloperOrgRequest(): SubscribeApplicationToDeveloperOrgRequest {
  return { organization: undefined, item: undefined };
}

export const SubscribeApplicationToDeveloperOrgRequest = {
  fromJSON(object: any): SubscribeApplicationToDeveloperOrgRequest {
    return {
      organization: isSet(object.organization)
        ? OrganizationMetadata.fromJSON(object.organization)
        : undefined,
      item: isSet(object.item)
        ? SubscriptionItemRequest_Application.fromJSON(object.item)
        : undefined,
    };
  },

  toJSON(message: SubscribeApplicationToDeveloperOrgRequest): unknown {
    const obj: any = {};
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? OrganizationMetadata.toJSON(message.organization)
        : undefined);
    message.item !== undefined &&
      (obj.item = message.item
        ? SubscriptionItemRequest_Application.toJSON(message.item)
        : undefined);
    return obj;
  },
};

function createBaseSubscriberOrganizationRequestAttributes(): SubscriberOrganizationRequestAttributes {
  return { id: undefined };
}

export const SubscriberOrganizationRequestAttributes = {
  fromJSON(object: any): SubscriberOrganizationRequestAttributes {
    return {
      id: isSet(object.id)
        ? OrganizationIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: SubscriberOrganizationRequestAttributes): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? OrganizationIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseSubscriptionItemRequest(): SubscriptionItemRequest {
  return {};
}

export const SubscriptionItemRequest = {
  fromJSON(_: any): SubscriptionItemRequest {
    return {};
  },

  toJSON(_: SubscriptionItemRequest): unknown {
    const obj: any = {};
    return obj;
  },
};

function createBaseSubscriptionItemRequest_Solution(): SubscriptionItemRequest_Solution {
  return { id: undefined };
}

export const SubscriptionItemRequest_Solution = {
  fromJSON(object: any): SubscriptionItemRequest_Solution {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: SubscriptionItemRequest_Solution): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseSubscriptionItemRequest_Application(): SubscriptionItemRequest_Application {
  return { id: undefined };
}

export const SubscriptionItemRequest_Application = {
  fromJSON(object: any): SubscriptionItemRequest_Application {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: SubscriptionItemRequest_Application): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseStartSolutionTrialRequest(): StartSolutionTrialRequest {
  return { organization: undefined, item: undefined, adminUser: undefined };
}

export const StartSolutionTrialRequest = {
  fromJSON(object: any): StartSolutionTrialRequest {
    return {
      organization: isSet(object.organization)
        ? SubscriberOrganizationRequestAttributes.fromJSON(object.organization)
        : undefined,
      item: isSet(object.item)
        ? SubscriptionItemRequest_Solution.fromJSON(object.item)
        : undefined,
      adminUser: isSet(object.adminUser)
        ? SubscriptionAdminUser.fromJSON(object.adminUser)
        : undefined,
    };
  },

  toJSON(message: StartSolutionTrialRequest): unknown {
    const obj: any = {};
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? SubscriberOrganizationRequestAttributes.toJSON(message.organization)
        : undefined);
    message.item !== undefined &&
      (obj.item = message.item
        ? SubscriptionItemRequest_Solution.toJSON(message.item)
        : undefined);
    message.adminUser !== undefined &&
      (obj.adminUser = message.adminUser
        ? SubscriptionAdminUser.toJSON(message.adminUser)
        : undefined);
    return obj;
  },
};

function createBaseStartApplicationTrialRequest(): StartApplicationTrialRequest {
  return { organization: undefined, item: undefined, adminUser: undefined };
}

export const StartApplicationTrialRequest = {
  fromJSON(object: any): StartApplicationTrialRequest {
    return {
      organization: isSet(object.organization)
        ? SubscriberOrganizationRequestAttributes.fromJSON(object.organization)
        : undefined,
      item: isSet(object.item)
        ? SubscriptionItemRequest_Application.fromJSON(object.item)
        : undefined,
      adminUser: isSet(object.adminUser)
        ? SubscriptionAdminUser.fromJSON(object.adminUser)
        : undefined,
    };
  },

  toJSON(message: StartApplicationTrialRequest): unknown {
    const obj: any = {};
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? SubscriberOrganizationRequestAttributes.toJSON(message.organization)
        : undefined);
    message.item !== undefined &&
      (obj.item = message.item
        ? SubscriptionItemRequest_Application.toJSON(message.item)
        : undefined);
    message.adminUser !== undefined &&
      (obj.adminUser = message.adminUser
        ? SubscriptionAdminUser.toJSON(message.adminUser)
        : undefined);
    return obj;
  },
};

function createBaseUpgradeSolutionSubscriptionRequest(): UpgradeSolutionSubscriptionRequest {
  return { organization: undefined, item: undefined };
}

export const UpgradeSolutionSubscriptionRequest = {
  fromJSON(object: any): UpgradeSolutionSubscriptionRequest {
    return {
      organization: isSet(object.organization)
        ? SubscriberOrganizationRequestAttributes.fromJSON(object.organization)
        : undefined,
      item: isSet(object.item)
        ? SubscriptionItemRequest_Solution.fromJSON(object.item)
        : undefined,
    };
  },

  toJSON(message: UpgradeSolutionSubscriptionRequest): unknown {
    const obj: any = {};
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? SubscriberOrganizationRequestAttributes.toJSON(message.organization)
        : undefined);
    message.item !== undefined &&
      (obj.item = message.item
        ? SubscriptionItemRequest_Solution.toJSON(message.item)
        : undefined);
    return obj;
  },
};

function createBaseUpgradeApplicationSubscriptionRequest(): UpgradeApplicationSubscriptionRequest {
  return { organization: undefined, item: undefined };
}

export const UpgradeApplicationSubscriptionRequest = {
  fromJSON(object: any): UpgradeApplicationSubscriptionRequest {
    return {
      organization: isSet(object.organization)
        ? SubscriberOrganizationRequestAttributes.fromJSON(object.organization)
        : undefined,
      item: isSet(object.item)
        ? SubscriptionItemRequest_Application.fromJSON(object.item)
        : undefined,
    };
  },

  toJSON(message: UpgradeApplicationSubscriptionRequest): unknown {
    const obj: any = {};
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? SubscriberOrganizationRequestAttributes.toJSON(message.organization)
        : undefined);
    message.item !== undefined &&
      (obj.item = message.item
        ? SubscriptionItemRequest_Application.toJSON(message.item)
        : undefined);
    return obj;
  },
};

function createBaseApplication(): Application {
  return { id: undefined };
}

export const Application = {
  fromJSON(object: any): Application {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: Application): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseGetSubscriptionsByOrgDomainRequest(): GetSubscriptionsByOrgDomainRequest {
  return { organizationDomain: '' };
}

export const GetSubscriptionsByOrgDomainRequest = {
  fromJSON(object: any): GetSubscriptionsByOrgDomainRequest {
    return {
      organizationDomain: isSet(object.organizationDomain)
        ? String(object.organizationDomain)
        : '',
    };
  },

  toJSON(message: GetSubscriptionsByOrgDomainRequest): unknown {
    const obj: any = {};
    message.organizationDomain !== undefined &&
      (obj.organizationDomain = message.organizationDomain);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
