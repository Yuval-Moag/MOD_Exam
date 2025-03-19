import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RootState } from '../store';
import { UserFormData, OrderData, OrderApiResponse } from '../types';
import './UserConfirmation.scss';

const UserConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { shoppingList, loading } = useSelector((state: RootState) => state.grocery);
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    address: '',
    email: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<OrderApiResponse | null>(null);
  
  const API_URL = process.env.REACT_APP_NODE_API_URL || 'http://localhost:3002/api/shopping-lists';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.address || !formData.email) {
      setSubmitError('יש למלא את כל השדות');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError('כתובת האימייל אינה תקינה');
      return;
    }
    
    setSubmitLoading(true);
    setSubmitError(null);
    
    try {
      // Create the order data object with shopping list and user details
      const orderData: OrderData = {
        shoppingList,
        userDetails: formData,
        orderDate: new Date().toISOString()
      };
      
      // This would typically send to your Node.js server
      // For now, we'll just log the data
      console.log('Order data to be sent:', orderData);
      
      // nodejs- server
      const res = await axios.put<OrderApiResponse>(API_URL, orderData);
      console.log(res.data);
      
      setSubmitSuccess(res.data);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setSubmitError('חלה שגיאה בשליחת ההזמנה. אנא נסה שוב מאוחר יותר.');
      console.error('Error submitting order:', error);
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleGoBack = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="loading">טוען...</div>;
  }
  
  if (shoppingList.length === 0) {
    return (
      <div className="empty-cart">
        <p>הרשימה שלך ריקה. אנא הוסף מוצרים לרשימת הקניות.</p>
        <button onClick={handleGoBack}>חזור לרשימת הקניות</button>
      </div>
    );
  }
  
  if (submitSuccess) {
    return (
      <div className="success-message">
        <h2>ההזמנה מס. {submitSuccess.id} התקבלה בהצלחה!</h2>
        <p>מועבר לדף הראשי...</p>
      </div>
    );
  }

  return (
    <div className="user-confirmation">
      <h2>אישור הזמנה</h2>
      
      <div className="shopping-list-summary">
        <h3>סיכום הזמנה</h3>
        {shoppingList.map((group) => (
          <div key={group.categoryId} className="category-group">
            <h4>{group.categoryName}</h4>
            <ul>
              {group.products.map(product => (
                <li key={product.id}>
                  {product.name} - {product.quantity} יח'
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="user-form">
        <h3>פרטי משלוח</h3>
        {submitError && <div className="error-message">{submitError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">שם פרטי ומשפחה</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">כתובת</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">כתובת מייל</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="button-group">
            <button
              type="button"
              className="back-button"
              onClick={handleGoBack}
            >
              חזור
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={submitLoading}
            >
              {submitLoading ? 'שולח...' : 'אשר הזמנה'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserConfirmation;