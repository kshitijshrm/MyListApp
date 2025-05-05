import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConfigModule } from '@nestjs/config';
import { ServiceConstants } from '../src/common/constants/service.constants';
import { GlobalHttpExceptionFilter } from '../src/common/filters/global.http.exception.filter';
import { GlobalResponseTransformInterceptor } from '../src/common/interceptor/global.response.transformer.interceptor';

describe('HealthController (e2e)', () => {
  let app: INestApplication;
  let mongoMemoryServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();

    // Set the MONGO_URI environment variable for the health check
    process.env.MONGO_URI = uri;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          // Load environment variables from test environment
          ignoreEnvFile: true,
          // Provide required environment variables
          load: [() => ({
            MONGO_URI: uri,
            // Add any other required environment variables here
          })],
        }),
        MongooseModule.forRoot(uri),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Set up the app with the same global filters and interceptors as in main.ts
    app.useGlobalFilters(new GlobalHttpExceptionFilter());
    app.useGlobalInterceptors(new GlobalResponseTransformInterceptor());

    // Set the base path to match the main application
    const basePath = '/app/list-api';
    app.setGlobalPrefix(basePath);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoMemoryServer.stop();
  });

  it('/health (GET) should return health status', () => {
    // Note: The health endpoint should be excluded from requiring the user ID header
    // in the GlobalCustomCacheInterceptor, but let's add it just in case
    return request(app.getHttpServer())
      .get('/app/list-api/health')  // Use the full path with prefix
      .set(ServiceConstants.userId_header, 'test-user-id')  // Add the user ID header
      .expect(200)
      .then(response => {
        console.log('Health check response:', JSON.stringify(response.body, null, 2));

        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('details');

        // Check MongoDB health
        expect(response.body.details).toHaveProperty('mongodb');
        expect(response.body.details.mongodb).toHaveProperty('status');
        expect(response.body.details.mongodb.status).toBe('up');

        // Check environment variables
        expect(response.body.details).toHaveProperty('environmentVariables');
        expect(response.body.details.environmentVariables).toHaveProperty('status');
        expect(response.body.details.environmentVariables.status).toBe('up');
      });
  });
});
