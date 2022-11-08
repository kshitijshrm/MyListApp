import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceConstants } from '../constants/service.constants';

@Injectable()
export class GlobalResponseTransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // skip response transformation for health check and ping
    if (
      ServiceConstants.global_filter_skip_routes.includes(request.originalUrl)
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        return {
          data: instanceToPlain(data),
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
}
