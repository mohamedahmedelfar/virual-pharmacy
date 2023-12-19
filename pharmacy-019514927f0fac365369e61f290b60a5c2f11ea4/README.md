# El7a2ny Pharmacy System

## Introduction

El7a2ny Pharmacy System is a comprehensive solution designed to streamline the operations of pharmacies within a virtual clinic setup. It caters to patients, pharmacists, and administrators, enabling efficient management of medicine inventory, patient prescriptions, and order processing.

## Motivation

This system was developed to facilitate a seamless interaction between patients and pharmacists, ensuring that medication is dispensed accurately and efficiently, with an emphasis on ease of use and patient safety.

## Build Status

1. The project is currently under development.
2. Design for error should be improved.
3. Need to implement unit testing.
4. The website is still not deployed.

## Code Style

- Standard Code style that is easy for anyone to understand.
- Async/Await: using async/await, which is good. Make sure to handle errors with a try-catch block.

## Screenshots

https://drive.google.com/drive/folders/1WsuQWJ4TuuZTmmmtbOdzypNV_fY6gGSW?usp=sharing

## Tech/Framework Used

- MongoDB
- Express.js
- React
- Node.js
- Axios
- Stripe

## Features

- Patient account management
- Real-time inventory tracking
- Prescription processing and validation
- Sales reporting and analytics
- Secure pharmacist registration and authentication
- Paying with credit card or visa.
- Refunding money to the wallet for further use.
- Reporting issues and following up on their status.

## Code Examples

### Server.js

Example for the `server.js` file:

```javascript
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const medicineroute = require('./routes/medicine')
const app = express();
const cors = require('cors')



app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})
app.use(cors() )
app.use(express.json())

app.use('/api/medicine',medicineroute)

const { resolve } = require("path");
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

//app.use(express.static(process.env.STATIC_DIR));

app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

// send the publishable key to the front end
app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () =>{
            console.log('connected to db & listening on port',process.env.PORT)
        })
    })
    .catch((error)=>{
        console.log(error)
    })



```

### Medicine Model

Here is the medicine model example:

```javascript
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const medicineSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
    },
    medicinalUse: {
        type: String,
    },
    dosage: {
        type: String,
    },
    details: {
        type: String,
        required: true,
    },
  
    imageUrl: {
        type: String,
        default: 'https://www.default.com',
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    prescriptionRequired: {
        type: Boolean,
    },
    sales: {
        type: Number,
    },
    archived: {
        type: Boolean,
        default: false
    }  ,
    activeIngredient: {
        type: String, // Single active ingredient
        required: true,
    }, 

}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);

```

### Medicine Controller

Example of the medicine controller:

```javascript
const { mongo, default: mongoose } = require('mongoose')
const Medicine = require('../models/medicineModel')

// get all patients
const getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find({ archived: false });
        res.status(200).json(medicines);
    } catch (error) {
        // Handle error
        console.error('Error fetching medicines:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllMedicinesPharmacist = async (req, res) => {
    try {
        const medicines = await Medicine.find({});
        res.status(200).json(medicines);
    } catch (error) {
        // Handle error
        console.error('Error fetching medicines:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const archiveMedicine = async(req,res)=>{
    const {id} = req.params
    const medicine = await Medicine.findOneAndUpdate({_id: id}, {archived: true})
    if(!medicine){
        return res.status(400).json({ error: 'No such Medicine' })
    }
    res.status(200).json(medicine)
}

const unarchiveMedicine = async(req,res)=>{
    const {id} = req.params
    const medicine = await Medicine.findOneAndUpdate({_id: id}, {archived: false})
    if(!medicine){
        return res.status(400).json({ error: 'No such Medicine' })
    }
    res.status(200).json(medicine)
}

// get a specific patient(Search for one)
const getMedicine = async(req,res)=>{
    const {id} = req.params
    const { name } = req.query;
    const medicine = await Medicine.find({ name: { $regex: new RegExp(name, 'i') } })

    if(!patient){
        return res.status(404).json({error:'No Patient'})
    }
    res.status(200).json(medicine)

}

// create a medicine
const addMedicine = async (req, res) => {
    const { name, manufacturer,medicinalUse,dosage,details,imageURL,price,quantity,prescriptionRequired,sales } = req.body
    try {
        const medicine = await Medicine.create({ name, manufacturer,medicinalUse,dosage,details,imageURL,price,quantity,prescriptionRequired,sales})
        res.status(200).json(medicine)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//delete a patient
const deleteMedicine = async (req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ error: 'No Patient' })
    }
    const medicine = await Medicine.findOneAndDelete({_id: id})
    
    if(!medicine){
        return res.status(400).json({ error: 'No Patient' })
    }

    res.status(200).json(medicine)
}

//update patient info
const updateMedicine = async (req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ error: 'No Patient' })
    }
    const medicine = await Medicine.findOneAndUpdate({_id: id},{
        ...req.body
    })
    if(!medicine){
        return res.status(400).json({ error: 'No Patient' })
    }

    res.status(200).json(medicine)
}

//HAMOUDA FOLDER

const filterMedicine = async (req, res) => {
    try {
        const { medicinalUse } = req.query;

        if (!medicinalUse) {
            return res.status(400).json({ error: 'Medicinal use parameter is required' });
        }
        

        const medicines = await Medicine.find({ medicinalUse });

        if (medicines.length === 0) {
            return res.status(404).json({ error: 'No medicines found with the specified medicinal use' });
        }

        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// END HAMOUDA
module.exports = {
    getAllMedicines,
    getMedicine,
    addMedicine,
    deleteMedicine,
    updateMedicine,
    filterMedicine,
    archiveMedicine,
    unarchiveMedicine,
    getAllMedicinesPharmacist
}
```

