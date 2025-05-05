# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/app

# Copy source files
COPY . .

# Install dependencies and build the app
RUN yarn install && yarn build

# Production stage
FROM node:20-alpine

WORKDIR /usr/opt/app

# Copy built app from builder
COPY --from=builder /usr/app ./

# Install only production dependencies
RUN yarn install --production && yarn cache clean

EXPOSE 3000

CMD ["yarn", "start:prod"]
