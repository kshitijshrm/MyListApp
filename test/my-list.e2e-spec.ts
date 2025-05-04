import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ServiceConstants } from '../src/common/constants/service.constants';

describe('MyListController (e2e)', () => {
  let app: INestApplication;
  let mongoMemoryServer: MongoMemoryServer;
  const userId = 'test-user-id';
  const testMovie = {
    contentId: 'movie123',
    contentType: 'movie',
    title: 'Test Movie',
    description: 'A test movie',
    genres: ['Action', 'Drama']
  };

  const testTVShow = {
    contentId: 'tvshow456',
    contentType: 'tvshow',
    title: 'Test TV Show',
    description: 'A test TV show',
    genres: ['Comedy', 'Romance']
  };

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
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoMemoryServer.stop();
  });

  describe('POST /my-list', () => {
    it('should add an item to My List', () => {
      return request(app.getHttpServer())
        .post('/my-list')
        .set(ServiceConstants.userId_header, userId)
        .send(testMovie)
        .expect(201)
        .then(response => {
          expect(response.body).toHaveProperty('userId', userId);
          expect(response.body).toHaveProperty('contentId', testMovie.contentId);
          expect(response.body).toHaveProperty('title', testMovie.title);
          expect(response.body).toHaveProperty('description', testMovie.description);
          expect(response.body).toHaveProperty('genres');
          expect(response.body.genres).toEqual(expect.arrayContaining(testMovie.genres));
          expect(response.body).toHaveProperty('addedAt');
        });
    });

    it('should add a second item to My List', () => {
      return request(app.getHttpServer())
        .post('/my-list')
        .set(ServiceConstants.userId_header, userId)
        .send(testTVShow)
        .expect(201)
        .then(response => {
          expect(response.body).toHaveProperty('userId', userId);
          expect(response.body).toHaveProperty('contentId', testTVShow.contentId);
          expect(response.body).toHaveProperty('title', testTVShow.title);
        });
    });

    it('should return existing item when adding duplicate item', () => {
      return request(app.getHttpServer())
        .post('/my-list')
        .set(ServiceConstants.userId_header, userId)
        .send(testMovie)
        .expect(201) // Still returns 201 but doesn't create a duplicate
        .then(response => {
          expect(response.body).toHaveProperty('userId', userId);
          expect(response.body).toHaveProperty('contentId', testMovie.contentId);
          expect(response.body).toHaveProperty('title', testMovie.title);
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/my-list')
        .set(ServiceConstants.userId_header, userId)
        .send({
          // Missing required fields
          description: 'Invalid item'
        })
        .expect(400);
    });

    it('should validate content type enum', () => {
      return request(app.getHttpServer())
        .post('/my-list')
        .set(ServiceConstants.userId_header, userId)
        .send({
          contentId: 'invalid123',
          contentType: 'invalid-type', // Invalid enum value
          title: 'Invalid Type'
        })
        .expect(400);
    });
  });

  describe('GET /my-list', () => {
    it('should get My List with default pagination', () => {
      return request(app.getHttpServer())
        .get('/my-list')
        .set(ServiceConstants.userId_header, userId)
        .expect(200)
        .then(response => {
          expect(response.body).toHaveProperty('items');
          expect(response.body).toHaveProperty('total');
          expect(response.body).toHaveProperty('page');
          expect(response.body).toHaveProperty('limit');
          expect(response.body).toHaveProperty('pages');
          expect(response.body.items.length).toBe(2);
          expect(response.body.total).toBe(2);
        });
    });

    it('should get My List with custom pagination', () => {
      return request(app.getHttpServer())
        .get('/my-list?page=1&limit=1')
        .set(ServiceConstants.userId_header, userId)
        .expect(200)
        .then(response => {
          expect(response.body).toHaveProperty('items');
          expect(response.body.items.length).toBe(1);
          expect(response.body.page).toBe(1);
          expect(response.body.limit).toBe(1);
          expect(response.body.pages).toBe(2);
        });
    });

    it('should get second page of My List with custom pagination', () => {
      return request(app.getHttpServer())
        .get('/my-list?page=2&limit=1')
        .set(ServiceConstants.userId_header, userId)
        .expect(200)
        .then(response => {
          expect(response.body).toHaveProperty('items');
          expect(response.body.items.length).toBe(1);
          expect(response.body.page).toBe(2);
          expect(response.body.limit).toBe(1);
        });
    });

    it('should return empty array for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/my-list')
        .set(ServiceConstants.userId_header, 'non-existent-user')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveProperty('items');
          expect(response.body.items.length).toBe(0);
          expect(response.body.total).toBe(0);
        });
    });

    it('should validate pagination parameters', () => {
      return request(app.getHttpServer())
        .get('/my-list?page=invalid&limit=invalid')
        .set(ServiceConstants.userId_header, userId)
        .expect(400);
    });
  });

  describe('GET /my-list/:contentId/status', () => {
    it('should check if item is in My List (true case)', () => {
      return request(app.getHttpServer())
        .get(`/my-list/${testMovie.contentId}/status`)
        .set(ServiceConstants.userId_header, userId)
        .expect(200)
        .then(response => {
          expect(response.body).toHaveProperty('inMyList', true);
        });
    });

    it('should check if item is in My List (false case)', () => {
      return request(app.getHttpServer())
        .get('/my-list/non-existent-id/status')
        .set(ServiceConstants.userId_header, userId)
        .expect(200)
        .then(response => {
          expect(response.body).toHaveProperty('inMyList', false);
        });
    });
  });

  describe('DELETE /my-list/:contentId', () => {
    it('should remove item from My List', () => {
      return request(app.getHttpServer())
        .delete(`/my-list/${testMovie.contentId}`)
        .set(ServiceConstants.userId_header, userId)
        .expect(204);
    });

    it('should verify item was removed', () => {
      return request(app.getHttpServer())
        .get(`/my-list/${testMovie.contentId}/status`)
        .set(ServiceConstants.userId_header, userId)
        .expect(200)
        .then(response => {
          expect(response.body).toHaveProperty('inMyList', false);
        });
    });

    it('should return 404 when removing non-existent item', () => {
      return request(app.getHttpServer())
        .delete('/my-list/non-existent-id')
        .set(ServiceConstants.userId_header, userId)
        .expect(404);
    });
  });

  describe('Multiple users', () => {
    const anotherUserId = 'another-user-id';

    it('should add item to another user\'s list', () => {
      return request(app.getHttpServer())
        .post('/my-list')
        .set(ServiceConstants.userId_header, anotherUserId)
        .send(testMovie)
        .expect(201);
    });

    it('should not affect original user\'s list', () => {
      return request(app.getHttpServer())
        .get('/my-list')
        .set(ServiceConstants.userId_header, userId)
        .expect(200)
        .then(response => {
          // Original user should still have only the TV show
          expect(response.body.items.length).toBe(1);
          expect(response.body.items[0].contentId).toBe(testTVShow.contentId);
        });
    });

    it('should get another user\'s list', () => {
      return request(app.getHttpServer())
        .get('/my-list')
        .set(ServiceConstants.userId_header, anotherUserId)
        .expect(200)
        .then(response => {
          expect(response.body.items.length).toBe(1);
          expect(response.body.items[0].contentId).toBe(testMovie.contentId);
        });
    });
  });
});
