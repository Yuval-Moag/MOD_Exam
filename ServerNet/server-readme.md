# Grocery List API Server

A .NET Core backend with Entity Framework Core (code first) and SQL Server for the Grocery List application.

## Tech Stack

- ASP.NET Core 8.0
- Entity Framework Core
- SQL Server
- Swagger for API documentation
- Serilog for structured logging

## Prerequisites

- .NET 8.0 SDK
- SQL Server (or Docker with SQL Server image)
- VS Code, Visual Studio, or another code editor

## Docker Setup for SQL Server (optional)

```bash
# Pull SQL Server image
docker pull mcr.microsoft.com/mssql/server:2022-latest

# Run SQL Server container
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrongPassword123!" \
   -p 1433:1433 --name mssql-server \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

## Installation and Setup

1. Update the connection string in `appsettings.json`:
  
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost,1433;Database=GroceryListDb;User ID=sa;Password=YourStrongPassword123!;TrustServerCertificate=true;MultipleActiveResultSets=true"
   }

   use the right SQL Server adrress instance 

2. ## CORS Configuration

Since the client runs on a different port (3001) than the API server (5000/5001), you need to properly configure CORS to allow cross-origin requests.

The CORS configuration is already included in Program.cs, but you may need to update it to match your client's URL:
```
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3001") // Update this to match your client URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

3. Run the SQL Server instance. The application will create a DB named in the connection string.  The user specified in the connection string must have permissions to create databases

4. Run the application:
      dotnet run. Application will apply the migrations


5. The API will be available at:
   - https://localhost:5001/api
   - http://localhost:5000/api
   - Swagger UI: https://localhost:5001/swagger

## Project Structure

```
GroceryListApi/
├── Controllers/               # API controllers
│   ├── CategoriesController.cs
│   ├── ProductsController.cs
│   └── ShoppingListController.cs
├── Data/                      # Database context
│   └── ApplicationDbContext.cs
├── DTOs/                      # Data Transfer Objects
│   ├── CategoryDto.cs
│   ├── ProductDto.cs
│   └── ShoppingListDto.cs
├── Middleware/                # Custom middleware
│   ├── LoggingMiddleware.cs
│   ├── ValidationMiddleware.cs
│   └── Extensions.cs
├── Models/                    # Entity models
│   ├── Category.cs
│   ├── Product.cs
│   ├── ShoppingList.cs
│   └── ShoppingListItem.cs
├── Repositories/              # Repository pattern
│   ├── Interfaces/
│   │   ├── IRepository.cs
│   │   ├── ICategoryRepository.cs
│   │   ├── IProductRepository.cs
│   │   └── IShoppingListRepository.cs
│   └── Implementations/
│       ├── Repository.cs
│       ├── CategoryRepository.cs
│       ├── ProductRepository.cs
│       └── ShoppingListRepository.cs
├── Program.cs                 # Application startup
└── appsettings.json           # Configuration
```

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories

### Products
- `GET /api/products/category/{categoryId}` - Get products by category

### Shopping List
- `GET /api/shoppinglist` - Get current shopping list
- `POST /api/shoppinglist` - Add or update items in shopping list

## Database Schema

- **Categories**: Stores product categories
  - Id (PK)
  - Name

- **Products**: Stores product information
  - Id (PK)
  - Name
  - CategoryId (FK)

- **ShoppingLists**: Stores shopping list metadata
  - Id (PK)
  - UserId
  - CreatedAt
  - UpdatedAt

- **ShoppingListItems**: Stores items in shopping lists
  - Id (PK)
  - ShoppingListId (FK)
  - ProductId (FK)
  - Quantity

## Repository Pattern Implementation

The application uses the repository pattern to separate business logic from data access:

1. **Generic Repository**: Provides common CRUD operations
2. **Specialized Repositories**: Implement specific data access methods
3. **Dependency Injection**: Services are registered in Program.cs

## Middleware

- **Logging Middleware**: Tracks HTTP requests and responses
- **Validation Middleware**: Global exception handling

## Configuration

- **Database**: Connection string in appsettings.json
- **Serilog**: Structured logging configuration
- **CORS**: Configured for React application
