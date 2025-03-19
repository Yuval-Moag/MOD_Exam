import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  GroceryState, 
  Category, 
  Product, 
  ShoppingListItemGroupDto, 
  AddToShoppingListDto,
  ShoppingListDto,
  OrderApiResponse,
  OrderData
} from '../types';

// Get API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const NODE_API_URL = process.env.REACT_APP_NODE_API_URL || 'http://localhost:3002/api/shopping-lists';

// Fetch shopping list when app loads
export const fetchShoppingList = createAsyncThunk(
  'grocery/fetchShoppingList',
  async () => {
    const response = await axios.get<ShoppingListDto>(`${API_URL}/shoppinglist`);
    return response.data.items || [];
  }
);

export const fetchCategories = createAsyncThunk(
  'grocery/fetchCategories',
  async () => {
    const response = await axios.get<Category[]>(`${API_URL}/categories`);
    return response.data;
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'grocery/fetchProductsByCategory',
  async (categoryId: number) => {
    const response = await axios.get<Product[]>(`${API_URL}/products/category/${categoryId}`);
    return response.data;
  }
);

export const addToShoppingList = createAsyncThunk(
  'grocery/addToShoppingList',
  async (_, { getState }) => {
    const state = getState() as { grocery: GroceryState };
    const products = state.grocery.products.filter(p => p.quantity > 0).map(p => ({
      id: p.id,
      quantity: p.quantity
    }));
    
    const payload: AddToShoppingListDto = {
      categoryId: parseInt(state.grocery.selectedCategory, 10),
      products
    };
    
    const response = await axios.post<ShoppingListDto>(`${API_URL}/shoppinglist`, payload);
    return response.data.items || [];
  }
);

// Update shopping list item quantity directly
export const updateShoppingListItem = createAsyncThunk(
  'grocery/updateShoppingListItem',
  async ({ 
    categoryId, 
    productId, 
    quantity 
  }: { categoryId: number; productId: number; quantity: number }, { getState }) => {
    const state = getState() as { grocery: GroceryState };
    
    const payload: AddToShoppingListDto = {
      categoryId,
      products: [{ id: productId, quantity }]
    };
    
    const response = await axios.post<ShoppingListDto>(`${API_URL}/shoppinglist`, payload);
    return response.data.items || [];
  }
);

// Submit order to Node.js server
export const submitOrder = createAsyncThunk(
  'grocery/submitOrder',
  async (orderData: OrderData) => {
    const response = await axios.put<OrderApiResponse>(NODE_API_URL, orderData);
    return response.data;
  }
);

const initialState: GroceryState = {
  categories: [],
  products: [],
  shoppingList: [],
  selectedCategory: '',
  loading: false,
  error: null,
  orderResponse: null
};

interface UpdateProductQuantityPayload {
  productId: number;
  quantity: number;
}

const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {
    updateProductQuantity: (state, action: PayloadAction<UpdateProductQuantityPayload>) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.quantity = quantity;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetch shopping list
      .addCase(fetchShoppingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShoppingList.fulfilled, (state, action: PayloadAction<ShoppingListItemGroupDto[]>) => {
        state.loading = false;
        state.shoppingList = action.payload;
      })
      .addCase(fetchShoppingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shopping list';
      })
      
      // Handle fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      
      // Handle fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action: PayloadAction<Product[], string, { arg: number }>) => {
        state.loading = false;
        state.products = action.payload;
        state.selectedCategory = action.meta.arg.toString();
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      
      // Handle add to shopping list
      .addCase(addToShoppingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToShoppingList.fulfilled, (state, action: PayloadAction<ShoppingListItemGroupDto[]>) => {
        state.loading = false;
        state.shoppingList = action.payload;
      })
      .addCase(addToShoppingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update shopping list';
      })
      
      // Handle update shopping list item
      .addCase(updateShoppingListItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShoppingListItem.fulfilled, (state, action: PayloadAction<ShoppingListItemGroupDto[]>) => {
        state.loading = false;
        state.shoppingList = action.payload;
      })
      .addCase(updateShoppingListItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update shopping list item';
      })
      
      // Handle submit order
      .addCase(submitOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitOrder.fulfilled, (state, action: PayloadAction<OrderApiResponse>) => {
        state.loading = false;
        state.orderResponse = action.payload;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit order';
      });
  }
});

export const { updateProductQuantity } = grocerySlice.actions;
export default grocerySlice.reducer;