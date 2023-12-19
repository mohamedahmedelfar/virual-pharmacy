const requestRegisterAsPharmacist = require('../models/requestRegisterAsPharmacist');
const  Request = require('../models/requestRegisterAsPharmacist')
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

//create new pharmacist
const createPharmacist = async(req, res) => {
    const{UserName,Name,Email,Password,DateOfBirth,HourlyRate,AffiliatedHospital,Education} = req.body
    const idFile = req.files['idFile'][0];
    const degreeFile = req.files['degreeFile'][0];
    const licenseFile = req.files['licenseFile'][0];
    const idFileData = fs.readFileSync(idFile.path);
    const degreeFileData = fs.readFileSync(degreeFile.path);
    const licenseFileData = fs.readFileSync(licenseFile.path);
    try{
        const pharm = await Request.create({UserName,Name,Email,Password,DateOfBirth,HourlyRate,AffiliatedHospital,Education,
      idFile: {
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
      }})
        const savedPharm = await pharm.save();
        res.status(201).json({savedPharm})
    }catch(error){
        res.status(400).json({error: 'cannot create a request to be a pharmacist'})
    }
}

const uploadMiddleware = upload.fields([
    { name: 'idFile', maxCount: 1 },
    { name: 'degreeFile', maxCount: 1 },
    { name: 'licenseFile', maxCount: 1 },
  ]);

//get all pharmacists
const getAllPharmacist= async(req, res) => {
    try{
        const pharmacist = await requestRegisterAsPharmacist.find()
        res.status(200).json({pharmacist})
    }catch(error){
        res.status(400).json({message: 'cannot get all pharmacists'})
    }
}

module.exports = {
    getAllPharmacist,
    createPharmacist,
    uploadMiddleware
}
