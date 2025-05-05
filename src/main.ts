import 'reflect-metadata';
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

  // Create a simpler Swagger config

  // try {
  //   // Create a simpler Swagger config
  //   const config = new DocumentBuilder()
  //     .setTitle("Developer Platform Marketplace API")
  //     .setDescription("APIs for marketplace client")
  //     .setVersion("1.0.0")
  //     .addTag("api")
  //     .build();

  //   // Define explicit options for Swagger
  //   const options: SwaggerDocumentOptions = {
  //     operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  //   };

  //   // Create document with explicit options
  //   const document = SwaggerModule.createDocument(app, config, options);

  //   // Write to file (optional)
  //   writeFileSync('./api__v1_list_api.yaml', stringify(document));

  //   // Setup Swagger UI
  //   SwaggerModule.setup(`${basePath}/docs`, app, document);
  // } catch (error) {
  //   console.error('Swagger setup error:', error);
  //   // Continue even if Swagger fails
  // }



  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: http://localhost:3000${basePath}`);
}

bootstrap();
