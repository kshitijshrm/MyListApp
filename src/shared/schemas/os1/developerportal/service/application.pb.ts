/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  RegisterApplicationResponse,
  AddApplicationVersionResponse,
  GetApplicationByVersionIdResponse,
  GetApplicationByApplicationIdResponse,
  ListApplicationsByOrgTeamResponse,
  GetApplicationByUrlPathResponse,
} from '../application/response.pb';
import { Empty } from '../../../google/protobuf/empty.pb';
import {
  RegisterApplicationRequest,
  AddApplicationVersionRequest,
  ClassifyApplicationRequest,
  ApplicationUrlOverridesRequest,
  UpsertApplicationIconRequest,
  AddApplicationDocumentRequest,
  DeleteApplicationDocumentRequest,
  ChangeApplicationDisplayAttributesRequest,
  ApplicationLifeCycleTransitionRequest,
  GetApplicationByVersionIdRequest,
  GetApplicationByApplicationIdRequest,
  ListApplicationsByOrgTeamRequest,
  GetApplicationByUrlPathRequest,
} from '../application/request.pb';

export const protobufPackage = 'os1.developerportal.service';

export const OS1_DEVELOPERPORTAL_SERVICE_PACKAGE_NAME =
  'os1.developerportal.service';

export interface ApplicationServiceClient {
  /** commands */

  registerApplication(
    request: RegisterApplicationRequest,
    metadata?: Metadata,
  ): Observable<RegisterApplicationResponse>;

  addApplicationVersion(
    request: AddApplicationVersionRequest,
    metadata?: Metadata,
  ): Observable<AddApplicationVersionResponse>;

  classifyApplication(
    request: ClassifyApplicationRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  addUrlOverride(
    request: ApplicationUrlOverridesRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  deleteUrlOverride(
    request: ApplicationUrlOverridesRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  /** file upload and deletion commands */

  addApplicationIcon(
    request: UpsertApplicationIconRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  replaceApplicationIcon(
    request: UpsertApplicationIconRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  addApplicationDocument(
    request: AddApplicationDocumentRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  deleteApplicationDocument(
    request: DeleteApplicationDocumentRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  changeApplicationDisplayAttributes(
    request: ChangeApplicationDisplayAttributesRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  /** app review workflow commands */

  submitForTechReview(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  approveTechReview(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  declineTechReview(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  withdrawTechReview(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  submitForInternalPublishReview(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  submitForMarketplacePublishReview(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  approveInternalPublish(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  approveMarketplacePublish(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  depreciate(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  /** queries */

  getApplicationByVersionId(
    request: GetApplicationByVersionIdRequest,
    metadata?: Metadata,
  ): Observable<GetApplicationByVersionIdResponse>;

  getApplicationByApplicationId(
    request: GetApplicationByApplicationIdRequest,
    metadata?: Metadata,
  ): Observable<GetApplicationByApplicationIdResponse>;

  listApplicationsByOrgTeamId(
    request: ListApplicationsByOrgTeamRequest,
    metadata?: Metadata,
  ): Observable<ListApplicationsByOrgTeamResponse>;

  getApplicationByUrlPath(
    request: GetApplicationByUrlPathRequest,
    metadata?: Metadata,
  ): Observable<GetApplicationByUrlPathResponse>;
}

export interface ApplicationServiceController {
  /** commands */

  registerApplication(
    request: RegisterApplicationRequest,
    metadata?: Metadata,
  ):
    | Promise<RegisterApplicationResponse>
    | Observable<RegisterApplicationResponse>
    | RegisterApplicationResponse;

  addApplicationVersion(
    request: AddApplicationVersionRequest,
    metadata?: Metadata,
  ):
    | Promise<AddApplicationVersionResponse>
    | Observable<AddApplicationVersionResponse>
    | AddApplicationVersionResponse;

  classifyApplication(
    request: ClassifyApplicationRequest,
    metadata?: Metadata,
  ): void;

  addUrlOverride(
    request: ApplicationUrlOverridesRequest,
    metadata?: Metadata,
  ): void;

  deleteUrlOverride(
    request: ApplicationUrlOverridesRequest,
    metadata?: Metadata,
  ): void;

  /** file upload and deletion commands */

  addApplicationIcon(
    request: UpsertApplicationIconRequest,
    metadata?: Metadata,
  ): void;

  replaceApplicationIcon(
    request: UpsertApplicationIconRequest,
    metadata?: Metadata,
  ): void;

  addApplicationDocument(
    request: AddApplicationDocumentRequest,
    metadata?: Metadata,
  ): void;

  deleteApplicationDocument(
    request: DeleteApplicationDocumentRequest,
    metadata?: Metadata,
  ): void;

  changeApplicationDisplayAttributes(
    request: ChangeApplicationDisplayAttributesRequest,
    metadata?: Metadata,
  ): void;

  /** app review workflow commands */

  submitForTechReview(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  approveTechReview(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  declineTechReview(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  withdrawTechReview(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  submitForInternalPublishReview(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  submitForMarketplacePublishReview(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  approveInternalPublish(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  approveMarketplacePublish(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  depreciate(
    request: ApplicationLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  /** queries */

  getApplicationByVersionId(
    request: GetApplicationByVersionIdRequest,
    metadata?: Metadata,
  ):
    | Promise<GetApplicationByVersionIdResponse>
    | Observable<GetApplicationByVersionIdResponse>
    | GetApplicationByVersionIdResponse;

  getApplicationByApplicationId(
    request: GetApplicationByApplicationIdRequest,
    metadata?: Metadata,
  ):
    | Promise<GetApplicationByApplicationIdResponse>
    | Observable<GetApplicationByApplicationIdResponse>
    | GetApplicationByApplicationIdResponse;

  listApplicationsByOrgTeamId(
    request: ListApplicationsByOrgTeamRequest,
    metadata?: Metadata,
  ):
    | Promise<ListApplicationsByOrgTeamResponse>
    | Observable<ListApplicationsByOrgTeamResponse>
    | ListApplicationsByOrgTeamResponse;

  getApplicationByUrlPath(
    request: GetApplicationByUrlPathRequest,
    metadata?: Metadata,
  ):
    | Promise<GetApplicationByUrlPathResponse>
    | Observable<GetApplicationByUrlPathResponse>
    | GetApplicationByUrlPathResponse;
}

export function ApplicationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'registerApplication',
      'addApplicationVersion',
      'classifyApplication',
      'addUrlOverride',
      'deleteUrlOverride',
      'addApplicationIcon',
      'replaceApplicationIcon',
      'addApplicationDocument',
      'deleteApplicationDocument',
      'changeApplicationDisplayAttributes',
      'submitForTechReview',
      'approveTechReview',
      'declineTechReview',
      'withdrawTechReview',
      'submitForInternalPublishReview',
      'submitForMarketplacePublishReview',
      'approveInternalPublish',
      'approveMarketplacePublish',
      'depreciate',
      'getApplicationByVersionId',
      'getApplicationByApplicationId',
      'listApplicationsByOrgTeamId',
      'getApplicationByUrlPath',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('ApplicationService', method)(
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
      GrpcStreamMethod('ApplicationService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const APPLICATION_SERVICE_NAME = 'ApplicationService';
