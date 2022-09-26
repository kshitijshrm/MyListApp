/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  StartSolutionTrialResponse,
  GetSubscriptionsByOrgDomainResponse,
} from '../subscription/response.pb';
import { Empty } from '../../../google/protobuf/empty.pb';
import {
  StartSolutionTrialRequest,
  UpgradeSolutionSubscriptionRequest,
  StartApplicationTrialRequest,
  SubscribeSolutionToDeveloperOrgRequest,
  SubscribeApplicationToDeveloperOrgRequest,
  GetSubscriptionsByOrgDomainRequest,
} from '../subscription/request.pb';

export const protobufPackage = 'os1.marketplace.service';

export const OS1_MARKETPLACE_SERVICE_PACKAGE_NAME = 'os1.marketplace.service';

export interface SubscriptionServiceClient {
  /** customer subscription */

  startSolutionTrial(
    request: StartSolutionTrialRequest,
    metadata?: Metadata,
  ): Observable<StartSolutionTrialResponse>;

  upgradeSolutionTailToProduction(
    request: UpgradeSolutionSubscriptionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  startApplicationTrial(
    request: StartApplicationTrialRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  upgradeApplicationTailToProduction(
    request: UpgradeSolutionSubscriptionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  /** developer subscriptions */

  subscribeSolutionToDeveloperOrg(
    request: SubscribeSolutionToDeveloperOrgRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  subscribeApplicationToDeveloperOrg(
    request: SubscribeApplicationToDeveloperOrgRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  /** queries */

  getSubscriptionsByOrganizationId(
    request: GetSubscriptionsByOrgDomainRequest,
    metadata?: Metadata,
  ): Observable<GetSubscriptionsByOrgDomainResponse>;

  getSubscriptionsByOrganizationDomain(
    request: GetSubscriptionsByOrgDomainRequest,
    metadata?: Metadata,
  ): Observable<GetSubscriptionsByOrgDomainResponse>;
}

export interface SubscriptionServiceController {
  /** customer subscription */

  startSolutionTrial(
    request: StartSolutionTrialRequest,
    metadata?: Metadata,
  ):
    | Promise<StartSolutionTrialResponse>
    | Observable<StartSolutionTrialResponse>
    | StartSolutionTrialResponse;

  upgradeSolutionTailToProduction(
    request: UpgradeSolutionSubscriptionRequest,
    metadata?: Metadata,
  ): void;

  startApplicationTrial(
    request: StartApplicationTrialRequest,
    metadata?: Metadata,
  ): void;

  upgradeApplicationTailToProduction(
    request: UpgradeSolutionSubscriptionRequest,
    metadata?: Metadata,
  ): void;

  /** developer subscriptions */

  subscribeSolutionToDeveloperOrg(
    request: SubscribeSolutionToDeveloperOrgRequest,
    metadata?: Metadata,
  ): void;

  subscribeApplicationToDeveloperOrg(
    request: SubscribeApplicationToDeveloperOrgRequest,
    metadata?: Metadata,
  ): void;

  /** queries */

  getSubscriptionsByOrganizationId(
    request: GetSubscriptionsByOrgDomainRequest,
    metadata?: Metadata,
  ):
    | Promise<GetSubscriptionsByOrgDomainResponse>
    | Observable<GetSubscriptionsByOrgDomainResponse>
    | GetSubscriptionsByOrgDomainResponse;

  getSubscriptionsByOrganizationDomain(
    request: GetSubscriptionsByOrgDomainRequest,
    metadata?: Metadata,
  ):
    | Promise<GetSubscriptionsByOrgDomainResponse>
    | Observable<GetSubscriptionsByOrgDomainResponse>
    | GetSubscriptionsByOrgDomainResponse;
}

export function SubscriptionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'startSolutionTrial',
      'upgradeSolutionTailToProduction',
      'startApplicationTrial',
      'upgradeApplicationTailToProduction',
      'subscribeSolutionToDeveloperOrg',
      'subscribeApplicationToDeveloperOrg',
      'getSubscriptionsByOrganizationId',
      'getSubscriptionsByOrganizationDomain',
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
