import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchCategories, 
    fetchProductsByCategory, 
    updateProductQuantity,
    addToShoppingList,
    fetchShoppingList,
    updateShoppingListItem
} from '../redux/grocerySlice';
import { AppDispatch, RootState } from '../store';
import './GroceryList.scss';
import { useNavigate } from 'react-router-dom';


const GroceryList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { categories, products, shoppingList, loading } = useSelector((state: RootState) => state.grocery);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
  
    // Fetch shopping list and categories when component mounts
    useEffect(() => {
      dispatch(fetchShoppingList());
      dispatch(fetchCategories());
    }, [dispatch]);
  
    useEffect(() => {
      if (selectedCategory) {
        dispatch(fetchProductsByCategory(parseInt(selectedCategory, 10)));
      }
    }, [selectedCategory, dispatch]);
  
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCategory(e.target.value);
    };
  
    const handleProductQuantityChange = (productId: number, newQuantity: number) => {
      dispatch(updateProductQuantity({ productId, quantity: newQuantity }));
    };
  
    const handleAddToShoppingList = () => {
      dispatch(addToShoppingList());
    };
    
    const handleShoppingListItemQuantityChange = (
      categoryId: number, 
      productId: number, 
      newQuantity: number
    ) => {
      dispatch(updateShoppingListItem({
        categoryId,
        productId,
        quantity: newQuantity
      }));
    };
  
    const handleConfirmClick = () => {
      navigate('/confirm');
    };
  
    return (
      <div className="grocery-container">
        <div className="category-selector">
          <label htmlFor="category-select">בחר קטגוריה:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            disabled={loading}
          >
            <option value="">בחר...</option>
            {categories.map(category => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
  
        {loading ? (
          <div className="loading">טוען...</div>
        ) : (
          <>
            {selectedCategory && (
              <div className="products-list">
                <h2>מוצרים בקטגוריה</h2>
                <ul>
                  {products.map(product => (
                    <li key={product.id} className="product-item">
                      <span className="product-name">{product.name}</span>
                      <div className="quantity-control">
                        <button
                          onClick={() => 
                            handleProductQuantityChange(product.id, Math.max(0, product.quantity - 1))
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={product.quantity}
                          onChange={(e) => 
                            handleProductQuantityChange(product.id, parseInt(e.target.value, 10) || 0)
                          }
                        />
                        <button
                          onClick={() => 
                            handleProductQuantityChange(product.id, product.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button 
                  className="add-to-cart-btn"
                  onClick={handleAddToShoppingList}
                >
                  הוסף להזמנה
                </button>
              </div>
            )}
  
            <div className="shopping-list">
              <h2>רשימת קניות</h2>
              {shoppingList.length === 0 ? (
                <p>הרשימה ריקה</p>
              ) : (
                <>
                  <ul>
                    {shoppingList.map((group) => (
                      <li key={group.categoryId} className="shopping-list-category">
                        <h3>{group.categoryName}</h3>
                        <ul className="shopping-list-items">
                          {group.products.map(product => (
                            <li key={product.id} className="shopping-list-item">
                              <span className="product-name">{product.name}</span>
                              <div className="quantity-control">
                                <button
                                  onClick={() => 
                                    handleShoppingListItemQuantityChange(
                                      group.categoryId, 
                                      product.id, 
                                      Math.max(0, product.quantity - 1)
                                    )
                                  }
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={product.quantity}
                                  onChange={(e) => 
                                    handleShoppingListItemQuantityChange(
                                      group.categoryId,
                                      product.id, 
                                      parseInt(e.target.value, 10) || 0
                                    )
                                  }
                                />
                                <button
                                  onClick={() => 
                                    handleShoppingListItemQuantityChange(
                                      group.categoryId,
                                      product.id, 
                                      product.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className="confirm-order-btn"
                    onClick={handleConfirmClick}
                  >
                    אשר הזמנה
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    );
  };
  
  export default GroceryList;