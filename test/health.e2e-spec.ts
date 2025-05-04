import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('HealthController (e2e)', () => {
  let app: INestApplication;
  let mongoMemoryServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoMemoryServer.stop();
  });

  it('/health (GET) should return health status', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('details');

        // Check MongoDB health
        expect(response.body.details).toHaveProperty('mongodb');
        expect(response.body.details.mongodb).toHaveProperty('status');

        // Check Redis health (might be down in test environment)
        expect(response.body.details).toHaveProperty('redis');

        // Check environment variables
        expect(response.body.details).toHaveProperty('environmentVariables');
      });
  });
});