# Node.js Express Elasticsearch Server Setup Instructions

This guide provides comprehensive instructions for setting up the Node.js Express server with Elasticsearch integration on macOS.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn

## Project Structure

The project follows a modular architecture:

```
server2-elasticsearch/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Data models & mappings
│   ├── routes/           # Express routes
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── server.js             # Main server entry point
├── .env                  # Environment variables (create from .env.example)
└── docker-compose.yml    # Docker config for Elasticsearch (if using Docker)
```

## Setup Instructions

### 1. Install Dependencies

npm install


### 2. Set Up Elasticsearch

1. Start the elasticsearch services or use docke approach  with ```docker-compose up -d```

use the included Elasticsearch Mapping defination File: es-mapping.json

2. Verify the services are running:


# Check Elasticsearch
curl -u elastic:password http://localhost:9200

# Access Kibana at http://localhost:5601 in your browser
# Username: elastic
# Password: password


### 3. Configure the Application

Create an environment file:

```bash
cp .env.example .env
```

Edit the `.env` file with your preferred settings:

```bash
# Server Configuration
PORT=3002
NODE_ENV=development

# Elasticsearch Configuration
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=password

# Shopping List Index Name
SHOPPING_LIST_INDEX=shopping-lists
```

### 4. Start the Development Server

```bash
npm run dev
```

The server will start on http://localhost:3002 (or the port you specified in your .env file).

## API Documentation with Swagger UI

The API includes Swagger UI documentation available at:

```
http://localhost:3002/api-docs
```

## Available API Endpoints

### Shopping Lists API

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | /api/shopping-lists | Save or update a shopping list |
| GET | /api/shopping-lists/:id | Get a shopping list by ID |
| GET | /api/shopping-lists/user/:userId | Get all shopping lists for a user |
| DELETE | /api/shopping-lists/:id | Delete a shopping list |

## Stopping Services

### Docker

```bash
docker-compose down
```

### Homebrew (macos)

```bash
brew services stop elastic/tap/elasticsearch-full
brew services stop elastic/tap/kibana-full
```
