import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store';
import GroceryList from './components/GroceryList';
import './App.scss';
import UserConfirmation from './components/UserConfirmation';

const App: React.FC = () => {
  return (
    <Provider store={store}>
    <Router>
      <div className="App" dir="rtl">
        <header className="App-header">
          <h1>רשימת קניות</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<GroceryList />} />
            <Route path="/confirm" element={<UserConfirmation />} />
          </Routes>
        </main>
      </div>
    </Router>
  </Provider>
  );
};

export default App;