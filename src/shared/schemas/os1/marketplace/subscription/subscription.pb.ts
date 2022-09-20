/* eslint-disable */
import { SubscriptionIdentifier } from './identifiers.pb';
import {
  RecordStatus,
  RecordAudit,
  PhoneNumber,
} from '../../core/common/common.pb';
import { OrganizationIdentifier } from '../../core/organization/identifiers.pb';
import { SolutionVersionIdentifier } from '../../developerportal/solution/identifiers.pb';
import { ApplicationVersionIdentifier } from '../../developerportal/application/identifiers.pb';
import { HumanName } from '../../core/user/user.pb';

export const protobufPackage = 'os1.marketplace.subscription';

export interface Subscription {
  id: SubscriptionIdentifier | undefined;
  organization: Subscription_OrganizationMetadata | undefined;
  item: SubscriptionItem | undefined;
  tier: SubscriptionTier | undefined;
  status: SubscriptionStatus | undefined;
  recordStatus: RecordStatus | undefined;
  recordAudit: RecordAudit | undefined;
}

export interface Subscription_OrganizationMetadata {
  id: OrganizationIdentifier | undefined;
  dns: string;
  domain: string;
  tenantId: string;
}

export interface SubscriptionStatus {
  status: string;
  requestedAt: string;
  activatedAt: string;
}

export interface SubscriptionItem {
  solution: SubscriptionItem_Solution | undefined;
  application: SubscriptionItem_Application | undefined;
}

export interface SubscriptionItem_Solution {
  id: SolutionVersionIdentifier | undefined;
}

export interface SubscriptionItem_Application {
  id: ApplicationVersionIdentifier | undefined;
}

export interface SubscriptionTier {
  displayName: string;
  planType: SubscriptionTier_PlanType;
  periodInDays: number;
}

export enum SubscriptionTier_PlanType {
  UNSPECIFIED = 0,
  DEVELOPER = 1,
  TRIAL = 2,
  PRODUCTION = 3,
  UNRECOGNIZED = -1,
}

export function subscriptionTier_PlanTypeFromJSON(
  object: any,
): SubscriptionTier_PlanType {
  switch (object) {
    case 0:
    case 'UNSPECIFIED':
      return SubscriptionTier_PlanType.UNSPECIFIED;
    case 1:
    case 'DEVELOPER':
      return SubscriptionTier_PlanType.DEVELOPER;
    case 2:
    case 'TRIAL':
      return SubscriptionTier_PlanType.TRIAL;
    case 3:
    case 'PRODUCTION':
      return SubscriptionTier_PlanType.PRODUCTION;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return SubscriptionTier_PlanType.UNRECOGNIZED;
  }
}

export function subscriptionTier_PlanTypeToJSON(
  object: SubscriptionTier_PlanType,
): string {
  switch (object) {
    case SubscriptionTier_PlanType.UNSPECIFIED:
      return 'UNSPECIFIED';
    case SubscriptionTier_PlanType.DEVELOPER:
      return 'DEVELOPER';
    case SubscriptionTier_PlanType.TRIAL:
      return 'TRIAL';
    case SubscriptionTier_PlanType.PRODUCTION:
      return 'PRODUCTION';
    case SubscriptionTier_PlanType.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export interface SubscriptionAdminUser {
  name: HumanName | undefined;
  email: string;
  primaryMobile: PhoneNumber | undefined;
}

export const OS1_MARKETPLACE_SUBSCRIPTION_PACKAGE_NAME =
  'os1.marketplace.subscription';

function createBaseSubscription(): Subscription {
  return {
    id: undefined,
    organization: undefined,
    item: undefined,
    tier: undefined,
    status: undefined,
    recordStatus: undefined,
    recordAudit: undefined,
  };
}

export const Subscription = {
  fromJSON(object: any): Subscription {
    return {
      id: isSet(object.id)
        ? SubscriptionIdentifier.fromJSON(object.id)
        : undefined,
      organization: isSet(object.organization)
        ? Subscription_OrganizationMetadata.fromJSON(object.organization)
        : undefined,
      item: isSet(object.item)
        ? SubscriptionItem.fromJSON(object.item)
        : undefined,
      tier: isSet(object.tier)
        ? SubscriptionTier.fromJSON(object.tier)
        : undefined,
      status: isSet(object.status)
        ? SubscriptionStatus.fromJSON(object.status)
        : undefined,
      recordStatus: isSet(object.recordStatus)
        ? RecordStatus.fromJSON(object.recordStatus)
        : undefined,
      recordAudit: isSet(object.recordAudit)
        ? RecordAudit.fromJSON(object.recordAudit)
        : undefined,
    };
  },

  toJSON(message: Subscription): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SubscriptionIdentifier.toJSON(message.id)
        : undefined);
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? Subscription_OrganizationMetadata.toJSON(message.organization)
        : undefined);
    message.item !== undefined &&
      (obj.item = message.item
        ? SubscriptionItem.toJSON(message.item)
        : undefined);
    message.tier !== undefined &&
      (obj.tier = message.tier
        ? SubscriptionTier.toJSON(message.tier)
        : undefined);
    message.status !== undefined &&
      (obj.status = message.status
        ? SubscriptionStatus.toJSON(message.status)
        : undefined);
    message.recordStatus !== undefined &&
      (obj.recordStatus = message.recordStatus
        ? RecordStatus.toJSON(message.recordStatus)
        : undefined);
    message.recordAudit !== undefined &&
      (obj.recordAudit = message.recordAudit
        ? RecordAudit.toJSON(message.recordAudit)
        : undefined);
    return obj;
  },
};

