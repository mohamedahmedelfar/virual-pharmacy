// controllers/medicineController.js
const Medicine = require('../models/medicineModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Pharmacist = require('../models/pharmacists.js');

const showMedicine = async (req, res) => {


  const medicines = await Medicine.find();
  
   if (!medicines)
   {
    return res.status(404).json({error: 'no medicine'})
   }
   const simplifiedMedicines = medicines.map(({name, price, details, imageUrl }) => ({
    name,
    price,
    details,
    imageUrl,
  }));
   
   res.status(200).json(simplifiedMedicines);
 
  }
;
const viewMedicineDetails = async (req, res) => {
  try {
    // Retrieve all medicines from the database
    const medicines = await Medicine.find();

    // Check if there are any medicines
    if (!medicines || medicines.length === 0) {
      return res.status(404).json({ error: 'No medicine found' });
    }

    // Create an array of medicine names
    const info = medicines.map(({name, quantity, sales }) => ({
      name,
      quantity,
      sales,
     
    }));

    // Send the array as response
    res.status(200).json({ info });
  } catch (error) {
    // Handle potential errors, such as database issues
    res.status(500).json({ error: 'Server error' });
  }
};
const generateToken = (pharmacistId) => {
  return jwt.sign({ pharmacistId }, 'your-secret-key', { expiresIn: '1h' });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the pharmacist by username
    const pharmacist = await Pharmacist.findOne({ UserName: username });

    if (!pharmacist) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Validate the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, pharmacist.Password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate and send a token upon successful login
    const token = generateToken(pharmacist._id);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getWalletPharma = async (req, res) => {
  try {
    const { UserName } = req.params;

    const pharmacist = await Pharmacist.findOne({ UserName });

    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist not found' });
    }

    return res.status(200).json({ wallet: pharmacist.wallet });
  } catch (error) {
    return res.status(500).json({ message: 'Error getting wallet' });
  }
};


module.exports={showMedicine,viewMedicineDetails,login,getWalletPharma};