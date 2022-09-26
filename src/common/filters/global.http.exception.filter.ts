import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  logger = new Logger(this.constructor.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception, exception.stack);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    response.status(status).json({
      error: {
        code: '',
        description: message,
        additionalInfo: [],
        statusCode: status,
        timestamp: new Date().toISOString(),
      },
      request: {
        url: request.originalUrl,
        method: request.method,
        params: request.params,
        query: request.query,
        body: request.body,
      },
    });
  }
}
