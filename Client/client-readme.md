# Grocery List Client Application

A React + Redux + TypeScript frontend application for managing grocery shopping lists with a Hebrew RTL interface.

## Tech Stack

- React 18
- Redux Toolkit for state management
- TypeScript for type safety
- SCSS for styling
- React Router for navigation
- Axios for API communication

## Prerequisites

- Node.js 16+ and npm

## Installation

1. Install dependencies:
   npm install

2. Create a `.env.development` file in the root directory or update the existing `.env` one:

   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_NODE_API_URL=http://localhost:3002/api/shopping-lists
   PORT=3001
 
3. Start the development server:
 npm start
 

5. The application will be available at http://localhost:3001

## Project Structure

```
src/
├── components/           # React components
│   ├── GroceryList.tsx   # Main shopping list component
│   ├── GroceryList.scss  # Styles for GroceryList
│   ├── UserConfirmation.tsx  # Order confirmation component
│   └── UserConfirmation.scss # Styles for UserConfirmation
├── redux/                # Redux state management
│   └── grocerySlice.ts   # Redux slice for grocery functionality
├── types/                # TypeScript type definitions
│   └── index.ts          # Type definitions
├── App.tsx               # Main App component with routing
├── App.scss              # App-level styles
├── store.ts              # Redux store configuration
└── index.tsx             # Entry point
```

## API Integration

The application is designed to work with:
- .NET Core backend for product and shopping list management
- Node.js backend for order submission

API endpoints:
- `GET /api/categories` - Get all categories
- `GET /api/products/category/:id` - Get products by category
- `GET /api/shoppinglist` - Get current shopping list
- `POST /api/shoppinglist` - Update shopping list
- `PUT grocery/submitOrde` - Submit order (Node.js endpoint) 

## Building for Production

npm run build


The build artifacts will be stored in the `build/` directory.

## Environment Variables

- `REACT_APP_API_URL` - Net Backend API URL
- `REACT_APP_NODE_API_URL` nodejs Backend API URL
- `PORT` - Development server port

