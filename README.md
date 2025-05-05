# List API

A NestJS-based API for managing user content lists. This service allows users to create and manage personalized lists of movies, TV shows, and other content.

## Features

- Add/remove items to a user's list
- Get paginated list of items
- Check if an item is in a user's list
- MongoDB integration for data storage
- Caching for improved performance
- Swagger API documentation

## Local Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:kshitijshrm/MyListApp.git
   cd list-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment files:

   Create a `.env.local` file for local development:
   ```
   MONGO_URI=mongodb://localhost:27017/list-api
   PORT=3000
   ```

   For production, create a `.env.cloud` file:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/list-api
   PORT=3000
   ```

### Running the Application

Start the application in development mode:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/app/list-api`.

## API Documentation (Swagger)

The API comes with built-in Swagger documentation that provides a comprehensive UI to explore and test all endpoints.

Access Swagger UI at: 
- Local: `http://localhost:3000/app/list-api/docs`
- Production: `https://mylistapp-production.up.railway.app/app/list-api/docs`

Swagger features:
- Interactive API documentation
- Request/response schema examples
- Try-it-out functionality to test endpoints directly
- Authentication support
- Downloadable OpenAPI specification

## Database Management

### Seeding the Database

The project includes a script to seed the database with sample data. This is useful for development and testing purposes.

To seed the database with sample data:
```bash
npm run seed:my-list
```

This command:
- Connects to the MongoDB instance specified in your environment file
- Creates a `my_list` collection if it doesn't exist
- Drops the existing collection if it exists (be careful in production!)
- Creates necessary indexes for performance
- Generates sample data for 5 users with 10 items each
- Each item includes random content type, title, description, and genres

You can modify the number of users and items in the `src/cli/seed-my-list.ts` file.

### Database Management Tool

For more advanced database operations, you can use the database management tool:
```bash
npm run db:manage
```

This interactive CLI tool allows you to:
- Seed the database with custom number of users and items
- View collection statistics
- Drop collections
- Perform other database management tasks

## API Endpoints

### My List Endpoints

#### Add an item to a user's list
- **Endpoint**: `POST /my-list`
- **Description**: Adds a new content item to the user's list
- **Required header**: `x-list-api-userid`
- **curl example**:
  ```bash
  curl --location 'https://mylistapp-production.up.railway.app/app/list-api/my-list' \
  --header 'Content-Type: application/json' \
  --header 'x-list-api-userid: user-1' \
  --data '{
      "contentId": "343",
      "contentType": "movie",
      "title": "The Test Movie",
      "description": "Test.",
      "genres": ["Drama"]
    }'
  ```

#### Get a user's list with pagination
- **Endpoint**: `GET /my-list`
- **Description**: Returns a paginated list of items in the user's list
- **Required header**: `x-list-api-userid`
- **Optional query params**: 
  - `page` (default: 1): Page number
  - `limit` (default: 20, max: 20): Number of items per page
- **curl example**:
  ```bash
  curl --location 'https://mylistapp-production.up.railway.app/app/list-api/my-list?page=1&limit=5' \
  --header 'x-list-api-userid: user-1'
  ```

#### Check if an item is in a user's list
- **Endpoint**: `GET /my-list/:contentId/status`
- **Description**: Checks if a specific content item is in the user's list
- **Required header**: `x-list-api-userid`
- **curl example**:
  ```bash
  curl --location 'https://mylistapp-production.up.railway.app/app/list-api/my-list/343/status' \
  --header 'x-list-api-userid: user-1'
  ```

#### Remove an item from a user's list
- **Endpoint**: `DELETE /my-list/:contentId`
- **Description**: Removes a specific content item from the user's list
- **Required header**: `x-list-api-userid`
- **curl example**:
  ```bash
  curl --location --request DELETE 'https://mylistapp-production.up.railway.app/app/list-api/my-list/343' \
  --header 'x-list-api-userid: user-1'
  ```

### Health Check

#### Check API health
- **Endpoint**: `GET /health`
- **Description**: Returns the health status of the API and its dependencies
- **curl example**:
  ```bash
  curl --location 'https://mylistapp-production.up.railway.app/app/list-api/health'
  ```

## Testing

Run unit tests:
```bash
npm test
```

Run end-to-end tests:
```bash
npm run test:e2e
```

Run tests with coverage:
```bash
npm run test:cov
```

## Deployment

The application is deployed on Railway. The production API is available at:
```
https://mylistapp-production.up.railway.app/app/list-api
```

Make sure to set the appropriate environment variables in your deployment platform.

## License

[MIT](LICENSE)
