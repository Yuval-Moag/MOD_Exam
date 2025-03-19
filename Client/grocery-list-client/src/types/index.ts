export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
    quantity: number;
}

export interface ShoppingListItemDto {
    id: number;
    name: string;
    quantity: number;
}

export interface ShoppingListItemGroupDto {
    categoryId: number;
    categoryName: string;
    products: ShoppingListItemDto[];
}

export interface ShoppingListDto {
    id?: number;
    items: ShoppingListItemGroupDto[];
}

export interface ProductQuantityDto {
    id: number;
    quantity: number;
}

export interface AddToShoppingListDto {
    categoryId: number;
    products: ProductQuantityDto[];
}

export interface OrderApiResponse {
    success: boolean;
    id: string;
    result: string;
}
export interface GroceryState {
    categories: Category[];
    products: Product[];
    shoppingList: ShoppingListItemGroupDto[];
    selectedCategory: string;
    loading: boolean;
    error: string | null;
    orderResponse: OrderApiResponse | null; // Added orderResponse field
}

export interface UserFormData {
    fullName: string;
    address: string;
    email: string;
}

export interface OrderData {
    shoppingList: ShoppingListItemGroupDto[];
    userDetails: UserFormData;
    orderDate: string;
}
