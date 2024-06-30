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
import { RedisConstants } from '../constants/redis.constants';
import { getTenantIdFromRequest } from '../utils/util';
import { getFeatureFlags } from 'src/configuration/feature.flag';

@Injectable()
export class GlobalCustomCacheInterceptor extends CacheInterceptor {
  featureFlags: any;

  constructor(
    readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
  ) {
    super(cacheManager, reflector);
    this.featureFlags = getFeatureFlags();
  }

  trackBy(context: ExecutionContext): string | undefined {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const request = context.switchToHttp().getRequest();
    const path = httpAdapter.getRequestUrl(request);
    // Using sid (session Id) from the token ensures that a new response is cached every time user re-login.
    // If permissions/access has changed between logins, the updated response from the APIs is expected
    return `${path}::${request.sid}`;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const now = Date.now();
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers[
      ServiceConstants.access_token_header
    ] as string;
    if (authHeader) {
      const decodedToken: Record<string, any> = jwtDecode(authHeader);
      request.userId = decodedToken.userId;
      request.sid = decodedToken.sid;
    } else throw new BadRequestException('X-COREOS-ACCESS header is missing');

    const tenantId = getTenantIdFromRequest(request);
    if (tenantId) {
      if (!this.featureFlags.abTestTenants.includes(tenantId)) {
        if (!this.featureFlags.autoCachingEnabled) return next.handle();
      }
    }

    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';

    if (
      !isGetRequest ||
      (isGetRequest &&
        ServiceConstants.cache_interceptor_skip_routes.find((routeRe) =>
          new RegExp(routeRe).test(request.originalUrl),
        ))
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

    if (serveCachedResponse && key) {
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
