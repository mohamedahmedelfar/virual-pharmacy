const AddAdmin = require('../models/addAdmin')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');


//create a new admin
const createAdmin = async(req, res) => {
    const{AdminUserName,AdminPassword} = req.body
    try{
        const admin = await AddAdmin.create({AdminUserName,AdminPassword})
        res.status(200).json({admin})
    }catch(error){
        res.status(400).json({error: 'Admin could not be created'})

    }
}
//get all admins
const getAllAdmins = async(req, res) => {
    try{
        const admins = await AddAdmin.find()
        res.status(200).json({admins})
    }catch(error){
        res.status(400).json({message: 'cannot get all admins'})
    }
}

//login
const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
    return jwt.sign({ name }, 'supersecret', {
        expiresIn: maxAge
    });
};

const signUp = async (req, res) => {
    const { AdminUserName, AdminPassword } = req.body;
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(AdminPassword, salt);
        const user = await AddAdmin.create({ AdminUserName: AdminUserName,  AdminPassword: hashedPassword });
        const token = createToken(user.AdminUserName);

        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const login = async (req, res) => {
    // TODO: Login the user
    const { AdminUserName, AdminPassword } = req.body;
    try {
        const user = await AddAdmin.findOne({ AdminUserName : AdminUserName});
        if (user) {
            const auth = await bcrypt.compare(AdminPassword, user.AdminPassword);
            if (auth) {
                const token = createToken(user.AdminUserName);
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

//change password

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

const sendOtpAndSetPassword = async (req, res) => {
    const { AdminUserName , AdminEmail } = req.body;
  
    try {
      const user = await AddAdmin.findOne({ AdminUserName });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Generate OTP
      const otp = generateNumericOTP(); // You may need to configure OTP generation options
  
      // Update user's password with the OTP
      const hashedNewPassword = await bcrypt.hash(otp, 10);
      user.AdminPassword = hashedNewPassword;
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
        to: AdminEmail,
        subject: 'Password Reset OTP',
        text: `Your new Admin OTP is: ${otp}`,
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
  
module.exports = {
    getAllAdmins,
    createAdmin,
    signUp,
    login,
    logout,
    updateAdminPassword,
    sendOtpAndSetPassword,
    
}