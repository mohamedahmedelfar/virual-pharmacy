const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'regester_as_patient', // Reference to the Patient model
    required: true,
  },
  items: [
    {
      medicine: {
        type: Schema.Types.ObjectId,
        ref: 'Medicine', // Reference to the Medicine model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
});

module.exports = mongoose.model('Cart', cartSchema);
