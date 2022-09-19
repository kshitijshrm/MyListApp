/* eslint-disable */
import { SubscriptionIdentifier } from './identifiers.pb';
import { Subscription } from './subscription.pb';

export const protobufPackage = 'os1.marketplace.subscription';

export interface CreateSubscriptionResponse {
  id: SubscriptionIdentifier | undefined;
}

export interface GetAppSubscriptionsByOrgDomainResponse {
  subscription: Subscription[];
}

export const OS1_MARKETPLACE_SUBSCRIPTION_PACKAGE_NAME =
  'os1.marketplace.subscription';

function createBaseCreateSubscriptionResponse(): CreateSubscriptionResponse {
  return { id: undefined };
}

export const CreateSubscriptionResponse = {
  fromJSON(object: any): CreateSubscriptionResponse {
    return {
      id: isSet(object.id)
        ? SubscriptionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: CreateSubscriptionResponse): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SubscriptionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseGetAppSubscriptionsByOrgDomainResponse(): GetAppSubscriptionsByOrgDomainResponse {
  return { subscription: [] };
}

export const GetAppSubscriptionsByOrgDomainResponse = {
  fromJSON(object: any): GetAppSubscriptionsByOrgDomainResponse {
    return {
      subscription: Array.isArray(object?.subscription)
        ? object.subscription.map((e: any) => Subscription.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetAppSubscriptionsByOrgDomainResponse): unknown {
    const obj: any = {};
    if (message.subscription) {
      obj.subscription = message.subscription.map((e) =>
        e ? Subscription.toJSON(e) : undefined,
      );
    } else {
      obj.subscription = [];
    }
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
