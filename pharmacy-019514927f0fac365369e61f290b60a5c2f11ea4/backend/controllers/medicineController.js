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