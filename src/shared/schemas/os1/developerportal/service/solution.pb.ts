/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {
  RegisterSolutionResponse,
  AddSolutionVersionResponse,
  GetSolutionByVersionIdResponse,
  GetSolutionBySolutionIdResponse,
  ListSolutionsByOrgResponse,
} from '../solution/response.pb';
import { Empty } from '../../../google/protobuf/empty.pb';
import {
  RegisterSolutionRequest,
  AddSolutionVersionRequest,
  UpsertSolutionIconRequest,
  AddSolutionImageRequest,
  RemoveSolutionImageRequest,
  AddSolutionDocumentRequest,
  RemoveSolutionDocumentRequest,
  AddSolutionConfigurationFileRequest,
  AddApplicationToSolutionRequest,
  RemoveApplicationFromSolutionRequest,
  ChangeSolutionDisplayAttributesRequest,
  ChangeSolutionTermsRequest,
  ClassifySolutionRequest,
  SolutionLifeCycleTransitionRequest,
  GetSolutionByVersionIdRequest,
  GetSolutionBySolutionIdRequest,
  ListSolutionsByOrgRequest,
} from '../solution/request.pb';

export const protobufPackage = 'os1.developerportal.service';

export const OS1_DEVELOPERPORTAL_SERVICE_PACKAGE_NAME =
  'os1.developerportal.service';

export interface SolutionServiceClient {
  /** commands */

  registerSolution(
    request: RegisterSolutionRequest,
    metadata?: Metadata,
  ): Observable<RegisterSolutionResponse>;

  addSolutionVersion(
    request: AddSolutionVersionRequest,
    metadata?: Metadata,
  ): Observable<AddSolutionVersionResponse>;

  /** attributes */

  addSolutionIcon(
    request: UpsertSolutionIconRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  replaceSolutionIcon(
    request: UpsertSolutionIconRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  addSolutionImage(
    request: AddSolutionImageRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  removeSolutionImage(
    request: RemoveSolutionImageRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  addSolutionDocument(
    request: AddSolutionDocumentRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  removeSolutionDocument(
    request: RemoveSolutionDocumentRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  addSolutionConfigurationFile(
    request: AddSolutionConfigurationFileRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  addApplicationToSolution(
    request: AddApplicationToSolutionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  removeApplicationFromSolution(
    request: RemoveApplicationFromSolutionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  changeSolutionDisplayAttributes(
    request: ChangeSolutionDisplayAttributesRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  changeSolutionTerms(
    request: ChangeSolutionTermsRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  classifySolution(
    request: ClassifySolutionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  /** solution review workflow commands */

  submitForTechReview(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  approveTechReview(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  declineTechReview(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  withdrawTechReview(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  submitForInternalPublishReview(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  submitForMarketplacePublishReview(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  approveInternalPublish(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  approveMarketplacePublish(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  depreciate(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): Observable<Empty>;

  /** queries */

  getSolutionByVersionId(
    request: GetSolutionByVersionIdRequest,
    metadata?: Metadata,
  ): Observable<GetSolutionByVersionIdResponse>;

  getSolutionBySolutionId(
    request: GetSolutionBySolutionIdRequest,
    metadata?: Metadata,
  ): Observable<GetSolutionBySolutionIdResponse>;

  listSolutionsByOrgId(
    request: ListSolutionsByOrgRequest,
    metadata?: Metadata,
  ): Observable<ListSolutionsByOrgResponse>;
}

export interface SolutionServiceController {
  /** commands */

  registerSolution(
    request: RegisterSolutionRequest,
    metadata?: Metadata,
  ):
    | Promise<RegisterSolutionResponse>
    | Observable<RegisterSolutionResponse>
    | RegisterSolutionResponse;

  addSolutionVersion(
    request: AddSolutionVersionRequest,
    metadata?: Metadata,
  ):
    | Promise<AddSolutionVersionResponse>
    | Observable<AddSolutionVersionResponse>
    | AddSolutionVersionResponse;

  /** attributes */

  addSolutionIcon(
    request: UpsertSolutionIconRequest,
    metadata?: Metadata,
  ): void;

  replaceSolutionIcon(
    request: UpsertSolutionIconRequest,
    metadata?: Metadata,
  ): void;

  addSolutionImage(request: AddSolutionImageRequest, metadata?: Metadata): void;

  removeSolutionImage(
    request: RemoveSolutionImageRequest,
    metadata?: Metadata,
  ): void;

  addSolutionDocument(
    request: AddSolutionDocumentRequest,
    metadata?: Metadata,
  ): void;

  removeSolutionDocument(
    request: RemoveSolutionDocumentRequest,
    metadata?: Metadata,
  ): void;

  addSolutionConfigurationFile(
    request: AddSolutionConfigurationFileRequest,
    metadata?: Metadata,
  ): void;

  addApplicationToSolution(
    request: AddApplicationToSolutionRequest,
    metadata?: Metadata,
  ): void;

  removeApplicationFromSolution(
    request: RemoveApplicationFromSolutionRequest,
    metadata?: Metadata,
  ): void;

  changeSolutionDisplayAttributes(
    request: ChangeSolutionDisplayAttributesRequest,
    metadata?: Metadata,
  ): void;

  changeSolutionTerms(
    request: ChangeSolutionTermsRequest,
    metadata?: Metadata,
  ): void;

  classifySolution(request: ClassifySolutionRequest, metadata?: Metadata): void;

  /** solution review workflow commands */

  submitForTechReview(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  approveTechReview(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  declineTechReview(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  withdrawTechReview(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  submitForInternalPublishReview(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  submitForMarketplacePublishReview(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  approveInternalPublish(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  approveMarketplacePublish(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  depreciate(
    request: SolutionLifeCycleTransitionRequest,
    metadata?: Metadata,
  ): void;

  /** queries */

  getSolutionByVersionId(
    request: GetSolutionByVersionIdRequest,
    metadata?: Metadata,
  ):
    | Promise<GetSolutionByVersionIdResponse>
    | Observable<GetSolutionByVersionIdResponse>
    | GetSolutionByVersionIdResponse;

  getSolutionBySolutionId(
    request: GetSolutionBySolutionIdRequest,
    metadata?: Metadata,
  ):
    | Promise<GetSolutionBySolutionIdResponse>
    | Observable<GetSolutionBySolutionIdResponse>
    | GetSolutionBySolutionIdResponse;

  listSolutionsByOrgId(
    request: ListSolutionsByOrgRequest,
    metadata?: Metadata,
  ):
    | Promise<ListSolutionsByOrgResponse>
    | Observable<ListSolutionsByOrgResponse>
    | ListSolutionsByOrgResponse;
}

export function SolutionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'registerSolution',
      'addSolutionVersion',
      'addSolutionIcon',
      'replaceSolutionIcon',
      'addSolutionImage',
      'removeSolutionImage',
      'addSolutionDocument',
      'removeSolutionDocument',
      'addSolutionConfigurationFile',
      'addApplicationToSolution',
      'removeApplicationFromSolution',
      'changeSolutionDisplayAttributes',
      'changeSolutionTerms',
      'classifySolution',
      'submitForTechReview',
      'approveTechReview',
      'declineTechReview',
      'withdrawTechReview',
      'submitForInternalPublishReview',
      'submitForMarketplacePublishReview',
      'approveInternalPublish',
      'approveMarketplacePublish',
      'depreciate',
      'getSolutionByVersionId',
      'getSolutionBySolutionId',
      'listSolutionsByOrgId',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('SolutionService', method)(
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
      GrpcStreamMethod('SolutionService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const SOLUTION_SERVICE_NAME = 'SolutionService';
