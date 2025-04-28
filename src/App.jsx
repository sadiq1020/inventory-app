// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CustomerList from './pages/CustomerList'; // or wherever your component lives
import StockPage from './pages/StockPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/customers" element={<CustomerList />} />
      <Route path="/stock" element={<StockPage />} />
    </Routes>
  );
}

export default App;
