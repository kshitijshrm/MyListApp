import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables based on environment
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.cloud'
  : '.env.local';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log('Environment file used:', envFile);
console.log('Environment variables loaded:', process.env.MONGO_URI ? 'MONGO_URI is defined' : 'MONGO_URI is not defined');
console.log('MONGO_URI value:', process.env.MONGO_URI);
console.log('MONGO_URI format check:', process.env.MONGO_URI ?
  `Starts with mongodb://${process.env.MONGO_URI.startsWith('mongodb://')} or mongodb+srv://${process.env.MONGO_URI.startsWith('mongodb+srv://')}` :
  'MONGO_URI is not defined');

const MONGO_URI = process.env.MONGO_URI;
const COLLECTION_NAME = 'my_list';
const NUM_USERS = 5;
const ITEMS_PER_USER = 10;

// Content types and genres matching our schema
const CONTENT_TYPES = ['movie', 'tvshow'];
const GENRES = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'];

async function seedDatabase() {
  if (!MONGO_URI) {
    console.error('MONGO_URI environment variable is not set');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection(COLLECTION_NAME);

    // Drop existing collection if it exists
    const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();
    if (collections.length > 0) {
      console.log(`Dropping existing ${COLLECTION_NAME} collection...`);
      await collection.drop();
    }

    // Create indexes
    console.log('Creating indexes...');
    await collection.createIndex({ userId: 1, contentId: 1 }, { unique: true });
    await collection.createIndex({ userId: 1, addedAt: -1 });

    // Generate sample data
    console.log('Generating sample data...');
    const sampleData = [];

    for (let i = 0; i < NUM_USERS; i++) {
      const userId = `user-${i + 1}`;

      for (let j = 0; j < ITEMS_PER_USER; j++) {
        const contentType = faker.helpers.arrayElement(CONTENT_TYPES);
        const numGenres = faker.datatype.number({ min: 1, max: 3 });
        const genres = faker.helpers.arrayElements(GENRES, numGenres);

        sampleData.push({
          userId,
          contentId: faker.datatype.uuid(),
          contentType,
          title: contentType === 'movie'
            ? faker.lorem.words(faker.datatype.number({ min: 1, max: 4 }))
            : `${faker.lorem.words(faker.datatype.number({ min: 1, max: 2 }))}:
               ${faker.lorem.words(faker.datatype.number({ min: 1, max: 3 }))}`,
          description: faker.lorem.paragraph(),
          genres,
          addedAt: faker.date.past(1), // 1 year in the past
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // Insert sample data
    console.log(`Inserting ${sampleData.length} documents...`);
    const result = await collection.insertMany(sampleData);
    console.log(`Successfully inserted ${result.insertedCount} documents`);

    // Print sample data for verification
    console.log('\nSample data:');
    const firstUser = sampleData[0].userId;
    const sampleItems = await collection.find({ userId: firstUser }).limit(3).toArray();
    console.log(JSON.stringify(sampleItems, null, 2));

    console.log(`\nTotal documents for user "${firstUser}": ${await collection.countDocuments({ userId: firstUser })}`);
    console.log(`Total documents in collection: ${await collection.countDocuments()}`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedDatabase().catch(console.error);
