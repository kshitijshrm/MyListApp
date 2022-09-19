/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  CreateSubscriptionResponse,
  GetAppSubscriptionsByOrgDomainResponse,
} from '../subscription/response.pb';
import {
  SubscribeAppToDeveloperOrgRequest,
  SubscribeAppToCustomerOrgRequest,
  SubscribeSolutionToCustomerOrgRequest,
  GetAppSubscriptionsByOrgDomainRequest,
} from '../subscription/request.pb';

export const protobufPackage = 'os1.marketplace.service';

export const OS1_MARKETPLACE_SERVICE_PACKAGE_NAME = 'os1.marketplace.service';

export interface SubscriptionServiceClient {
  /**
   * commands
   * app
   */

  subscribeAppToDeveloperOrg(
    request: SubscribeAppToDeveloperOrgRequest,
    metadata?: Metadata,
  ): Observable<CreateSubscriptionResponse>;

  subscribeAppToCustomerOrg(
    request: SubscribeAppToCustomerOrgRequest,
    metadata?: Metadata,
  ): Observable<CreateSubscriptionResponse>;

  /** solutions */

  subscribeSolutionToCustomerOrg(
    request: SubscribeSolutionToCustomerOrgRequest,
    metadata?: Metadata,
  ): Observable<CreateSubscriptionResponse>;

  /** queries */

  getAppSubscriptionsByOrgDomain(
    request: GetAppSubscriptionsByOrgDomainRequest,
    metadata?: Metadata,
  ): Observable<GetAppSubscriptionsByOrgDomainResponse>;
}

export interface SubscriptionServiceController {
  /**
   * commands
   * app
   */

  subscribeAppToDeveloperOrg(
    request: SubscribeAppToDeveloperOrgRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateSubscriptionResponse>
    | Observable<CreateSubscriptionResponse>
    | CreateSubscriptionResponse;

  subscribeAppToCustomerOrg(
    request: SubscribeAppToCustomerOrgRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateSubscriptionResponse>
    | Observable<CreateSubscriptionResponse>
    | CreateSubscriptionResponse;

  /** solutions */

  subscribeSolutionToCustomerOrg(
    request: SubscribeSolutionToCustomerOrgRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateSubscriptionResponse>
    | Observable<CreateSubscriptionResponse>
    | CreateSubscriptionResponse;

  /** queries */

  getAppSubscriptionsByOrgDomain(
    request: GetAppSubscriptionsByOrgDomainRequest,
    metadata?: Metadata,
  ):
    | Promise<GetAppSubscriptionsByOrgDomainResponse>
    | Observable<GetAppSubscriptionsByOrgDomainResponse>
    | GetAppSubscriptionsByOrgDomainResponse;
}

export function SubscriptionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'subscribeAppToDeveloperOrg',
      'subscribeAppToCustomerOrg',
      'subscribeSolutionToCustomerOrg',
      'getAppSubscriptionsByOrgDomain',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('SubscriptionService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('SubscriptionService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const SUBSCRIPTION_SERVICE_NAME = 'SubscriptionService';
