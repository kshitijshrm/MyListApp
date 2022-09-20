/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import { Empty } from '../../../google/protobuf/empty.pb';
import {
  AddCoreosAppPermissionsResponse,
  AllocateAnyAvailableTenantToOrganizationResponse,
  GetTenantByIdResponse,
  ListAllTenantsResponse,
  PermissionFileStatusResponse,
  GetAppsForCoreosUserResponse,
} from '../coreosagent/response.pb';
import {
  CreateCoreosAppRequest,
  AddCoreosAppPermissionsRequest,
  AddTenantToRegistryRequest,
  AllocateAnyAvailableTenantToOrganizationRequest,
  AssignAppToTenantAdminRequest,
  GetTenantByIdRequest,
  GetPermissionsUploadStatusRequest,
  GetAppsForCoreosUserRequest,
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
  ): Observable<AddCoreosAppPermissionsResponse>;

  /** tenant */

  addTenantToRegistry(
    request: AddTenantToRegistryRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  allocateAnyAvailableTenantToOrganization(
    request: AllocateAnyAvailableTenantToOrganizationRequest,
    metadata?: Metadata,
  ): Observable<AllocateAnyAvailableTenantToOrganizationResponse>;

  assignAppToTenantAdmin(
    request: AssignAppToTenantAdminRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  /** queries */

  getTenantById(
    request: GetTenantByIdRequest,
    metadata?: Metadata,
  ): Observable<GetTenantByIdResponse>;

  listAllTenants(
    request: Empty,
    metadata?: Metadata,
  ): Observable<ListAllTenantsResponse>;

  getAppPermissionsUploadStatus(
    request: GetPermissionsUploadStatusRequest,
    metadata?: Metadata,
  ): Observable<PermissionFileStatusResponse>;

  getAppsForCoreosUser(
    request: GetAppsForCoreosUserRequest,
    metadata?: Metadata,
  ): Observable<GetAppsForCoreosUserResponse>;
}

export interface CoreosAgentServiceController {
  /** commands */

  createCoreosApp(request: CreateCoreosAppRequest, metadata?: Metadata): void;

  addCoreosAppPermissions(
    request: AddCoreosAppPermissionsRequest,
    metadata?: Metadata,
  ):
    | Promise<AddCoreosAppPermissionsResponse>
    | Observable<AddCoreosAppPermissionsResponse>
    | AddCoreosAppPermissionsResponse;

  /** tenant */

  addTenantToRegistry(
    request: AddTenantToRegistryRequest,
    metadata?: Metadata,
  ): void;

  allocateAnyAvailableTenantToOrganization(
    request: AllocateAnyAvailableTenantToOrganizationRequest,
    metadata?: Metadata,
  ):
    | Promise<AllocateAnyAvailableTenantToOrganizationResponse>
    | Observable<AllocateAnyAvailableTenantToOrganizationResponse>
    | AllocateAnyAvailableTenantToOrganizationResponse;

  assignAppToTenantAdmin(
    request: AssignAppToTenantAdminRequest,
    metadata?: Metadata,
  ): void;

  /** queries */

  getTenantById(
    request: GetTenantByIdRequest,
    metadata?: Metadata,
  ):
    | Promise<GetTenantByIdResponse>
    | Observable<GetTenantByIdResponse>
    | GetTenantByIdResponse;

  listAllTenants(
    request: Empty,
    metadata?: Metadata,
  ):
    | Promise<ListAllTenantsResponse>
    | Observable<ListAllTenantsResponse>
    | ListAllTenantsResponse;

  getAppPermissionsUploadStatus(
    request: GetPermissionsUploadStatusRequest,
    metadata?: Metadata,
  ):
    | Promise<PermissionFileStatusResponse>
    | Observable<PermissionFileStatusResponse>
    | PermissionFileStatusResponse;

  getAppsForCoreosUser(
    request: GetAppsForCoreosUserRequest,
    metadata?: Metadata,
  ):
    | Promise<GetAppsForCoreosUserResponse>
    | Observable<GetAppsForCoreosUserResponse>
    | GetAppsForCoreosUserResponse;
}

export function CoreosAgentServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createCoreosApp',
      'addCoreosAppPermissions',
      'addTenantToRegistry',
      'allocateAnyAvailableTenantToOrganization',
      'assignAppToTenantAdmin',
      'getTenantById',
      'listAllTenants',
      'getAppPermissionsUploadStatus',
      'getAppsForCoreosUser',
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