### Frontend Shopcart Page

Frontend shopcart page example:

```javascript
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

```

### App.js

Frontend `app.js` example:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePeter from './pages/PeterHome'
import Navbar from './components/Navbar';
import HomePage from './pages/Landing';
import Filter from './pages/Filter';
import HanaHome from './pages/HanaHome';
import MedicineInfo from './components/ViewMed';
import MedicineDetails from './components/ViewMedDetails';
import AddPharmacist from './pages/addPharmacist';
import AddAdmin from './pages/addAdmin';
import RegiesteAsPatient from './pages/regiesteAsPatient';
import ViewPatientInfo from './pages/ViewPatientInfo';
import KhaledHome from './pages/KhaledHome';
import SearchBar from './components/Searchbar';
import ShopCart from './pages/ShopCart.js';
import CheckoutPage from './pages/CheckoutPage.js';
import ViewOrders from './pages/ViewOrders.js';
import Payment from'./pages/Payment.js';
import Completion from './components/Completion.js';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/ResetPassword';
import NotificationPage from './pages/Notifications';
import ConversationPage from './pages/Conversation.js';
import HomePagePatient from './pages/HomePagePatient';
import HomePagePharma from './pages/HomePagePharma';
import HomePageAdmin from './pages/HomePageAdmin';
import ViewSalesReport from './pages/viewSalesReport';
import FilterPatient from './pages/FilterPatient';
import ViewSalesReportAdmin from './pages/viewSalesReportAdmin';
import MedicineSearch from './pages/MedicineSearch';
import ConversationPagePatient from './pages/PatientConversations.js';
import DoctorConversation from './pages/DoctorConversation.js';
function App() {
  return (
    <div className="container">
    <div className="content">
      <BrowserRouter>
      {/* <SearchBar /> */}
        <Navbar />
        <div className="pages">
          <Routes>
          <Route path="/peter" element={<HomePeter />} />
            <Route path="/" element={<Login />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/landing" element={<HomePage />} />
            <Route path="/hamouda" element={<Filter />} />
            <Route path="/view-medicines" element={<MedicineInfo />} />
            <Route path="/filter-medicines" element={<MedicineDetails />} />
            <Route path="/hazem1" element={<AddPharmacist />} />
            <Route path="/hazem2" element={<AddAdmin />} />
            <Route path="/hazem3" element={<RegiesteAsPatient />} />
            <Route path="/malak" element={<ViewPatientInfo />} />
            <Route path="/khaled" element={<div><MedicineSearch /></div>} />
            <Route path="/khaledRequests" element={<div>< KhaledHome/></div>} />

            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path = "/conversation" element = {<ConversationPage />} />      

            <Route path="/shop" element={<ShopCart />} />
            <Route path = "/checkout" element={<CheckoutPage />} />
            <Route path = "/viewOrders" element = {<ViewOrders />} />
            <Route path = "/payment" element = {<Payment />} />
            <Route path = "/completion" element = {<Completion />} />
            <Route path = "/patient" element = {<HomePagePatient />} />
            <Route path = "/pharmacist" element = {<HomePagePharma />} />
            <Route path = "/admin" element = {<HomePageAdmin />} />
            <Route path="/viewSalesReport" element={<ViewSalesReport />} />

            <Route path="/filter-patient" element={<FilterPatient />} />
            <Route path="/viewSalesReportAdmin" element={<ViewSalesReportAdmin />} />
            <Route path="/patientConv" element={<ConversationPagePatient />} />
            <Route path="/doctorConv" element={<DoctorConversation />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  </div>
  );
}

export default App;

```

## Installation

1. Clone the repository from GitHub.
2. Create a `.env` file and add the following:

```env
PORT=4000
MONGO_URI = 'mongodb+srv://ahmedhamouda776:ACL123@rabenayostor.5zgv8bz.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp'
STRIPE_PUBLISHABLE_KEY="pk_test_51O4R2WJ6reglJIMrbT7RTKyuwYmIFnSp0hbD9CKUiQJp7uw0ZoV6ClIimQ1CnkIXxf8mxYEHE4ouO2vWRCTcnw7t00p5tUfsb3"
STRIPE_SECRET_KEY="sk_test_51O4R2WJ6reglJIMrC5OBVfvk5frEdn3RLdV51Z9HrEFMyY9jJPIaSw4yrGX1XZMwu2FP5Dl9AZ5ep5gP9TYBi0oP00zMiFnOTc"

```

3. Open a new terminal.
4. Navigate to the `backend` directory.
5. Run `npm install` followed by `node server.js`.
6. Open a new terminal.
7. Navigate to the `frontend` directory.
8. Run `npm install` followed by `npm start`.

## API References

### Medicines

**Get all medicines**
- GET /getAllMedicines
- Get a list of all medicines.

**Get a specific medicine**
- GET /getMedicine/:id
- Get information about a specific medicine by its ID.

**Add a new medicine**
- POST /addMedicine
- Add a new medicine to the database.

**Delete a medicine**
- DELETE /deleteMedicine/:id
- Delete a medicine from the database by its ID.

**Update a medicine**
- PATCH /updateMedicine/:id
- Update the information of a specific medicine by its ID.

**Filter medicines**
- GET /filterMedicine
- Filter and retrieve medicines based on specific criteria.

### Users

**Create a new patient**
- POST /createPatient
- Register a new patient.

**Create a new pharmacist**
- POST /createPharmacist
- Register a new pharmacist.

**Create a new admin**
- POST /admin
- Register a new admin.

**Get all patients**
- GET /getAllPatients
- Get a list of all registered patients.

**Get all admins**
- GET /getAllAdmins
- Get a list of all registered admins.

**Admin login**
- POST /admin/Login
- Log in as an admin.

**Admin sign up**
- POST /adminSignUp
- Sign up as an admin.

**Patient login**
- POST /Patient/Login
- Log in as a patient.

**Patient sign up**
- POST /PatientSignUp
- Sign up as a patient.

### Cart

**Add medicine to cart**
- POST /addMedicineToCart/:UserName/:name
- Add a medicine to the user's cart.

**Get cart items**
- GET /getCartItems/:UserName
- Retrieve the items in the user's cart.

**Delete medicine from cart**
- DELETE /deleteMedicineFromCart/:UserName/:name
- Remove a medicine from the user's cart.

**Change quantity in cart**
- PUT /changeQuantityInCart/:UserName/:name/:newQuantity
- Change the quantity of a medicine in the user's cart.

**Add address**
- POST /addAddress/:UserName
- Add a new address for the user.

**Get addresses**
- GET /getAddresses/:UserName
- Retrieve the user's addresses.

**Zero cart amount**
- PUT /zeroAmount/:UserName
- Set the cart total amount to zero.

**Checkout**
- PUT /checkOut/:UserName
- Process the checkout for the user's cart.

**Choose address for order**
- PUT /chooseAddress/:UserName
- Select an address for the order.

**Pay with wallet**
- PUT /payWithWallet/:UserName
- Pay for an order using the user's wallet balance.

**View orders**
- GET /viewOrders/:UserName
- Retrieve the user's order history.

**View pharmacist request**
- GET /viewPharmacistRequest
- View pending pharmacist registration requests.

**View pharmacists' requests**
- GET /viewPharmacistsRequests
- View a list of all pharmacist registration requests.

**Search for a medicine**
- GET /searchMedicine
- Search for medicines based on specific criteria.

**View patient information**
- GET /patientinfo
- View detailed information about a patient.

**Reject pharmacist request**
- DELETE /rejectPharmacistRequest/:UserName
- Reject a pending pharmacist registration request by their username.

**Accept pharmacist request**
- POST /acceptPharmacistRequest/:UserName
- Accept a pending pharmacist registration request by their username.

**Get wallet balance**
- GET /getWallet/:UserName
- Retrieve the wallet balance of a user.

**Pay with wallet balance**
- PUT /payWithWallet/:UserName
- Make a payment using the user's wallet balance.

**View order history**
- GET /viewOrders/:UserName
- Retrieve the order history for a user.

**Remove order**
- DELETE /removeOrder/:UserName/:orderId
- Remove a specific order from a user's order history.

**Process payment**
- POST /payment
- Process a payment for an order.

### Notifications

**Create a new notification**
- POST /createNotification
- Create a new notification.

**Delete a notification**
- DELETE /deleteNotification/:notificationId
- Delete a specific notification by its notification ID.

**Get all notifications**
- POST /getAllNotifications
- Retrieve all notifications.

### Conversations

**Get conversation with a patient**
- POST /getConversationPatient
- Retrieve the conversation between a pharmacist and a patient.

**Get conversation with a pharmacist**
- POST /getConversationPharmacist
- Retrieve the conversation between a patient and a pharmacist.

**Send a message to a pharmacist**
- POST /sendMessagePharmacist
- Send a message to a pharmacist as part of a conversation.

**Get messages**
- POST /getMessages
- Retrieve messages from a conversation.

### Checkout with Card

**Checkout with a card**
- PUT /checkOutWithCard/:UserName
- Perform a checkout with a card payment for the user.

### Pharmacist Wallet

**Get pharmacist's wallet balance**
- GET /getWalletPharma/:UserName
- Retrieve the wallet balance of a pharmacist.

### Sales Reports

**View sales report for a specific year and month**
- GET /salesReport/:year/:month
- Retrieve a sales report for a specific year and month.

**Filter sales report by day for a specific year, month, and day**
- GET /salesReport/:year/:month/:day
- Filter and retrieve sales data for a specific year, month, and day.

**Filter sales report by medicine name for a specific year and month**
- GET /filterSalesReport/:year/:month/:name
- Filter and retrieve sales data for a specific year, month, and medicine name.

## Tests

Testing for now using Postman and MongoDB.

## How to Use?

1. **Login:**
   - Select user type (patient/admin/Pharmacist).
   - Type your username/password then login.
   - Option to reset your password, and an OTP will be sent to your mail.
   - If you don’t have a username and password, you can register.

2. **Logout:**
   - Press the logout button.

3. **Pharmacist:**
   - If logged in as a pharmacist, you can add/edit medicines, shop, view all medicines, and add admins/pharmacists.

4. **Admin:**
   - Similar functionalities as the pharmacist.

5. **Patient:**
   - Register as a patient, view basic info, search, and view medicines.

## Contribute

We welcome contributions from the community to enhance the project. Whether you want to report a bug, propose a new feature, or submit a pull request, here's how you can contribute:

1. Clone the repository.
2. Install dependencies.
3. Create a branch and do your work.
4. Provide messages for the creators to view.
5. Commit and push your work.
6. Wait for the creator to view your work and to be merged if master approved upon.

Feedback is valuable! If you have suggestions or questions, feel free to reach out. Thank you for contributing!

## Credits

We used online YouTube video channel: Net Ninja (MERN stack crash course).

We would like to extend our thanks to the following individuals for their contributions to this project:


- Hana Elmoatasem
- Peter Ashraf
- Ahmed Hamouda
- Khaled Magdy
- Malak Wael
- Peter Youssef
- Mohamed Ahmed
- Hazem Nasser

Without the help of these individuals, this project would not have been possible. Thank you for your support!

## License

This project uses Stripe to process. By using this project, you agree to be bound by the Stripe Services Agreement.

You can find the full text of the Stripe Services Agreement at the following link: [Stripe Legal](https://stripe.com/legal).

Please make sure to read and understand the Stripe Services Agreement before using this project. If you have any questions about the Stripe Services Agreement or how it applies to your use of this project, please contact Stripe at support@stripe.com.
