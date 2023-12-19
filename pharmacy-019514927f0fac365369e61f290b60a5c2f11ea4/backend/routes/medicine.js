const express = require('express');
const medicine = require('../models/medicineModel')
const{
    getAllMedicines,
    getMedicine,
    addMedicine,
    deleteMedicine,
    updateMedicine,
    filterMedicine,
    getAllMedicinesPharmacist,
    archiveMedicine,
    unarchiveMedicine
} = require('../controllers/medicineController')

const {
    createPatient,
    getAllPatients,
    Patientlogin,
    PatientsignUp,
    updatePatientPassword,
    PatientsendOtpAndSetPassword,
    addAddress,
    getWallet,

} = require('../controllers/RegesterPatientController')

const {
    createPharmacist,
    getAllPharmacist,
    uploadMiddleware
} = require('../controllers/requestPharmacistController')

const{
    createAdmin,
    getAllAdmins,
    login,
    signUp,
    logout,
    updateAdminPassword,
    sendOtpAndSetPassword
} = require('../controllers/addAdminController')

const{
    viewPharmacistRequest,
    viewPharmacistsRequests,
    viewPatientInfo,
    rejectPharmacistRequest,
    acceptPharmacistRequest,
    PharmacistsignUp,
    Pharmacistlogin,
    updatePharmacistPassword,
    PharmacisttsendOtpAndSetPassword
} = require('../controllers/adminController')

const {
    searchMedicine,
    viewSales,
    filterSalesByDay,
    filterSalesByName
} = require('../controllers/generalController')

const {
    addMedicineToCart,
    getCartItems,
    deleteMedicineFromCart,
    changeQuantityInCart,
    getAddresses,
    zeroAmount,
    checkOut,
    chooseAddress,
    payWithWallet,
    viewOrders,
    removeOrder,
    payment,
    checkOutWithCard,
    
} = require ('../controllers/cartController')

const{
    createNotification,
    deleteNotification,
    getAllNotifications
} = require('../controllers/notificationsController');
const{
    getConversationPatient,
    getConversationPharmacist,
    sendMessagePharmacist,
    getMessages,
    sendMessagePatient,
    getConversationPharmacistForDoctor
} = require('../controllers/conversationController')
const pharma = require('../controllers/pharma');
const patient = require('../controllers/patient');
const admin = require('../controllers/admin');
const router = express.Router()

router.get('/getAllMedicines',getAllMedicines)
router.get('/getAllMedicinesPharmacist',getAllMedicinesPharmacist)

router.get('/getMedicine/:id', getMedicine)

router.post('/addMedicine', addMedicine)

router.delete('/deleteMedicine/:id',deleteMedicine)

router.patch('/updateMedicine/:id', updateMedicine)

router.get('/filterMedicine',filterMedicine)

router.get('/show', admin.showMedicine);
router.get('/show/admin', admin.showMedicine);
router.get('/show/patient', patient.showMedicine);
router.get('/show/pharma', pharma.showMedicine);

router.get('/view',pharma.viewMedicineDetails )

//post new patient
router.post('/createPatient',createPatient)

//post new pharmacist
router.post('/createPharmacist',uploadMiddleware,createPharmacist)

//post new admin 
router.post('/admin', createAdmin)
//get all patients
router.get('/getAllPatients',getAllPatients)
//get all admins
router.get('/getAllAdmins',getAllAdmins)

//Notifications
router.post('/createNotification', createNotification);
router.delete('/deleteNotification/:notificationId', deleteNotification);
router.post('/getAllNotifications', getAllNotifications);
//Conversations
router.post('/getConversationPatient', getConversationPatient);
router.post('/getConversationPharmacist', getConversationPharmacist);
router.post('/sendMessagePharmacist', sendMessagePharmacist);
router.post('/getMessages', getMessages);
router.post('/sendMessagesPatient',sendMessagePatient);
router.post('/getConversationPharmacistForDoctor', getConversationPharmacistForDoctor);
//login
router.post('/admin/Login', login)

//sign up
router.post('/adminSignUp', signUp)

//Patient login
router.post('/Patient/Login', Patientlogin)

//Patient sign up
router.post('/PatientSignUp', PatientsignUp)

//logout
router.get('/logout', logout)

//Pharmacist login
router.post('/Pharmacist/Login', Pharmacistlogin)

//Pharmacist sign up
router.post('/PharmacistSignUp',uploadMiddleware, PharmacistsignUp)

//update admin password
router.post('/updateAdminPassword', updateAdminPassword)

//update patient password
router.post('/updatePatientPassword', updatePatientPassword)

//update pharmacist password
router.post('/updatePharmacistPassword', updatePharmacistPassword)

//send otp and set password admin
router.post('/AdminsendOtpAndSetPassword', sendOtpAndSetPassword)

//send otp and set password patient
router.post('/PatientsendOtpAndSetPassword', PatientsendOtpAndSetPassword)

//send otp and set password pharmacist
router.post('/PharmacisttsendOtpAndSetPassword', PharmacisttsendOtpAndSetPassword)


	
router.post('/archiveMedicine/:id', archiveMedicine)
router.post('/unarchiveMedicine/:id', unarchiveMedicine)
router.get('/salesReport/:year/:month', viewSales);
router.get('/salesReport/:year/:month/:day', filterSalesByDay);
router.get('/filterSalesReport/:year/:month/:name', filterSalesByName);

//get all pharmacist
router.get('/getPharmacist',getAllPharmacist)

//reject a pharmacist request
router.delete('/rejectPharmacistRequest/:UserName', rejectPharmacistRequest)
//accept a pharmacist request
router.post('/acceptPharmacistRequest/:UserName', acceptPharmacistRequest)


router.get("/viewPharmacistRequest", viewPharmacistRequest);
router.get("/viewPharmacistsRequests", viewPharmacistsRequests);
router.get("/searchMedicine", searchMedicine);
router.get('/patientinfo',viewPatientInfo)


//Hamouda Cart!
router.post('/addMedicineToCart/:UserName/:name', addMedicineToCart);
router.get('/getCartItems/:UserName', getCartItems);
router.delete ('/deleteMedicineFromCart/:UserName/:name', deleteMedicineFromCart);
router.put('/changeQuantityInCart/:UserName/:name/:newQuantity', changeQuantityInCart);
router.post('/addAddress/:UserName', addAddress);
router.get('/getAddresses/:UserName', getAddresses);
router.put('/zeroAmount/:UserName', zeroAmount);
router.put('/checkOut/:UserName', checkOut);
router.put('/chooseAddress/:UserName', chooseAddress);
router.get('/getWallet/:UserName', getWallet);
router.put('/payWithWallet/:UserName', payWithWallet);
router.get('/viewOrders/:UserName', viewOrders);
router.put('/removeOrder/:UserName/:orderId', removeOrder);
router.post('/payment', payment);
router.put('/checkOutWithCard/:UserName', checkOutWithCard);
router.get('/getWalletPharma/:UserName', pharma.getWalletPharma);
//Hamouda Cart!
module.exports = router