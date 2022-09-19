/* eslint-disable */
import { SubscriptionIdentifier } from './identifiers.pb';
import { OrganizationMetadata } from '../../core/organization/identifiers.pb';
import { RecordStatus, RecordAudit } from '../../core/common/common.pb';
import { ApplicationVersionIdentifier } from '../../developerportal/application/identifiers.pb';
import { SolutionVersionIdentifier } from '../../developerportal/solution/identifiers.pb';

export const protobufPackage = 'os1.marketplace.subscription';

export interface Subscription {
  id: SubscriptionIdentifier | undefined;
  subscribedItem: SubscribedItem | undefined;
  organization: OrganizationMetadata | undefined;
  recordStatus: RecordStatus | undefined;
  recordAudit: RecordAudit | undefined;
  executionState: SubscriptionExecutionState | undefined;
}

export interface SubscriptionExecutionState {
  createOrganizationTenant: string;
  createApps: string;
  createPermissions: string;
}

/** defines the subscription item (either app or solution) */
export interface SubscribedItem {
  application: ApplicationVersionIdentifier | undefined;
  solution: SolutionVersionIdentifier | undefined;
}

export const OS1_MARKETPLACE_SUBSCRIPTION_PACKAGE_NAME =
  'os1.marketplace.subscription';

function createBaseSubscription(): Subscription {
  return {
    id: undefined,
    subscribedItem: undefined,
    organization: undefined,
    recordStatus: undefined,
    recordAudit: undefined,
    executionState: undefined,
  };
}

export const Subscription = {
  fromJSON(object: any): Subscription {
    return {
      id: isSet(object.id)
        ? SubscriptionIdentifier.fromJSON(object.id)
        : undefined,
      subscribedItem: isSet(object.subscribedItem)
        ? SubscribedItem.fromJSON(object.subscribedItem)
        : undefined,
      organization: isSet(object.organization)
        ? OrganizationMetadata.fromJSON(object.organization)
        : undefined,
      recordStatus: isSet(object.recordStatus)
        ? RecordStatus.fromJSON(object.recordStatus)
        : undefined,
      recordAudit: isSet(object.recordAudit)
        ? RecordAudit.fromJSON(object.recordAudit)
        : undefined,
      executionState: isSet(object.executionState)
        ? SubscriptionExecutionState.fromJSON(object.executionState)
        : undefined,
    };
  },

  toJSON(message: Subscription): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SubscriptionIdentifier.toJSON(message.id)
        : undefined);
    message.subscribedItem !== undefined &&
      (obj.subscribedItem = message.subscribedItem
        ? SubscribedItem.toJSON(message.subscribedItem)
        : undefined);
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? OrganizationMetadata.toJSON(message.organization)
        : undefined);
    message.recordStatus !== undefined &&
      (obj.recordStatus = message.recordStatus
        ? RecordStatus.toJSON(message.recordStatus)
        : undefined);
    message.recordAudit !== undefined &&
      (obj.recordAudit = message.recordAudit
        ? RecordAudit.toJSON(message.recordAudit)
        : undefined);
    message.executionState !== undefined &&
      (obj.executionState = message.executionState
        ? SubscriptionExecutionState.toJSON(message.executionState)
        : undefined);
    return obj;
  },
};

function createBaseSubscriptionExecutionState(): SubscriptionExecutionState {
  return {
    createOrganizationTenant: '',
    createApps: '',
    createPermissions: '',
  };
}

export const SubscriptionExecutionState = {
  fromJSON(object: any): SubscriptionExecutionState {
    return {
      createOrganizationTenant: isSet(object.createOrganizationTenant)
        ? String(object.createOrganizationTenant)
        : '',
      createApps: isSet(object.createApps) ? String(object.createApps) : '',
      createPermissions: isSet(object.createPermissions)
        ? String(object.createPermissions)
        : '',
    };
  },

  toJSON(message: SubscriptionExecutionState): unknown {
    const obj: any = {};
    message.createOrganizationTenant !== undefined &&
      (obj.createOrganizationTenant = message.createOrganizationTenant);
    message.createApps !== undefined && (obj.createApps = message.createApps);
    message.createPermissions !== undefined &&
      (obj.createPermissions = message.createPermissions);
    return obj;
  },
};

function createBaseSubscribedItem(): SubscribedItem {
  return { application: undefined, solution: undefined };
}

export const SubscribedItem = {
  fromJSON(object: any): SubscribedItem {
    return {
      application: isSet(object.application)
        ? ApplicationVersionIdentifier.fromJSON(object.application)
        : undefined,
      solution: isSet(object.solution)
        ? SolutionVersionIdentifier.fromJSON(object.solution)
        : undefined,
    };
  },

  toJSON(message: SubscribedItem): unknown {
    const obj: any = {};
    message.application !== undefined &&
      (obj.application = message.application
        ? ApplicationVersionIdentifier.toJSON(message.application)
        : undefined);
    message.solution !== undefined &&
      (obj.solution = message.solution
        ? SolutionVersionIdentifier.toJSON(message.solution)
        : undefined);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
