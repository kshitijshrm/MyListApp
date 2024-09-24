import { DateTime } from 'luxon';
import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ServiceConstants } from '../constants/service.constants';
import jwtDecode from 'jwt-decode';

@Injectable()
export class GetTenantBannersRequestInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (
      !new RegExp('/app/console-api/common/banners').test(request.originalUrl)
    ) {
      return next.handle();
    }

    const authHeader = request.headers[
      ServiceConstants.access_token_header
    ] as string;
    if (authHeader) {
      const decodedToken: Record<string, any> = jwtDecode(authHeader);
      if (decodedToken.exp > DateTime.now().toUnixInteger()) {
        throw new UnauthorizedException();
      }
      if (!decodedToken.tenantId) {
        throw new UnauthorizedException(`Malformed token`);
      }
      request.tenantId = decodedToken.tenantId;
    } else throw new BadRequestException('X-COREOS-ACCESS header is missing');

    return next.handle();
  }
}
