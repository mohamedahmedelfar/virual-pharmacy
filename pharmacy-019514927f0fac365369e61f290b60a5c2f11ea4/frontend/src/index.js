import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MedicinesContextProvider } from './context/MedicinesContext';
import { CartProvider } from './context/CartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MedicinesContextProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </MedicinesContextProvider>
  </React.StrictMode>
);
