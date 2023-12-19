const Medicine = require('../models/medicineModel.js');
const { default: mongoose } = require('mongoose');
const { response } = require('express');
const sales = require ('../models/sales.js');

// const addMedicine = async (req, res) => {
//     try{
//         const Name = req.body.Name.toLowerCase()
//         const MedicineID = req.body.MedicineID
//         //const {Name, MedicineID} = req.body
//         const newMedicine = new Medicine ({Name, MedicineID})
//         await newMedicine.save()
//         res.status(201).json(newMedicine)
//     }
//     catch(error){
//         res.status(409).json({error: error.message})
//     }
// }

const searchMedicine = async (req, res) => {
    const  Name  = req.query.query
    try {
        const medicine = await Medicine.findOne({ name: Name });
        if (medicine == null){
            console.log("medicine is null")
            res.status(404).json({ message: "Medicine not found" });
        }
        else{
            res.status(200).json([medicine]);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
    // app.listen(4000, () => {
    //     console.log(`Server is running on port ${port}`);
    //   });
}

const viewSales = async (req, res) => {
    const month = req.params.month
    const year = req.params.year
    try {
        const Sales = await sales.find({ year: year, month: month });
        //console.log(Sales)
        if (Sales == null){
            console.log("sales is null")
            res.status(404).json({ message: "Sales not found" });
        }
        else{
            res.status(200).json([Sales]);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const filterSalesByDay = async (req, res) => {
    const month = req.params.month
    const year = req.params.year
    const day = req.params.day
    try {
        const Sales = await sales.find({ year: year, month: month, day: day });
        //console.log(Sales)
        if (Sales == null){
            console.log("sales is null")
            res.status(404).json({ message: "Sales not found" });
        }
        else{
            res.status(200).json([Sales]);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const filterSalesByName = async (req, res) => {
    const month = req.params.month
    const year = req.params.year
    const name = req.params.name
    console.log("entered here: ", name)
    console.log("entered here: ", month)
    try {
        const Sales = await sales.find({ year: year, month: month, 'items.medicine': { $in: [name] } });
        //console.log(Sales)
        if (Sales == null){
            console.log("sales is null")
            res.status(404).json({ message: "Sales not found" });
        }
        else{
            res.status(200).json([Sales]);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = {searchMedicine, viewSales, filterSalesByDay, filterSalesByName};