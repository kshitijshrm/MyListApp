import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { Observable, of, tap } from 'rxjs';
import { ServiceConstants } from '../constants/service.constants';
import jwtDecode from 'jwt-decode';
import { parse } from 'cache-control-parser';
import { Request } from 'express';
import { RedisConstants } from '../constants/redis.constants';

@Injectable()
export class GlobalCustomCacheInterceptor extends CacheInterceptor {
  constructor(
    readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const request = context.switchToHttp().getRequest();
    const path = httpAdapter.getRequestUrl(request);
    const authHeader = request.headers[
      ServiceConstants.access_token_header
    ] as string;
    if (authHeader) {
      const decodedToken: Record<string, any> = jwtDecode(authHeader);
      request.userId = decodedToken.userId;
      return `${path}::${decodedToken.userId}`;
    } else throw new BadRequestException('X-COREOS-ACCESS header is missing');
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    if (
      ServiceConstants.response_interceptor_skip_routes.findIndex((routeRe) =>
        new RegExp(routeRe).test(request.originalUrl),
      ) !== -1 ||
      request.method !== 'GET'
    ) {
      return next.handle();
    }

    let serveCachedResponse = true;
    const cacheControlHeader = request.headers[
      ServiceConstants.cache_control_header
    ] as string;
    if (cacheControlHeader) {
      const cacheControlDirectives = parse(cacheControlHeader);
      if (
        cacheControlDirectives['no-cache'] ||
        cacheControlDirectives['no-store']
      ) {
        serveCachedResponse = false;
        await this.cacheManager.del(
          RedisConstants.getTenantConfigKey(request.params.tenantId),
        );
      }
    }

    const key = this.trackBy(context);
    if (!key) {
      return next.handle();
    }
    if (serveCachedResponse) {
      const cachedResponse = await this.cacheManager.get(key);
      if (cachedResponse) {
        // Deserialize cached response
        return of(JSON.parse(cachedResponse));
      }
    }

    return next.handle().pipe(
      tap(async (response) => {
        // Serialize response before caching
        await this.cacheManager.set(key, JSON.stringify(response));
      }),
    );
  }
}
