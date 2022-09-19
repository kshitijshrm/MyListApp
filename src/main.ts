import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/global.http.exception.filter';
import { GlobalGrpcToHttpExceptionInterceptor } from './common/interceptor/global.grpc.exception.interceptor';
import { GlobalResponseTransformInterceptor } from './common/interceptor/global.response.transformer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/app/console-api');

  app.enableCors();
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Developer Platform Console API')
      .setDescription('APIs for console client')
      .setVersion('1.0.0')
      .addTag('api')
      .build(),
  );
  SwaggerModule.setup('/app/console-api/docs', app, document);

  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new GlobalGrpcToHttpExceptionInterceptor());
  app.useGlobalInterceptors(new GlobalResponseTransformInterceptor());

  await app.listen(3000);
}

bootstrap();
