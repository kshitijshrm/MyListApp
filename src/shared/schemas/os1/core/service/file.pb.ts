/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import { CreateFileResponse } from '../file/response.pb';
import { File } from '../file/file.pb';
import { CreateFileRequest, GetFileRequest } from '../file/request.pb';

export const protobufPackage = 'os1.core.service';

export const OS1_CORE_SERVICE_PACKAGE_NAME = 'os1.core.service';

export interface FileServiceClient {
  createFile(
    request: CreateFileRequest,
    metadata?: Metadata,
  ): Observable<CreateFileResponse>;

  getFile(request: GetFileRequest, metadata?: Metadata): Observable<File>;
}

export interface FileServiceController {
  createFile(
    request: CreateFileRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateFileResponse>
    | Observable<CreateFileResponse>
    | CreateFileResponse;

  getFile(
    request: GetFileRequest,
    metadata?: Metadata,
  ): Promise<File> | Observable<File> | File;
}

export function FileServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createFile', 'getFile'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('FileService', method)(
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
      GrpcStreamMethod('FileService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const FILE_SERVICE_NAME = 'FileService';
