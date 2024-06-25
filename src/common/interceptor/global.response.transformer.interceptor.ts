import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ServiceConstants } from '../constants/service.constants';

@Injectable()
export class GlobalResponseTransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // skip response transformation for health check and ping
    if (
      ServiceConstants.response_interceptor_skip_routes.findIndex((routeRe) =>
        new RegExp(routeRe).test(request.originalUrl),
      ) !== -1
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((data) => {
        if (request.method == 'GET')
          response.set('Cache-Control', 'private, max-age=10800');
      }),
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
