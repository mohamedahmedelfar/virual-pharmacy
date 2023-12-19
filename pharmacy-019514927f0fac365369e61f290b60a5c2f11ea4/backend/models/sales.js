const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  // Reference to the medicine being sold
  medicine: {
    type: String,
    ref: 'Medicine',
    required: true,
  },
  // Quantity of the medicine sold
  quantity: {
    type: Number,
    required: true,
  },
  // Total price of the sale for this specific medicine
//   totalPrice: {
//     type: Number,
//     required: true,
//   },
});

const salesSchema = new mongoose.Schema({
  // Array of items sold
  items: [saleItemSchema],
  // Total price of the entire sale
  totalSalePrice: {
    type: Number,
    required: true,
  },
  // Date and time of the sale
  year: {
    type: String,
    default: Date.now.getYear,
  },
  month: {
    type: String,
    default: Date.now.getMonth,
  },
  day: {
    type: String,
    default: Date.now.getDay,
  },
  // Additional details about the sale, if needed
  notes: {
    type: String,
  },
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;
