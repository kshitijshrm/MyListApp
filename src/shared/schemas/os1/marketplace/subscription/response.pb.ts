/* eslint-disable */
import { SubscriptionIdentifier } from './identifiers.pb';
import { Subscription } from './subscription.pb';

export const protobufPackage = 'os1.marketplace.subscription';

export interface StartSolutionTrialResponse {
  id: SubscriptionIdentifier | undefined;
}

export interface GetSubscriptionsByOrgDomainResponse {
  subscriptions: Subscription[];
}

export const OS1_MARKETPLACE_SUBSCRIPTION_PACKAGE_NAME =
  'os1.marketplace.subscription';

function createBaseStartSolutionTrialResponse(): StartSolutionTrialResponse {
  return { id: undefined };
}

export const StartSolutionTrialResponse = {
  fromJSON(object: any): StartSolutionTrialResponse {
    return {
      id: isSet(object.id)
        ? SubscriptionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: StartSolutionTrialResponse): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SubscriptionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseGetSubscriptionsByOrgDomainResponse(): GetSubscriptionsByOrgDomainResponse {
  return { subscriptions: [] };
}

export const GetSubscriptionsByOrgDomainResponse = {
  fromJSON(object: any): GetSubscriptionsByOrgDomainResponse {
    return {
      subscriptions: Array.isArray(object?.subscriptions)
        ? object.subscriptions.map((e: any) => Subscription.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetSubscriptionsByOrgDomainResponse): unknown {
    const obj: any = {};
    if (message.subscriptions) {
      obj.subscriptions = message.subscriptions.map((e) =>
        e ? Subscription.toJSON(e) : undefined,
      );
    } else {
      obj.subscriptions = [];
    }
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
