/* eslint-disable */
import { ApplicationVersionIdentifier } from '../../developerportal/application/identifiers.pb';
import {
  OrganizationMetadata,
  OrganizationDomainIdentifier,
} from '../../core/organization/identifiers.pb';
import { SolutionVersionIdentifier } from '../../developerportal/solution/identifiers.pb';

export const protobufPackage = 'os1.marketplace.subscription';

export interface SubscribeAppToDeveloperOrgRequest {
  application: ApplicationVersionIdentifier | undefined;
  organization: OrganizationMetadata | undefined;
}

export interface SubscribeAppToCustomerOrgRequest {
  application: ApplicationVersionIdentifier | undefined;
  organizationDomainId: OrganizationDomainIdentifier | undefined;
}

export interface SubscribeSolutionToCustomerOrgRequest {
  solution: SolutionVersionIdentifier | undefined;
  organizationDomainId: OrganizationDomainIdentifier | undefined;
}

export interface GetAppSubscriptionsByOrgDomainRequest {
  organizationDomain: string;
}

export const OS1_MARKETPLACE_SUBSCRIPTION_PACKAGE_NAME =
  'os1.marketplace.subscription';

function createBaseSubscribeAppToDeveloperOrgRequest(): SubscribeAppToDeveloperOrgRequest {
  return { application: undefined, organization: undefined };
}

export const SubscribeAppToDeveloperOrgRequest = {
  fromJSON(object: any): SubscribeAppToDeveloperOrgRequest {
    return {
      application: isSet(object.application)
        ? ApplicationVersionIdentifier.fromJSON(object.application)
        : undefined,
      organization: isSet(object.organization)
        ? OrganizationMetadata.fromJSON(object.organization)
        : undefined,
    };
  },

  toJSON(message: SubscribeAppToDeveloperOrgRequest): unknown {
    const obj: any = {};
    message.application !== undefined &&
      (obj.application = message.application
        ? ApplicationVersionIdentifier.toJSON(message.application)
        : undefined);
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? OrganizationMetadata.toJSON(message.organization)
        : undefined);
    return obj;
  },
};

function createBaseSubscribeAppToCustomerOrgRequest(): SubscribeAppToCustomerOrgRequest {
  return { application: undefined, organizationDomainId: undefined };
}

export const SubscribeAppToCustomerOrgRequest = {
  fromJSON(object: any): SubscribeAppToCustomerOrgRequest {
    return {
      application: isSet(object.application)
        ? ApplicationVersionIdentifier.fromJSON(object.application)
        : undefined,
      organizationDomainId: isSet(object.organizationDomainId)
        ? OrganizationDomainIdentifier.fromJSON(object.organizationDomainId)
        : undefined,
    };
  },

  toJSON(message: SubscribeAppToCustomerOrgRequest): unknown {
    const obj: any = {};
    message.application !== undefined &&
      (obj.application = message.application
        ? ApplicationVersionIdentifier.toJSON(message.application)
        : undefined);
    message.organizationDomainId !== undefined &&
      (obj.organizationDomainId = message.organizationDomainId
        ? OrganizationDomainIdentifier.toJSON(message.organizationDomainId)
        : undefined);
    return obj;
  },
};

function createBaseSubscribeSolutionToCustomerOrgRequest(): SubscribeSolutionToCustomerOrgRequest {
  return { solution: undefined, organizationDomainId: undefined };
}

export const SubscribeSolutionToCustomerOrgRequest = {
  fromJSON(object: any): SubscribeSolutionToCustomerOrgRequest {
    return {
      solution: isSet(object.solution)
        ? SolutionVersionIdentifier.fromJSON(object.solution)
        : undefined,
      organizationDomainId: isSet(object.organizationDomainId)
        ? OrganizationDomainIdentifier.fromJSON(object.organizationDomainId)
        : undefined,
    };
  },

  toJSON(message: SubscribeSolutionToCustomerOrgRequest): unknown {
    const obj: any = {};
    message.solution !== undefined &&
      (obj.solution = message.solution
        ? SolutionVersionIdentifier.toJSON(message.solution)
        : undefined);
    message.organizationDomainId !== undefined &&
      (obj.organizationDomainId = message.organizationDomainId
        ? OrganizationDomainIdentifier.toJSON(message.organizationDomainId)
        : undefined);
    return obj;
  },
};

function createBaseGetAppSubscriptionsByOrgDomainRequest(): GetAppSubscriptionsByOrgDomainRequest {
  return { organizationDomain: '' };
}

export const GetAppSubscriptionsByOrgDomainRequest = {
  fromJSON(object: any): GetAppSubscriptionsByOrgDomainRequest {
    return {
      organizationDomain: isSet(object.organizationDomain)
        ? String(object.organizationDomain)
        : '',
    };
  },

  toJSON(message: GetAppSubscriptionsByOrgDomainRequest): unknown {
    const obj: any = {};
    message.organizationDomain !== undefined &&
      (obj.organizationDomain = message.organizationDomain);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
