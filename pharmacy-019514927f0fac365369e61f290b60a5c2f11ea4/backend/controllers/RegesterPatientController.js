const addPatient = require('../models/regesterAsPatient');
const mongoose = require('mongoose');
const Cart = require('../models/cartModel'); // (HAMOUDA)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

// Create a new Cart document. (HAMOUDA)
const createCart = async (patientId) => {
    const cart = new Cart({
        patient: patientId,
    });

    // Save the Cart document to the database without validation
    await cart.save({ validateBeforeSave: false });

    return cart;
};

 

//create new patient
const createPatient = async (req, res) => {
    const { UserName, Name, Email, Password, DateOfBirth, Gender, MobileNumber, EmergencyContact } = req.body;
    try {
        const patient = await addPatient.create({
            UserName,
            Name,
            Email,
            Password,
            DateOfBirth,
            Gender,
            MobileNumber,
            EmergencyContact,
        });

        // Pass the patient._id to createCart
        const updatedCart = await createCart(patient._id);

        // Update the patient with the new cart
        patient.cart = updatedCart._id;
        await patient.save();

        res.status(201).json({ patient });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Patient could not be created' });
    }
};



//get all patients
const getAllPatients = async(req, res) => {
    try{
        const patients = await addPatient.find()
        res.status(200).json({patients})
    }catch(error){
        res.status(400).json({message: 'cannot get all patients'})
    }
}


//login
const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
    return jwt.sign({ name }, 'supersecret', {
        expiresIn: maxAge
    });
};

const PatientsignUp = async (req, res) => {
  const{UserName,Name,Email,Password,DateOfBirth,Gender,MobileNumber,EmergencyContact }=req.body
  try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(Password, salt);
      const user = await addPatient.create({UserName,Name,Email,Password:hashedPassword,DateOfBirth,Gender,MobileNumber,EmergencyContact });
      const token = createToken(user.UserName);

      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json(user)
  } catch (error) {
      res.status(400).json({ error: error.message })
  }
}

const Patientlogin = async (req, res) => {
  // TODO: Login the user
  const { UserName, Password } = req.body;
  try {
      const user = await addPatient.findOne({ UserName : UserName});
      if (user) {
          const auth = await bcrypt.compare(Password, user.Password);
          if (auth) {
              const token = createToken(user.UserName);
              res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
              res.status(200).json({user})
          } else {
              res.status(400).json({ error: "Wrong password" })
          }
      } else {
          res.status(400).json({ error: "User not found" })
      }
  } catch (error) {
      res.status(400).json({ error: error.message })
  }
}

//logout
const logout = async (req, res) => {
  // TODO Logout the user
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json("logged out")
  //res.clearCookie('jwt');
  //res.status(200)
}

//update patient password
const updatePatientPassword = async (req, res) => {
  const { Patientusername, currentPassword, newPassword } = req.body;

  try {
    // Retrieve the admin user by username
    const user = await addPatient.findOne({ UserName: Patientusername });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the current password is correct
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.Password);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Check if the new password meets the specified criteria
    const newPasswordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!newPassword.match(newPasswordRegex)) {
      return res.status(400).json({
        error: 'New password must contain at least one capital letter and one number, and be at least 6 characters long',
      });
    }

    // Hash and update the password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.Password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//reset password
const updateAdminPassword = async (req, res) => {
  const { AdminUserName, currentPassword, newPassword } = req.body;

  try {
    // Retrieve the admin user by username
    const user = await AddAdmin.findOne({ AdminUserName });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the current password is correct
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.AdminPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Check if the new password meets the specified criteria
    const newPasswordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!newPassword.match(newPasswordRegex)) {
      return res.status(400).json({
        error: 'New password must contain at least one capital letter and one number, and be at least 6 characters long',
      });
    }

    // Hash and update the password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.AdminPassword = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//resetpass
const generateNumericOTP = (length) => {
  const otpLength = length || 6; // Default length is 6 if not provided
  let otp = '';

  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10); // Generate a random digit (0-9)
  }

  return otp;
};

const PatientsendOtpAndSetPassword = async (req, res) => {
  const { UserName , Email } = req.body;

  try {
    const user = await addPatient.findOne({ UserName });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTP
    const otp = generateNumericOTP(); // You may need to configure OTP generation options

    // Update user's password with the OTP
    const hashedNewPassword = await bcrypt.hash(otp, 10);
    user.Password = hashedNewPassword;
    await user.save();

    // Send OTP to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'peteraclsender@gmail.com',
        pass: 'tayr rzwl yvip tqjt',
      },
    });
    const mailOptions = {
      from: 'peteraclsender@gmail.com',
      to: Email,
      subject: 'Password Reset OTP',
      text: `Your new Patient OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Error sending OTP via email' });
      }
      res.status(200).json({ message: 'OTP sent successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add an address to a patient (hamouda)
const addAddress = async (req, res) => {
    try {
      const { UserName } = req.params;
      const { street, city, state, zipCode } = req.body;
  
      const patient = await addPatient.findOne({ UserName });
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

         // Check if the address already exists
    const existingAddress = patient.addresses.find(
        (address) =>
          address.street === street &&
          address.city === city &&
          address.state === state &&
          address.zipCode === zipCode
      );
      if (existingAddress) {
        return res.status(400).json({ message: 'Address already exists' });
      }
  
      // Add the new address to the addresses array
      const newAddress = { street, city, state, zipCode };
      patient.addresses.push(newAddress);
  
      // Save changes to the patient
      await patient.save();
  
      return res.status(201).json({ message: 'Address added successfully', address: newAddress });
    } catch (error) {
      return res.status(500).json({ message: 'Error adding address' });
    }
  };

  const getWallet = async (req, res) => {
    try {
      const { UserName } = req.params;
  
      const patient = await addPatient.findOne({ UserName });
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      return res.status(200).json({ wallet: patient.wallet });
    } catch (error) {
      return res.status(500).json({ message: 'Error getting wallet' });
    }
  };

module.exports = {  
    createPatient,
    getAllPatients,
    addAddress,
    getWallet,
    Patientlogin,
    PatientsignUp,
    logout,
    updatePatientPassword,
    PatientsendOtpAndSetPassword,
    updateAdminPassword,
    
    
    
}