/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import { Empty } from '../../../google/protobuf/empty.pb';
import {
  CreateCoreosAppRequest,
  AddCoreosAppPermissionsRequest,
} from '../coreosagent/request.pb';

export const protobufPackage = 'os1.core.service';

export const OS1_CORE_SERVICE_PACKAGE_NAME = 'os1.core.service';

export interface CoreosAgentServiceClient {
  /** commands */

  createCoreosApp(
    request: CreateCoreosAppRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  addCoreosAppPermissions(
    request: AddCoreosAppPermissionsRequest,
    metadata?: Metadata,
  ): Observable<Empty>;
}

export interface CoreosAgentServiceController {
  /** commands */

  createCoreosApp(request: CreateCoreosAppRequest, metadata?: Metadata): void;

  addCoreosAppPermissions(
    request: AddCoreosAppPermissionsRequest,
    metadata?: Metadata,
  ): void;
}

export function CoreosAgentServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createCoreosApp',
      'addCoreosAppPermissions',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('CoreosAgentService', method)(
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
      GrpcStreamMethod('CoreosAgentService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const COREOS_AGENT_SERVICE_NAME = 'CoreosAgentService';
