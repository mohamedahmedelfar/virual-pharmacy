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
