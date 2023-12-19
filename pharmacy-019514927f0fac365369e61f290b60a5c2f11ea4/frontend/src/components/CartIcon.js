import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import CheckoutPage from '../pages/CheckoutPage';

function CartIcon() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const username = localStorage.getItem('username');
        const response = await fetch(`http://localhost:4000/api/medicine/getCartItems/${username}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCartItems(data.cartItems);
        setTotalAmount(data.totalAmount);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
    fetchCartData();
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleRemoveItem = async (itemName) => {
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:4000/api/medicine/deleteMedicineFromCart/${username}/${itemName}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedResponse = await fetch(`http://localhost:4000/api/medicine/getCartItems/${username}`);
      const updatedData = await updatedResponse.json();
      setCartItems(updatedData.cartItems);
      setTotalAmount(updatedData.totalAmount);
      setSuccessMessage('Item removed from the cart successfully');
      setErrorMessage('');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setErrorMessage('Error removing item from the cart');
      setSuccessMessage('');
    }
  };

  const handleEditQuantity = async (itemName) => {
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:4000/api/medicine/changeQuantityInCart/${username}/${itemName}/${editedQuantity}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message); // Display the error message on the frontend
        setSuccessMessage(''); // Clear any existing success message
        return;
      }

      const updatedResponse = await fetch(`http://localhost:4000/api/medicine/getCartItems/${username}`);
      const updatedData = await updatedResponse.json();
      setCartItems(updatedData.cartItems);
      setTotalAmount(updatedData.totalAmount);
      setSuccessMessage('Quantity changed successfully');
      setErrorMessage('');
      setEditedQuantity('');
    } catch (error) {
      console.error('Error changing quantity in cart:', error);
      setErrorMessage('Error changing quantity in cart, You cannot leave the quantity field empty');
      setSuccessMessage('');
    }
  };

  const handleEditQuantityKeyPress = (itemName, e) => {
    if (e.key === 'Enter') {
      handleEditQuantity(itemName);
    }
  };

  const handleCheckout = async () => {
    window.location.href = '/checkout';
  }
  

  return (
    <div style={{ position: 'fixed', top: '88px', right: '50px', cursor: 'pointer' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="34"
        height="84"
        onClick={openModal}
      >
        <circle cx="9" cy="20" r="1"></circle>
        <circle cx="20" cy="20" r="1"></circle>
        <path d="M21 15s-2-4-5-4H4"></path>
        <path d="M4 4h16l2 12H4z"></path>
      </svg>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Cart Items Modal"
      >
        <h2>Cart Items</h2>
        {cartItems ? (
          <ul>
            {cartItems.map((item) => (
            <li key={item.medicine._id}>
            {item.medicine} - Quantity: {item.quantity}
            <span style={{ marginRight: '8px' }}></span>
            <button onClick={() => handleRemoveItem(item.medicine)}>Remove</button>
            <input
                type="text"
                value={editedQuantity}
                onChange={(e) => setEditedQuantity(e.target.value)}
                placeholder="Change quantity here"
                style={{ display: 'inline-block', marginRight: '8px' }}
            />
            <button type="button" onClick={() => handleEditQuantity(item.medicine)}>
                Change Quantity
            </button>
        </li>
        
            ))}
          </ul>
        ) : (
          <p>No items in the cart.</p>
        )}
        <p>Total Amount: {totalAmount}</p>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <button onClick={closeModal}>Close Cart</button>
        <span style={{ marginRight: '60px' }}></span>
        <button onClick={handleCheckout}>Checkout</button>
      </Modal>
    </div>
  );
}

export default CartIcon;
