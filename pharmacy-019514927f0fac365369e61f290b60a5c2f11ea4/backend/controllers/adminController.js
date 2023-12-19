const PharmacistRequest = require('../models/requestRegisterAsPharmacist.js');
const Patient = require('../models/regesterAsPatient.js');
const pharmacist = require('../models/pharmacists.js');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const  Request = require('../models/requestRegisterAsPharmacist')

// const createPharmacistRequest = async (req, res) => {
//     try {
//         const { Name, Email, PharmacistID, PharmacyDegree, WorkingLicenses } = req.body;
//         const newPharmacistRequest = new PharmacistRequest({ Name, Email, PharmacistID, PharmacyDegree, WorkingLicenses });
//         await newPharmacistRequest.save();
//         res.status(201).json(newPharmacistRequest);
//     } catch (error) {
//         res.status(409).json({ message: error.message });
//     }
// }

const viewPharmacistsRequests = async (req, res) => {
    try {
        const pharmacistRequest = await PharmacistRequest.find();
        res.status(200).json(pharmacistRequest);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const viewPharmacistRequest = async (req, res) => {
    const { UserName } = req.body;
    try {
        const pharmacistRequest = await PharmacistRequest.findOne({ UserName: UserName });
        res.status(200).json(pharmacistRequest);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
const viewPatientInfo = async (req, res) => {
    try {
        const { patientUsername } = req.query;

        // Find patient by ID in the database
        const patient = await Patient.find(patientUsername);
        console.log(patient)

        // Check if patient exists
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const patientInfo = {
            username: patient.UserName,
            name: patient.Name,
            email: patient.Email,
            dateofbirth: patient.DateOfBirth,
            gender: patient.Gender,
            mobilenumber: patient.MobileNumber,
            //  emergencyfullname: patient.EmergencyContact.FullName,
            // emergencynumber: patient.EmergencyContact.MobileNumberEmergency,
            // Include other patient information fields as needed
        };

        res.status(200).json(patientInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const rejectPharmacistRequest = async (req, res) => {
    const { UserName } = req.params; // Assuming you're passing UserName as a parameter
    try {
        const deletedRequest = await PharmacistRequest.deleteOne({ UserName: UserName });
        if (!deletedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json(deletedRequest);
        console.log('Pharmacist request is deleted');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const acceptPharmacistRequest = async (req, res) => {
    // Create a new pharmacist based on the requestData
    const { UserName } = req.params;
    const pharmacistAccepted = await PharmacistRequest.findOne({ UserName });
    const newPharmacist = new pharmacist({
        UserName: pharmacistAccepted.UserName,
        Name: pharmacistAccepted.Name,
        Email: pharmacistAccepted.Email,
        Password: pharmacistAccepted.Password,
        DateOfBirth: pharmacistAccepted.DateOfBirth,
        HourlyRate: pharmacistAccepted.HourlyRate,
        AffiliatedHospital: pharmacistAccepted.AffiliatedHospital,
        Education: pharmacistAccepted.Education,
        idFile: pharmacistAccepted.idFile,
        degreeFile: pharmacistAccepted.degreeFile,
        licenseFile: pharmacistAccepted.licenseFile,
    });

    try {
        // Save the new pharmacist to the database
        const savedPharmacist = await newPharmacist.save();
        console.log('New pharmacist has been created:', savedPharmacist);
        try {
            const deletedRequest = await PharmacistRequest.deleteOne({ UserName: UserName });
            if (!deletedRequest) {
                return res.status(404).json({ message: 'Request not found' });
            }
            res.status(200).json(deletedRequest);
            console.log('Pharmacist request is deleted');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        return savedPharmacist;
    } catch (error) {
        console.error('Error creating a new pharmacist:', error);
        throw error; // You can handle the error as needed
    }
};

//login
const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
    return jwt.sign({ name }, 'supersecret', {
        expiresIn: maxAge
    });
};

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDirectory = path.join(__dirname, '../../frontend/public/uploads');
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}-${file.fieldname}${ext}`;
      cb(null, filename);
    },
  });
  
  const upload = multer({ storage: storage });

const PharmacistsignUp = async (req, res) => {
    const { UserName, Password,
        Name,
        Email,
        DateOfBirth,
        HourlyRate,
        AffiliatedHospital, Education } = req.body;
        const idFile = req.files['idFile'][0];
        const degreeFile = req.files['degreeFile'][0];
        const licenseFile = req.files['licenseFile'][0];
        const idFileData = fs.readFileSync(idFile.path);
        const degreeFileData = fs.readFileSync(degreeFile.path);
        const licenseFileData = fs.readFileSync(licenseFile.path);
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(Password, salt);
        const user = await Request.create({ UserName, Password: hashedPassword, Name, Email, DateOfBirth, HourlyRate, AffiliatedHospital, Education,  idFile: {
            data: idFileData,
            contentType: idFile.mimetype
        },
        degreeFile: {
            data: degreeFileData,
            contentType: degreeFile.mimetype
        },
        licenseFile: {
            data: licenseFileData,
            contentType: licenseFile.mimetype
        } });
        const token = createToken(user.UserName);

        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const Pharmacistlogin = async (req, res) => {
    // TODO: Login the user
    const { UserName, Password } = req.body;
    try {
        const user = await pharmacist.findOne({ UserName: UserName });
        if (user) {
            const auth = await bcrypt.compare(Password, user.Password);
            if (auth) {
                const token = createToken(user.UserName);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(200).json({ user })
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

//update pharmacist password
const updatePharmacistPassword = async (req, res) => {
    const { Pharmacistusername, currentPassword, newPassword } = req.body;

    try {
        // Retrieve the admin user by username
        const user = await pharmacist.findOne({ UserName: Pharmacistusername });

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

//resetpass
const generateNumericOTP = (length) => {
    const otpLength = length || 6; // Default length is 6 if not provided
    let otp = '';
  
    for (let i = 0; i < otpLength; i++) {
      otp += Math.floor(Math.random() * 10); // Generate a random digit (0-9)
    }
  
    return otp;
  };

const PharmacisttsendOtpAndSetPassword = async (req, res) => {
    const { UserName , Email } = req.body;
  
    try {
      const user = await pharmacist.findOne({ UserName });
  
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
        text: `Your new Pharmacist OTP is: ${otp}`,
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
    viewPharmacistRequest, viewPharmacistsRequests, viewPatientInfo, rejectPharmacistRequest, acceptPharmacistRequest, PharmacistsignUp, Pharmacistlogin, logout,
    updatePharmacistPassword, PharmacisttsendOtpAndSetPassword
};