# main-product-store

Product Store is a RESTful API for managing an ecommerce product catalog. It includes endpoints for user authentication, product management (with image uploads and reviews), and category management. The API is built using Node.js, Express, and TypeScript, with MongoDB for storage and Cloudinary for image uploads. The project uses dependency injection, centralized error handling, and request validation using Celebrate/Joi.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
  - [Development](#development)
  - [Production](#production)
- [Docker Setup](#docker-setup)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Seeding the Admin User](#seeding-the-admin-user)
- [License](#license)

## Features

- **User Authentication:**  
  Secure signup and login with password hashing (using bcryptjs) and JWT-based authentication.

- **Product Management:**  
  Create, update, delete, and list products with support for pagination, filtering, and full-text search.  
  Upload images using Cloudinary (supports both file system and buffer-based uploads).

- **Reviews & Categories:**  
  Manage product reviews and categories. Validation is enforced via Celebrate/Joi.

- **Robust Error Handling:**  
  Centralized error handling middleware for uniform error responses and Multer file validation.

- **TypeScript & Inversion of Control:**  
  Uses TypeScript for type safety and Inversify for dependency injection.

## Technologies Used

- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB, Mongoose
- **File Uploads:** Multer, Cloudinary, Streamifier
- **Validation:** Celebrate, Joi
- **Authentication:** JSON Web Tokens (JWT)
- **Logging:** Winston
- **Containerization:** Docker, Docker Compose
- **Testing:** Jest, Supertest

## Getting Started

### Prerequisites

Before running this project, ensure you have:

- Node.js (>= 14.x)
- npm (>= 6.x)
- Docker & Docker Compose (if running in containers)
- A MongoDB instance (local or cloud-based)
- A Cloudinary account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/product-store.git
   cd product-store
   ```

2. Install dependencies:

   ```
   npm install
   ```

### Environment Variables

Create a .env file in the project root with the following environment variables:

```
PORT=3000
JWT_SECRET=your_jwt_secret
MONGODB_URL=your_mongodb_connection_string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword
ADMIN_USER=Admin
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Running the Application

## Development

To run the project in development mode with hot reloading, use:

```
npm run start:dev
```

## Production

To build and run the application in production:

1.  Build the project:

```
npm run build
```

2.  Start the server:

```
npm start
```

### Docker Setup

This project includes a Dockerfile and docker-compose configuration for containerized deployments.

Dockerfile
The provided Dockerfile uses a lightweight Node.js alpine image:

```
FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci
COPY . .
CMD ["npm", "start"]
```

docker-compose.yml
The docker-compose file maps port 3000 in the container to port 4000 on your host:

```
version: "3"

services:
  api:
    build: .
    ports:
      - 4000:3000
    volumes:
      - .:/usr/src/app
    environment:
      PORT: 3000
      JWT_SECRET: ${JWT_SECRET}
      MONGODB_URL: ${MONGODB_URL}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      ADMIN_USER: ${ADMIN_USER}
      CLOUDINARY_CLOUD_NAME: ${CLOUDINARY_CLOUD_NAME}
      CLOUDINARY_API_KEY: ${CLOUDINARY_API_KEY}
      CLOUDINARY_API_SECRET: ${CLOUDINARY_API_SECRET}
```

To run using Docker Compose, use:

```
docker-compose up --build
```

To stop the container, use:

```
docker-compose down
```

The API will be available at http://localhost:4000.

### Scripts

- **Start Production:**
  npm start – Compiles TypeScript and starts the server.
- **Start Development:**
  npm run start:dev – Compiles TypeScript and starts the server with live reloading.
- **Build:**
  npm run build – Builds the project (compiles TypeScript).
- **Test:**
  npm test – Runs Jest tests.
- **Seed Admin User:**
  npm run seed-admin – Seeds the database with an admin user.

### API Endpoints

Users

- **POST /auth/register – Create a new user.**
- **POST /auth/login – Login a user and receive a JWT token.**

Products

- **POST /products – Create a new product.**
- **GET /products/all – Retrieve a paginated list of products (supports filtering and search).**
- **GET /products/user-products – Retrieve a list of products for a user.**
- **PATCH /products/:id – Update an existing product.**
- **GET /products/:id – Retrieve a product.**
- **PATCH /products/add-images/:id – Add images to a product.**
- **PATCH /products/review/:id – Add review to a product.**
- **DELETE /products/:id – Delete a product.**

Categories

- **POST /categories – Create a new category.**
- **GET /categories – List all categories.**
- **GET /categories/:id – Get a specific category.**
- **PATCH /categories/:id – Update a category.**
- **DELETE /categories/:id – Delete a category.**

## Testing

Tests are written using Jest and Supertest. To run tests, execute:

```
npm test
```

You can also use Postman to manually test endpoints. Make sure to include the necessary headers (such as Authorization for protected routes) and body data.

## Seeding the Admin User

A seed script is provided to create an initial admin user. To seed the admin user, run:

```
npm run seed-admin
```

This script connects to the MongoDB database, checks if an admin user exists (based on the provided ADMIN_EMAIL), and creates one if it does not.
