import React, { useState, useEffect } from 'react';
import CartIcon from '../components/CartIcon';

function Store() {
  const [medicines, setMedicines] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);

  const [alternatives, setAlternatives] = useState([]); // Initialize alternatives state to an empty array

  useEffect(() => {
    // Fetch medicine details when the component mounts
    fetchMedicines();
    fetchWalletBalance();
  }, []);
  const fetchWalletBalance = async () => {
    try {
      // Replace 'username' with the actual username or get it dynamically
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:4000/api/medicine/getWallet/${username}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Entire Response:', data);  // Log the entire response
      setWalletBalance(data.wallet);

    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };
  const fetchMedicines = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/medicine/getAllMedicines');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMedicines(data);

      console.log('Fetched Medicines:', data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const addToCart = async (medicineName) => {
    try {
      const UserName = localStorage.getItem('username') ; 
      const response = await fetch(`http://localhost:4000/api/medicine/addMedicineToCart/${UserName}/${medicineName}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        
        setErrorMessage(data.message); // Display the error message on the frontend
        setSuccessMessage(''); // Clear any existing success message
        return;
      }
      if(response.ok){
      const data = await response.json();
      console.log('Message', data.message);
      if (data.message === 'Medicine out of stock' && data.alternatives.length > 0){
        setSuccessMessage('Medicine not in Stock. Choose an Alternative below');
        setAlternatives(data.alternatives);
        setErrorMessage(''); // Clear any existing error message
        console.log('Alternatives:' , data.alternatives);
        return;
       
      }
      
      console.log('Added to Cart:', data);
      setErrorMessage(''); // Clear any existing error message
      setSuccessMessage('Medicine added to cart successfully');
      setAlternatives([]); // Clear alternatives in case there were any

       setTimeout(() => {
        window.location.reload();
      }, 500);
      
     
      }
    } catch (error) {
      console.error('Error adding medicine to cart:', error);
      setErrorMessage('Something went wrong. Please try again.'); // Display a generic error message
      setSuccessMessage(''); // Clear any existing success message
      setAlternatives([]); // Clear alternatives in case there were any

    }
  };
  const handleViewOrders = async () => {
    window.location.href = '/viewOrders';
  }
  return (
    <div>
      <h1>Medicine Store</h1>
      <p style={{ position: 'absolute', top: 200, right: 300 }}>Wallet Balance: {walletBalance} EGP</p>
      <button style = {{position: 'absolute', top: 200, right: 10}} onClick={handleViewOrders}>View Orders</button> 

      <CartIcon />
      <ul>
        {medicines.map((medicine) => (
          <li key={medicine._id}>
            {medicine.name} - {medicine.manufacturer} - {medicine.dosage} - {medicine.medicinalUse} - {medicine.price} EGP
            <button onClick={() => addToCart(medicine.name)}>Add to Cart</button>
          </li>
        ))}
      </ul>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}


      {/* Display alternatives if available */}
    {alternatives.length > 0 && (
      <div>
        <p>Alternatives:</p>
        <ul>
          {alternatives.map((alternative) => (
            <li key={alternative._id}>
              {alternative.name} - {alternative.manufacturer} - {alternative.dosage} - {alternative.medicinalUse} - {alternative.price} EGP
              <button onClick={() => addToCart(alternative.name)}>Add to Cart</button>
            </li>
          ))}
        </ul>
      </div>
    )}
    </div>
  );
}

export default Store;
