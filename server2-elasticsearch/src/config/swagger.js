const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shopping List API with Elasticsearch',
      version: '1.0.0',
      description: 'RESTful API for managing shopping lists with Elasticsearch',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        ShoppingList: {
          type: 'object',
          required: ['title', 'user'],
          properties: {
            id: {
              type: 'string',
              description: 'Shopping list unique identifier'
            },
            title: {
              type: 'string',
              description: 'Shopping list title'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Item identifier'
                  },
                  name: {
                    type: 'string',
                    description: 'Item name'
                  },
                  quantity: {
                    type: 'integer',
                    description: 'Item quantity'
                  },
                  completed: {
                    type: 'boolean',
                    description: 'Item completion status'
                  }
                }
              }
            },
            user: {
              type: 'object',
              required: ['id'],
              properties: {
                id: {
                  type: 'string',
                  description: 'User identifier'
                },
                username: {
                  type: 'string',
                  description: 'Username'
                },
                email: {
                  type: 'string',
                  description: 'User email'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;