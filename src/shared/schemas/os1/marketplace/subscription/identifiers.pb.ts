/* eslint-disable */
export const protobufPackage = 'os1.marketplace.subscription';

export interface SubscriptionIdentifier {
  subscriptionId: string;
}

export const OS1_MARKETPLACE_SUBSCRIPTION_PACKAGE_NAME =
  'os1.marketplace.subscription';

function createBaseSubscriptionIdentifier(): SubscriptionIdentifier {
  return { subscriptionId: '' };
}

export const SubscriptionIdentifier = {
  fromJSON(object: any): SubscriptionIdentifier {
    return {
      subscriptionId: isSet(object.subscriptionId)
        ? String(object.subscriptionId)
        : '',
    };
  },

  toJSON(message: SubscriptionIdentifier): unknown {
    const obj: any = {};
    message.subscriptionId !== undefined &&
      (obj.subscriptionId = message.subscriptionId);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
