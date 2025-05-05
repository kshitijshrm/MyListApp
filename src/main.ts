import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/global.http.exception.filter';
import { GlobalResponseTransformInterceptor } from './common/interceptor/global.response.transformer.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
    bufferLogs: true,
  });
  const basePath = '/app/list-api';
  app.setGlobalPrefix(basePath);
  app.enableCors();

  // Apply global filters and interceptors before Swagger setup
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new GlobalResponseTransformInterceptor());


  await app.listen(process.env.PORT, '0.0.0.0');
  console.log(`Application is running on: ${process.env.PORT}${basePath}`);
}

bootstrap();
