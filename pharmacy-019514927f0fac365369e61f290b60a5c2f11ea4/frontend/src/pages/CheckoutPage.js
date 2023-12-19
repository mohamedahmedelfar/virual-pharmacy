// CheckoutPage.js

import React, { useEffect, useState } from 'react';

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editedQuantity, setEditedQuantity] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressSelect, setShowAddressSelect] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);

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
    const fetchAddresses = async () => {
        try {
            const username = localStorage.getItem('username'); // Replace with the actual username or get it dynamically
            const response = await fetch(`http://localhost:4000/api/medicine/getAddresses/${username}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setAddresses(data.addresses);
            return data.addresses; // Return the fetched addresses
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    useEffect(() => {
        // Fetch addresses when the component mounts
        fetchAddresses();
    }, []);

    const handleShowAddress = () => {
        setShowAddressForm((prevShowAddressForm) => !prevShowAddressForm);
    };
    const handleAddAddress = async () => {
        try {
            const username = localStorage.getItem('username'); // Replace with the actual username or get it dynamically

            const response = await fetch(`http://localhost:4000/api/medicine/addAddress/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    street,
                    city,
                    state,
                    zipCode,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setErrorMessage(data.message);
                setSuccessMessage('');
                return;
            }

            const data = await response.json();
            setSuccessMessage(data.message);
            setErrorMessage('');

            setStreet('');
            setCity('');
            setState('');
            setZipCode('')
            const updatedAddresses = await fetchAddresses();
            setAddresses(updatedAddresses);

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error('Error adding address:', error);
            setErrorMessage('Something went wrong. Please try again.');
            setSuccessMessage('');
        }
    }
    const handleShowAddressSelect = () => {
        setShowAddressSelect((prevShowAddressSelect) => !prevShowAddressSelect);
    };

    const handleChooseAddress = async (address) => {
        try {
            const username = localStorage.getItem('username');// Replace with the actual username or get it dynamically

            // Make a request to choose the selected address using the PUT method
            const response = await fetch(`http://localhost:4000/api/medicine/chooseAddress/${username}`, {
                method: 'PUT',  // Change the method to PUT
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    zipCode: address.zipCode,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data.message); // Log the response message from the backend 

            // Update the state with the message from the backend
            setSuccessMessage(data.message);
            setErrorMessage(''); // Clear any existing error message

            // Reload the page after 1 second
            setTimeout(() => {
                window.location.reload();
            }, 500);

            // Optionally, you can update the state or perform other actions based on the response

        } catch (error) {
            console.error('Error choosing address:', error);
            // Handle the error or show a notification to the user
            // Update the state with an error message
            setErrorMessage('Error choosing address. Please try again.');
            setSuccessMessage(''); // Clear any existing success message
        }

        
    
    
    };

    const handlePayWithWallet = async () => {
        try {
            const username = localStorage.getItem('username'); // Replace with the actual username or get it dynamically

            const response = await fetch(`http://localhost:4000/api/medicine/payWithWallet/${username}`, {
                method: 'PUT',
            });

            if (!response.ok) {
                const data = await response.json();
                setErrorMessage(data.message); // Display the error message on the frontend
                setSuccessMessage(''); // Clear any existing success message
                return;
            }

            const data = await response.json();
            setSuccessMessage(data.message); // Display the success message on the frontend
            setErrorMessage(''); // Clear any existing error message
         
                 

            // Optionally, you can update the state or perform other actions based on the response

            // Reload the page after 1 second
            setTimeout(() => {
                // redirect to shop page
                window.location.href = '/shop'; 
            }, 1000);
        } catch (error) {
            console.error('Error paying with wallet:', error);
            setErrorMessage('Something went wrong. Please try again.'); // Display a generic error message
            setSuccessMessage(''); // Clear any existing success message
           
                
        }
    };
    const handlePayCashOnDelivery = async () => {
        try {
            const username = localStorage.getItem('username'); // Replace with the actual username or get it dynamically

            const response = await fetch(`http://localhost:4000/api/medicine/checkOut/${username}`, {
                method: 'PUT',
            });

            if (!response.ok) {
                const data = await response.json();
                setErrorMessage(data.message); // Display the error message on the frontend
                setSuccessMessage(''); // Clear any existing success message
                return;
            }

            const data = await response.json();
            setSuccessMessage(data.message); // Display the success message on the frontend
            setErrorMessage(''); // Clear any existing error message
         
                 

            // Optionally, you can update the state or perform other actions based on the response

            // Reload the page after 1 second
            setTimeout(() => {
                window.location.href = '/shop';
            }, 1000);
        } catch (error) {
            console.error('Error paying cash on delivery:', error);
            setErrorMessage('Something went wrong. Please try again.'); // Display a generic error message
            setSuccessMessage(''); // Clear any existing success message
           
                
        }
    };
    const handlePayWithCard = async () => {
        try{
            window.location.href = '/payment';
        }
        catch(error){
            console.error('Error paying with card:', error);
            setErrorMessage('Something went wrong. Please try again.'); // Display a generic error message
            setSuccessMessage(''); // Clear any existing success message
        }
    }

    return (
        <div>
            <h2>Checkout</h2>
            <p style={{ position: 'absolute', top: 100, right: 900 }}>Wallet Balance: {walletBalance} EGP</p>
            <h3>Cart Items:</h3>
            <ul>
                {cartItems.map((item) => (
                    <li key={item.medicine._id}>
                        {item.medicine} - Quantity: {item.quantity}
                    </li>
                ))}
            </ul>
            <p>Total Amount: {totalAmount} EGP</p>

            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {/* Button to toggle the address form visibility */}
            <button type="button" onClick={handleShowAddress} style={{ marginBottom: '10px' }}>
                {showAddressForm ? 'Hide Address Form' : 'Add Address'}
            </button>

            {showAddressForm && (
                <div>
                    <h3>Add a New Address</h3>
                    {/* {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} */}


                    <form style={{ marginTop: '10px' }}>
                        <label>
                            Street:
                            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} style={{ marginLeft: '5px' }} />
                        </label>
                        <br />
                        <label>
                            City:
                            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} style={{ marginLeft: '5px' }} />
                        </label>
                        <br />
                        <label>
                            State:
                            <input type="text" value={state} onChange={(e) => setState(e.target.value)} style={{ marginLeft: '5px' }} />
                        </label>
                        <br />
                        <label>
                            Zip Code:
                            <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} style={{ marginLeft: '5px' }} />
                        </label>
                        <br />
                        <button type="button" onClick={handleAddAddress} style={{ marginTop: '-5px' }}>
                            Save Address
                        </button>
                    </form>





                </div>)}
            {/* Button to choose address for shipping */}
            <button type="button" onClick={handleShowAddressSelect} style={{ marginLeft: '50px' }}>
                {showAddressSelect ? 'Hide Choose Address' : 'Choose Address for Shipping'}
            </button>
            {showAddressSelect && (
                <div>
                    <h3>Available Addresses:</h3>
                    {/* {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} */}


                    <ul>
                        {addresses.map((address) => (
                            <li key={address.street}>
                                {address.street}, {address.city}, {address.state}, {address.zipCode}
                                <button type="button" onClick={() => handleChooseAddress(address)}>
                                    Choose
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button type="button" onClick={handlePayWithWallet} style={{ marginLeft: '50px' }}>
                Pay with Wallet
            </button>
            <button type="button" onClick={handlePayCashOnDelivery} style={{ marginLeft: '50px' }}>
                Pay Cash On Delivery
            </button>
            <button type="button" onClick={handlePayWithCard} style={{ marginLeft: '50px' }}>
                Pay using Card (Stripe)
            </button>

        </div>
    );


}


export default CheckoutPage;
