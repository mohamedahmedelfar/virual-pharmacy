import React, { createContext, useReducer, useContext } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        cartItems: [
          ...state.cartItems,
          {
            medicine: action.payload.medicine,
            quantity: action.payload.quantity,
            price: action.payload.price,
          },
        ],
      };
    // Add more cases for other actions like removing from cart, updating quantities, etc.

    case 'UPDATE_CART_ITEMS':
        // Update the cart items
        return {
          ...state,
          cartItems: action.payload,
        };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cartItems: [],
  });

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
};

const useCartState = () => {
  const context = useContext(CartStateContext);
  if (!context) {
    throw new Error('useCartState must be used within a CartProvider');
  }
  return context;
};

const useCartDispatch = () => {
  const context = useContext(CartDispatchContext);
  if (!context) {
    throw new Error('useCartDispatch must be used within a CartProvider');
  }
  return context;
};

const useCart = () => {
  return [useCartState(), useCartDispatch()];
};

export { CartProvider, useCart };
