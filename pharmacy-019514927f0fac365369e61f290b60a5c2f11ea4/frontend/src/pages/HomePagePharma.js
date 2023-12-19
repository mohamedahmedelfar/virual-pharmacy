import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function HomePagePharma() {
  const [walletBalance, setWalletBalance] = useState(0);

  const userType = localStorage.getItem('userType');
  const username = localStorage.getItem('username');
  // Change userType to the correct user type
  var type = "";
  if(userType === "admin") {
    type = "Admin";
  } else if(userType === "pharmacist") { 
    type = "Pharmacist";
  } else  {
    type = "";
  }
  useEffect(() => {
    // Fetch medicine details when the component mounts
    fetchWalletBalance();
  }, []);
  const fetchWalletBalance = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:4000/api/medicine/getWalletPharma/${username}`);
      
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
  return (
    <div>
      <h1>Welcome to the Pharmacy YA PHARMACIST</h1>
      <h2>{type} {username}</h2>
      <h3>Wallet Balance from salary: {walletBalance}</h3>
      <br />
      <hr />
      <Link to="/peter">
        <button>Add and Edit Medicines</button>
      </Link>
      <Link to="/shop">
        <button>Shop</button>
      </Link>
      <Link to="/hamouda">
        <button>Filter & Archive Medicines</button>
      </Link>
      <Link to="/view-medicines">
        <button>View All Medicines</button>
      </Link>
      <Link to="/filter-medicines">
        <button>View Medicines' Sales Quantity</button>
      </Link>
    
      <Link to="/khaled">
        <button>Medicine Search</button>
      </Link>
    
      <Link to="/notifications">
        <button>Notifications</button>
      </Link>
      <Link to="/conversation">
        <button>Conversation</button>
      </Link>
      <Link to="/viewSalesReport">
        <button>View Sales Report</button>
      </Link>
      <Link to="/doctorConv">
        <button>Conversation with Doctor</button>
      </Link>
      <br />
      <hr />
      <Link to="/change-password">
        <button>Change Password</button>
      </Link>
    </div>
  );
}

export default HomePagePharma;
