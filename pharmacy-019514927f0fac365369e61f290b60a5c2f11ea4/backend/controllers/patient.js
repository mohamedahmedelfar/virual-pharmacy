// controllers/medicineController.js
const Medicine = require('../models/medicineModel.js');
const bcrypt = require('bcrypt');
const Patient = require('../models/regesterAsPatient.js');
const nodemailer = require('nodemailer');


const showMedicine = async (req, res) => {

  const medicines = await Medicine.find();

  if (!medicines) {
    return res.status(404).json({ error: 'no medicine' })
  }
  const simplifiedMedicines = medicines.map(({ name, price, details, imageUrl }) => ({
    name,
    price,
    details,
    imageUrl,
  }));

  res.status(200).json(simplifiedMedicines);

};

const changePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    // Find the pharmacist by username
    const pharmacist = await Patient.findOne({ UserName: username });

    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist not found' });
    }

    // Validate the current password using bcrypt
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, pharmacist.Password);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    // Update the password with the new one
    pharmacist.Password = await bcrypt.hash(newPassword, 10);
    await pharmacist.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset Password


const sendOtp = async (req, res) => {
  const { username, email } = req.body;

  try {

    // Generate OTP
    const otp = '123456';

    // Save the OTP in the database for verification if needed

    // Send the OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'peterACLsender@gmail.com',  // Replace with your email
        pass: 'peter@123',   // Replace with your email password
      },
    });

    const mailOptions = {
      from: 'peterACLsender@gmail.com',    // Replace with your email
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Sending OTP failed:', error);
        return res.status(500).json({ message: 'Failed to send OTP' });
      }

      console.log('OTP sent:', info.response);
      res.json({ message: 'OTP sent successfully' });
    });
  } catch (error) {
    console.error('Sending OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  const { username, email, otp, newPassword } = req.body;

  // Validate the OTP (you might want to store the OTP in the database and verify it here)

  // For simplicity, let's assume the OTP is hardcoded for demonstration purposes
  const storedOtp = '123456';

  if (otp !== storedOtp) {
    return res.status(401).json({ message: 'Invalid OTP' });
  }

  try {
    // Find the pharmacist by username and email
    const pharmacist = await Patient.findOne({ UserName: username, Email: email });

    if (!pharmacist) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update the password with the new one
    pharmacist.Password = await bcrypt.hash(newPassword, 10);
    await pharmacist.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = { showMedicine , changePassword , sendOtp , resetPassword };