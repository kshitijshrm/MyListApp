import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as readline from 'readline';

// Load environment variables based on environment
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.cloud'
  : '.env.local';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const MONGO_URI = process.env.MONGO_URI;
const COLLECTION_NAME = 'my_list';
const CONTENT_TYPES = ['movie', 'tvshow'];
const GENRES = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'];

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptUser(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function connectToMongo() {
  if (!MONGO_URI) {
    console.error('MONGO_URI environment variable is not set');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log('Connected to MongoDB');
  return client;
}

async function seedCollection(client: MongoClient, numUsers: number, itemsPerUser: number) {
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

  for (let i = 0; i < numUsers; i++) {
    const userId = `user-${i + 1}`;

    for (let j = 0; j < itemsPerUser; j++) {
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
}

async function viewCollectionStats(client: MongoClient) {
  const db = client.db();
  const collection = db.collection(COLLECTION_NAME);

  // Check if collection exists
  const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();
  if (collections.length === 0) {
    console.log(`Collection ${COLLECTION_NAME} does not exist`);
    return;
  }

  // Get total count
  const totalCount = await collection.countDocuments();
  console.log(`Total documents in ${COLLECTION_NAME}: ${totalCount}`);

  // Get count by content type
  console.log('\nCount by content type:');
  const contentTypeCounts = await collection.aggregate([
    { $group: { _id: '$contentType', count: { $sum: 1 } } }
  ]).toArray();

  contentTypeCounts.forEach(item => {
    console.log(`${item._id}: ${item.count}`);
  });

  // Get count by user
  console.log('\nCount by user (top 5):');
  const userCounts = await collection.aggregate([
    { $group: { _id: '$userId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]).toArray();

  userCounts.forEach(item => {
    console.log(`${item._id}: ${item.count}`);
  });

  // Get most popular genres
  console.log('\nMost popular genres:');
  const genreCounts = await collection.aggregate([
    { $unwind: '$genres' },
    { $group: { _id: '$genres', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();

  genreCounts.forEach(item => {
    console.log(`${item._id}: ${item.count}`);
  });
}

async function dropCollection(client: MongoClient) {
  const db = client.db();

  // Check if collection exists
  const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();
  if (collections.length === 0) {
    console.log(`Collection ${COLLECTION_NAME} does not exist`);
    return;
  }

  // Drop the collection
  await db.collection(COLLECTION_NAME).drop();
  console.log(`Collection ${COLLECTION_NAME} dropped successfully`);
}

async function main() {
  console.log('MongoDB Database Manager');
  console.log('=======================');
  console.log('1. Seed my_list collection with sample data');
  console.log('2. View collection statistics');
  console.log('3. Drop my_list collection');
  console.log('4. Exit');

  const choice = await promptUser('\nEnter your choice (1-4): ');

  let client;
  try {
    if (choice === '4') {
      console.log('Exiting...');
      rl.close();
      return;
    }

    client = await connectToMongo();

    switch (choice) {
      case '1':
        const numUsers = parseInt(await promptUser('Enter number of users to create (default: 5): ') || '5');
        const itemsPerUser = parseInt(await promptUser('Enter number of items per user (default: 10): ') || '10');
        await seedCollection(client, numUsers, itemsPerUser);
        break;
      case '2':
        await viewCollectionStats(client);
        break;
      case '3':
        const confirm = await promptUser('Are you sure you want to drop the collection? (y/n): ');
        if (confirm.toLowerCase() === 'y') {
          await dropCollection(client);
        } else {
          console.log('Operation cancelled');
        }
        break;
      default:
        console.log('Invalid choice');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Database connection closed');
    }
    rl.close();
  }
}

// Run the main function
main().catch(console.error);
