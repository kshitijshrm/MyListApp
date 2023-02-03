import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { stringify } from 'yaml';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/global.http.exception.filter';
import { GlobalGrpcToHttpExceptionInterceptor } from './common/interceptor/global.grpc.exception.interceptor';
import { GlobalResponseTransformInterceptor } from './common/interceptor/global.response.transformer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const basePath = '/app/console-api';
  app.setGlobalPrefix(basePath);
  app.enableCors();

  const openApiDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Developer Platform Console API')
      .setDescription(
        `
Console API is a <a href="https://learn.microsoft.com/en-us/azure/architecture/patterns/backends-for-frontends"> Backend for frontend </a> REST API that provides the data and functionality required by the Console UI.
`,
      )
      .setBasePath(basePath)
      .setVersion('1.0.0')
      .build(),
  );

  const openApiOptions: SwaggerDocumentOptions = {
    //  To make sure that the library generates operation names like createUser instead of UserController_createUser
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  };

  const openAPIObject = SwaggerModule.createDocument(
    app,
    openApiDocument,
    openApiOptions,
  );

  // TODO: write as yaml only on local build
  writeFileSync(
    './api__v1_developer_platform_console_api.yaml',
    stringify(openAPIObject),
  );

  SwaggerModule.setup(`${basePath}/docs`, app, openAPIObject, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new GlobalGrpcToHttpExceptionInterceptor());
  app.useGlobalInterceptors(new GlobalResponseTransformInterceptor());

  await app.listen(3000);
}

bootstrap();
