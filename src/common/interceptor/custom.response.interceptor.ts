import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GetAllSubscriptionsResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data) => {
        return {
          data: instanceToPlain(data.subscriptions),
          additionalInfo: {
            isSettingsAvailable: data.isSettingsAvailable,
          },
          request: {
            url: request.originalUrl,
            method: request.method,
            params: request.params,
            query: request.query,
            body: request.body,
          },
        };
      }),
    );
  }

  checkIfVersionIdIsAppVersion(params: Record<string, any>): boolean {
    const { versionId, versionId1, versionId2 } = params;
    if (
      (versionId && versionId.includes('appversion')) ||
      (versionId1 &&
        versionId2 &&
        versionId1.includes('appversion') &&
        versionId2.includes('appversion'))
    )
      return true;

    return false;
  }
}
