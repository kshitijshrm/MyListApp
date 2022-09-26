import { GrpcErrorStatus } from '@foxtrotplatform/developer-platform-core-lib';
import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throws } from 'assert';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GlobalGrpcToHttpExceptionInterceptor implements NestInterceptor {
  logger = new Logger(this.constructor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        switch (error.code) {
          case GrpcErrorStatus.NOT_FOUND:
            throw new NotFoundException(error.message);
          case GrpcErrorStatus.INVALID_ARGUMENT:
            throw new BadRequestException(error.message);
          case GrpcErrorStatus.ALREADY_EXISTS:
            throw new ConflictException(error.message);
          case GrpcErrorStatus.UNAUTHENTICATED:
          case GrpcErrorStatus.PERMISSION_DENIED:
            throw new ForbiddenException(error.message);
          case GrpcErrorStatus.ABORTED:
          case GrpcErrorStatus.RESOURCE_EXHAUSTED:
            throw new RequestTimeoutException(error.message);
          case GrpcErrorStatus.UNKNOWN:
          case GrpcErrorStatus.INTERNAL:
          case GrpcErrorStatus.UNAVAILABLE:
          case GrpcErrorStatus.DEADLINE_EXCEEDED:
          case GrpcErrorStatus.FAILED_PRECONDITION:
          case GrpcErrorStatus.OUT_OF_RANGE:
          case GrpcErrorStatus.CANCELLED:
          case GrpcErrorStatus.DATA_LOSS:
            throw new InternalServerErrorException(error.message);
        }
        throw error;
      }),
    );
  }
}