function createBaseSubscription_OrganizationMetadata(): Subscription_OrganizationMetadata {
  return { id: undefined, dns: '', domain: '', tenantId: '' };
}

export const Subscription_OrganizationMetadata = {
  fromJSON(object: any): Subscription_OrganizationMetadata {
    return {
      id: isSet(object.id)
        ? OrganizationIdentifier.fromJSON(object.id)
        : undefined,
      dns: isSet(object.dns) ? String(object.dns) : '',
      domain: isSet(object.domain) ? String(object.domain) : '',
      tenantId: isSet(object.tenantId) ? String(object.tenantId) : '',
    };
  },

  toJSON(message: Subscription_OrganizationMetadata): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? OrganizationIdentifier.toJSON(message.id)
        : undefined);
    message.dns !== undefined && (obj.dns = message.dns);
    message.domain !== undefined && (obj.domain = message.domain);
    message.tenantId !== undefined && (obj.tenantId = message.tenantId);
    return obj;
  },
};

function createBaseSubscriptionStatus(): SubscriptionStatus {
  return { status: '', requestedAt: '', activatedAt: '' };
}

export const SubscriptionStatus = {
  fromJSON(object: any): SubscriptionStatus {
    return {
      status: isSet(object.status) ? String(object.status) : '',
      requestedAt: isSet(object.requestedAt) ? String(object.requestedAt) : '',
      activatedAt: isSet(object.activatedAt) ? String(object.activatedAt) : '',
    };
  },

  toJSON(message: SubscriptionStatus): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    message.requestedAt !== undefined &&
      (obj.requestedAt = message.requestedAt);
    message.activatedAt !== undefined &&
      (obj.activatedAt = message.activatedAt);
    return obj;
  },
};

function createBaseSubscriptionItem(): SubscriptionItem {
  return { solution: undefined, application: undefined };
}

export const SubscriptionItem = {
  fromJSON(object: any): SubscriptionItem {
    return {
      solution: isSet(object.solution)
        ? SubscriptionItem_Solution.fromJSON(object.solution)
        : undefined,
      application: isSet(object.application)
        ? SubscriptionItem_Application.fromJSON(object.application)
        : undefined,
    };
  },

  toJSON(message: SubscriptionItem): unknown {
    const obj: any = {};
    message.solution !== undefined &&
      (obj.solution = message.solution
        ? SubscriptionItem_Solution.toJSON(message.solution)
        : undefined);
    message.application !== undefined &&
      (obj.application = message.application
        ? SubscriptionItem_Application.toJSON(message.application)
        : undefined);
    return obj;
  },
};

function createBaseSubscriptionItem_Solution(): SubscriptionItem_Solution {
  return { id: undefined };
}

export const SubscriptionItem_Solution = {
  fromJSON(object: any): SubscriptionItem_Solution {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: SubscriptionItem_Solution): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseSubscriptionItem_Application(): SubscriptionItem_Application {
  return { id: undefined };
}

export const SubscriptionItem_Application = {
  fromJSON(object: any): SubscriptionItem_Application {
    return {
      id: isSet(object.id)
        ? ApplicationVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: SubscriptionItem_Application): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? ApplicationVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseSubscriptionTier(): SubscriptionTier {
  return { displayName: '', planType: 0, periodInDays: 0 };
}

export const SubscriptionTier = {
  fromJSON(object: any): SubscriptionTier {
    return {
      displayName: isSet(object.displayName) ? String(object.displayName) : '',
      planType: isSet(object.planType)
        ? subscriptionTier_PlanTypeFromJSON(object.planType)
        : 0,
      periodInDays: isSet(object.periodInDays)
        ? Number(object.periodInDays)
        : 0,
    };
  },

  toJSON(message: SubscriptionTier): unknown {
    const obj: any = {};
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.planType !== undefined &&
      (obj.planType = subscriptionTier_PlanTypeToJSON(message.planType));
    message.periodInDays !== undefined &&
      (obj.periodInDays = Math.round(message.periodInDays));
    return obj;
  },
};

function createBaseSubscriptionAdminUser(): SubscriptionAdminUser {
  return { name: undefined, email: '', primaryMobile: undefined };
}

export const SubscriptionAdminUser = {
  fromJSON(object: any): SubscriptionAdminUser {
    return {
      name: isSet(object.name) ? HumanName.fromJSON(object.name) : undefined,
      email: isSet(object.email) ? String(object.email) : '',
      primaryMobile: isSet(object.primaryMobile)
        ? PhoneNumber.fromJSON(object.primaryMobile)
        : undefined,
    };
  },

  toJSON(message: SubscriptionAdminUser): unknown {
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
