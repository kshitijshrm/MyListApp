import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ServiceConstants } from '../src/common/constants/service.constants';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { MyListService } from '../src/list/my-list.service';

// Increase Jest timeout for all tests in this file
jest.setTimeout(30000); // 30 seconds

describe('MyListController (e2e)', () => {
  let app: INestApplication;
  let mongoMemoryServer: MongoMemoryServer;
  let mongoConnection: Connection;
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
        // Override any cache configuration to disable caching during tests
        CacheModule.register({
          isGlobal: true,
          ttl: 0, // Disable caching
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    // Get the MongoDB connection
    mongoConnection = moduleFixture.get(getConnectionToken());

    // Verify connection is working
    if (!mongoConnection || !mongoConnection.db) {
      throw new Error('MongoDB connection not established');
    }

    console.log('MongoDB connection established successfully');
  });

  afterAll(async () => {
    await app.close();
    await mongoMemoryServer.stop();
  });

  // Clear the database between each test
  afterEach(async () => {
    try {
      const collections = mongoConnection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
      console.log('Database cleared successfully');
    } catch (error) {
      console.error('Error clearing database:', error);
    }
  });

  it('should verify MongoDB connection is working', async () => {
    // Check if we can perform basic MongoDB operations
    const collection = mongoConnection.collection('test_collection');

    // Insert a document
    await collection.insertOne({ test: 'data' });

    // Find the document
    const found = await collection.findOne({ test: 'data' });

    // Verify it was found
    expect(found).toBeTruthy();
    expect(found.test).toBe('data');

    // Clean up
    await collection.deleteMany({});
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
    // Add setup for this specific test suite
    beforeEach(async () => {
      // First clear any existing data
      const collections = mongoConnection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }

      // Add test items for the main user
      await request(app.getHttpServer())
        .post('/my-list')
        .set(ServiceConstants.userId_header, userId)
        .send(testMovie);

      await request(app.getHttpServer())
        .post('/my-list')
        .set(ServiceConstants.userId_header, userId)
        .send(testTVShow);
    });

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

    // Create a separate describe block just for this test
    describe('Non-existent user test', () => {
      // Setup specific for this test
      beforeEach(async () => {
        // Explicitly clear the database
        try {
          const collections = mongoConnection.collections;
          for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
          }
          console.log('Database cleared successfully');

          // Verify the database is empty
          const debugCollection = mongoConnection.collection('my_list');
          const count = await debugCollection.countDocuments({});
          console.log('Database document count after clearing:', count);

          if (count > 0) {
            throw new Error('Database was not properly cleared before test');
          }
        } catch (error) {
          console.error('Error clearing database:', error);
          throw error; // Re-throw to fail the test
        }
      });

      it('should return empty array for non-existent user', async () => {
        // Debug: Check what's in the database before the request
        const debugCollection = mongoConnection.collection('my_list');
        const allDocs = await debugCollection.find({}).toArray();
        console.log('Documents in database before test:',
          allDocs.map(doc => ({ userId: doc.userId, contentId: doc.contentId })));

        // Make the request
        const response = await request(app.getHttpServer())
          .get('/my-list')
          .set(ServiceConstants.userId_header, 'completely-new-non-existent-user')
          .expect(200);

        // Log the full response for debugging
        console.log('Full response body:', JSON.stringify(response.body, null, 2));

        // Assertions
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
        .expect(200) // Changed from 204 to 200
        .then(response => {
          expect(response.body).toHaveProperty('contentId', testMovie.contentId);
          expect(response.body).toHaveProperty('message');
        });
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

    // Setup for this specific test suite
    beforeEach(async () => {
      // First clear any existing data
      const collections = mongoConnection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }

      // Add only the TV show for the main user
      await request(app.getHttpServer())
        .post('/my-list')
        .set(ServiceConstants.userId_header, userId)
        .send(testTVShow);
    });

    it('should add item to another user\'s list', () => {
      return request(app.getHttpServer())
        .post('/my-list')
        .set(ServiceConstants.userId_header, anotherUserId)
        .send(testMovie)
        .expect(201);
    });

    it('should not affect original user\'s list', async () => {
      // First add the movie to another user's list
      await request(app.getHttpServer())
        .post('/my-list')
        .set(ServiceConstants.userId_header, anotherUserId)
        .send(testMovie);

      // Then check the original user's list
      const response = await request(app.getHttpServer())
        .get('/my-list')
        .set(ServiceConstants.userId_header, userId)
        .expect(200);

      // Original user should still have only the TV show
      expect(response.body.items.length).toBe(1);
      expect(response.body.items[0].contentId).toBe(testTVShow.contentId);
    });

    it('should get another user\'s list', async () => {
      // First add the movie to another user's list
      await request(app.getHttpServer())
        .post('/my-list')
        .set(ServiceConstants.userId_header, anotherUserId)
        .send(testMovie);

      // Then check another user's list
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

  it('should return empty list directly from service for non-existent user', async () => {
    // Get the service from the module
    const myListService = app.get(MyListService);

    // Call the service method directly
    const result = await myListService.getMyList('direct-test-non-existent-user', { page: 1, limit: 10 });

    // Log the result
    console.log('Direct service result:', result);

    // Check the result
    expect(result.items.length).toBe(0);
    expect(result.total).toBe(0);
  });
});
