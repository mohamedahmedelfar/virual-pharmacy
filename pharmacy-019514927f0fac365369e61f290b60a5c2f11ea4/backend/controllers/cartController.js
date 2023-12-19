
const Medicine = require('../models/medicineModel.js');
const Patient = require('../models/regesterAsPatient.js');
const stripe = require('stripe')('sk_test_51OBhDrEzQFPCGYEsYaRwv85P6TlemKbk8trn953Tn9r4uduOkQ57a7UVTL53Qvt9ddEOOSO6wNHF9f9lskPKaZVv00Ihj83X1R');
const Pharmacist = require('../models/pharmacists.js');
const Notification = require('../models/notificationModel.js');
const nodemailer = require('nodemailer');


// add an over the counter medicine to cart
const mongoose = require('mongoose');
const addMedicineToCart = async (req, res) => {
  try {
    const { UserName, name } = req.params;
    console.log('Params:', UserName, name);

    const medicine = await Medicine.findOne({ name });

    console.log('Medicine:', medicine);
    console.log ('Medicine Quanitty:', medicine.quantity  );
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const patient = await Patient.findOne({ UserName });
    console.log('Patient:', patient);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }



    //Find a pharmacist with the UserName final.final
    const pharmacist = await Pharmacist.findOne({ UserName: 'PeterPharmacistSP3' });
    if (medicine.quantity === 0) {

      //Send a notification to the pharmacist
      const notification = new Notification({
        recipient_id: pharmacist._id,
        message: `The medicine ${medicine.name} is out of stock`,
        timestamp: Date.now(),
      });
      await notification.save();
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
        to: pharmacist.Email,
        subject: 'Out of stock notification',
        text: `The medicine ${medicine.name} is out of stock`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ error: 'Error sending OTP via email' });
        }
        res.status(200).json({ message: 'OTP sent successfully' });
      });
 


      console.log('Medicine out of stock');
      // If not in stock, fetch alternatives
      const alternatives = await Medicine.find({
        activeIngredient: medicine.activeIngredient,
        quantity: { $gt: 0 }, // Only include medicines that are in stock
        _id: { $ne: medicine._id }, // Exclude the selected medicine itself
      });

      if (alternatives.length > 0) {
        return res.status(200).json({ message: 'Medicine out of stock', alternatives });
      } else {
        return res.status(400).json({ message: 'Medicine out of stock,No alternatives available' });
      }
    }
    if (medicine.prescriptionRequired === true) {
      try {
        const collection = mongoose.connection.collection('prescriptions');
        const prescription = await collection.findOne({ patientUsername: UserName, 'medicines.name': name });
        console.log('Prescription:', prescription);
    
        if (!prescription) {
          return res.status(400).json({ message: 'Prescription required' });
        }
    
        if (prescription.filled === true) {
          return res.status(400).json({ message: 'Prescription already filled' });
        }
    
       
    
  
    
      } catch (error) {
        console.error('Error checking and updating prescription:', error);
        return res.status(500).json({ message: 'Error checking and updating prescription' });
      }
    }
    if (medicine.quantity > 0) {
          medicine.quantity -= 1;
          console.log('Medicine Sales:', medicine.sales);
          medicine.sales += 1;
          console.log('Medicine Sales Updated:', medicine.sales);
      console.log(' Patient Cart: ');
      patient.cart.items.forEach(item => {
        console.log('Medicine:', item.medicine);
        console.log('Quantity:', item.quantity);
      });
      if (patient.cart.items.some(item => item.medicine === medicine.name)) {
        const existingCartItem = patient.cart.items.find(item => item.medicine === medicine.name);
        existingCartItem.quantity += 1;
        patient.cart.totalAmount += medicine.price;
        console.log('Updated Cart:', patient.cart);
        await patient.save();
        await medicine.save();
        return res.status(200).json({ message: 'Medicine added to cart successfully' });
      } else {


        const cartItem = {
          medicine: medicine.name,
          quantity: 1,
        }

        console.log('Cart Item:', cartItem);
        patient.cart.items.push(cartItem);
        patient.cart.totalAmount += medicine.price;

        console.log('Updated Cart:', patient.cart);
        try {
          await patient.save();
          await medicine.save();
          return res.status(200).json({ message: 'Medicine added to cart successfully' });
        } catch (error) {
          console.error('Error saving data:', error);
          return res.status(500).json({ message: 'Error saving data' });
        }
        return res.status(200).json({ message: 'Medicine added to cart successfully' });
      }

    }


  }
  catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }

}


const getCartItems = async (req, res) => {
  try {
    const { UserName } = req.params;
    const patient = await Patient.findOne({ UserName }).populate('cart.items.medicine');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    console.log('Total Amount', patient.cart.totalAmount);
    return res.status(200).json({ cartItems: patient.cart.items
      , totalAmount: patient.cart.totalAmount });

  }
  catch (error) {
    console.error('Error fetching cart items:', error);
    return res.status(500).json({ message: 'Error fetching cart items' });
  }
}

const deleteMedicineFromCart = async (req, res) => {
  try {
    const { UserName, name } = req.params;
  //  console.log('Params:', UserName, name);
    const patient = await Patient.findOne({ UserName });
   // console.log('Patient:', patient);
    const medicine = await Medicine.findOne({ name });
   // console.log('Medicine:', medicine);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const removedItemIndex = patient.cart.items.findIndex(item => item.medicine === name);
    console.log('Removed Item Index:', removedItemIndex);
    if (removedItemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in the cart' });
    }
    const removedItem = patient.cart.items[removedItemIndex];
    console.log('Removed Item:', removedItem);
    console.log('Removed Item Price:', medicine.price);
console.log('Removed Item Quantity:', removedItem.quantity);
    const price = medicine.price * removedItem.quantity;
    console.log('Price:', price);
    patient.cart.totalAmount -= medicine.price * removedItem.quantity;
    console.log('Total Amount:', patient.cart.totalAmount);
    patient.cart.items.splice(removedItemIndex, 1);
    medicine.quantity = medicine.quantity + removedItem.quantity;
    medicine.sales = medicine.sales - removedItem.quantity;
    console.log('medicine quantity:', medicine.quantity );
    await patient.save();
    await medicine.save();
    return res.status(200).json({ message: 'Item removed from the cart successfully' });
  }
  catch(error) {
    return res.status(500).json({ message: 'Error removing item from cart' });

  }
}

const zeroAmount = async (req, res) => { /*Used it to Zero the amount for frontend testing*/
  try {
    const { UserName } = req.params;
    console.log('Params:', UserName);
    const patient = await Patient.findOne({ UserName });
    console.log('Patient:', patient.name);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    console.log('Total Amount', patient.cart.totalAmount)
    patient.cart.totalAmount = 0;
    await patient.save();
    return res.status(200).json({ message: 'Total Amount is now 0' });

  }
  catch(error) {
    return res.status(500).json({ message: 'Error Zeroing the cart' });
  }
}

const changeQuantityInCart = async (req, res) => {
  try {
    
    const {UserName,name,newQuantity} = req.params;
    const patient = await Patient.findOne({ UserName });
    const medicine = await Medicine.findOne({ name });
    // console.log('Medicine:', medicine);
    // console.log('Patient:', patient);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }   
    const cartItemIndex = patient.cart.items.findIndex(item => item.medicine === name);
    console.log('Cart Item Index:', cartItemIndex);
    if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in the cart' });
    }
    //console.log('hi');
    const cartItem = patient.cart.items[cartItemIndex];
     console.log('Cart Item:', cartItem);
     const originalQuantity = cartItem.quantity;
     console.log('Original Quantity:', originalQuantity);
    cartItem.quantity = newQuantity;
     console.log('New Quantity:', newQuantity);
     console.log('Cart Item UPDATED:', cartItem); 

     
    
    const cartQuant = newQuantity - originalQuantity; // new = 10 , old = 5 , cartQuant = 5
    const negative= newQuantity;
    if(cartQuant > medicine.quantity) {
      return res.status(400).json({ message: 'No quantity of the medicine available' });
    }
    if(cartQuant === 0){
      return res.status(400).json({ message: 'Quantity is already the same' });

    }
    const originalNegative = 0 - originalQuantity;
    if(cartQuant === originalNegative){
      return res.status(400).json({ message: 'Press the remove button instead of changing the quantity to zero.' });
    }
    if(negative < 0){
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }
    console.log('Cart Quantity:', cartQuant);
    const newAmount = medicine.price * cartQuant;
    console.log('New Amount:', newAmount);
    patient.cart.totalAmount += newAmount;
    
    medicine.quantity = medicine.quantity - cartQuant;
    medicine.sales = medicine.sales + cartQuant;
    await patient.save();
    await medicine.save();
    return res.status(200).json({ message: 'Quantity changed successfully' });
  }
  catch (error) {
    return res.status(500).json({ message: 'Error changing quantity in cart' });
  }
}

  const getAddresses = async (req, res) => {
    try {
      const { UserName } = req.params;
  
      const patient = await Patient.findOne({ UserName });
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      const addresses = patient.addresses;
  
      return res.status(200).json({ addresses });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  const chooseAddress = async (req, res) => {
    try{
      const { UserName } = req.params;
      const { street, city, state, zipCode } = req.body;
      console.log('Params:', UserName, street, city, state, zipCode)
      const patient = await Patient.findOne({ UserName });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      console.log('Patient cart address:', patient.cart.address);
      patient.cart.address.street = street;
      patient.cart.address.city = city;
      patient.cart.address.state = state;
      patient.cart.address.zipCode = zipCode;

      await patient.save();
      return res.status(200).json({ message: 'Address chosen successfully' });
    }
    catch(error){
      return res.status(500).json({ message: 'Error choosing address' });
    }
  }

  const payWithWallet = async (req, res) => {
    try{
      const { UserName } = req.params;
      const patient = await Patient.findOne({ UserName });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      const wallet = patient.wallet;
      const totalAmount = patient.cart.totalAmount;
      // const totalAmount2 = 99999999;
      console.log('Wallet:', wallet);
      console.log('Total Amount:', totalAmount);
      if(wallet < totalAmount){
        return res.status(400).json({ message: 'Not enough money in wallet' });
      }
      patient.wallet -= totalAmount;
      console.log('Wallet:', patient.wallet); 
      const cartItems = patient.cart.items;
  
      const address = patient.cart.address;
      const order = {
        items: cartItems,
        totalAmount: totalAmount,
        address: address,
        status: 'Pending',
        paymentMethod: 'Wallet',
      };
      
      patient.orders.push(order);
      console.log('Order:', patient.orders);
      patient.cart.items = [];
      patient.cart.totalAmount = 0;
      patient.cart.address.street = '';
      patient.cart.address.city = '';
      patient.cart.address.state = '';
      patient.cart.address.zipCode = '';
      await patient.save();
      return res.status(200).json({ message: 'Paid with wallet successfully' });
    }
    catch(error){
      return res.status(500).json({ message: 'Error paying with wallet' });
    }
  }
  const checkOut = async (req, res) => {
    try{
      const { UserName } = req.params;
      
    
      const patient = await Patient.findOne({ UserName });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      const cartItems = patient.cart.items;
      const totalAmount = patient.cart.totalAmount;
      const address = patient.cart.address;
      const order = {
        items: cartItems,
        totalAmount: totalAmount,
        address: address,
        status: 'Pending',
        paymentMethod: 'Cash',
      };
      
      patient.orders.push(order);
      console.log('Order:', patient.orders);
      patient.cart.items = [];
      patient.cart.totalAmount = 0;
      patient.cart.address.street = '';
      patient.cart.address.city = '';
      patient.cart.address.state = '';
      patient.cart.address.zipCode = '';
      await patient.save();
      return res.status(200).json({ message: 'Checked out successfully' });

    }
    catch(error){
      return res.status(500).json({ message: 'Error checking out' });
    }
  }

  const checkOutWithCard = async (req, res) => {
    try{
      const { UserName } = req.params;
      
    
      const patient = await Patient.findOne({ UserName });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      const cartItems = patient.cart.items;
      const totalAmount = patient.cart.totalAmount;
      const address = patient.cart.address;
      const order = {
        items: cartItems,
        totalAmount: totalAmount,
        address: address,
        status: 'Pending',
        paymentMethod: 'Card',
      };
      
      patient.orders.push(order);
      console.log('Order:', patient.orders);
      patient.cart.items = [];
      patient.cart.totalAmount = 0;
      patient.cart.address.street = '';
      patient.cart.address.city = '';
      patient.cart.address.state = '';
      patient.cart.address.zipCode = '';
      await patient.save();
      return res.status(200).json({ message: 'Checked out successfully' });

    }
    catch(error){
      return res.status(500).json({ message: 'Error checking out' });
    }
  }

  const viewOrders = async (req, res) => {
    try{
      const{UserName} = req.params;
      const patient = await Patient.findOne({ UserName });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      const orders = patient.orders;
      return res.status(200).json({ orders });

    }
    catch(error){
      return res.status(500).json({ message: 'Error viewing orders' });
    }
  }

  const removeOrder = async (req, res) => {
    try {
        const { UserName, orderId } = req.params;
        console.log('Params:', UserName, orderId);
        const patient = await Patient.findOne({ UserName });
        console.log('Patient:', patient);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Use findIndex to get the index of the order with the specified orderId
        const orderIndex = patient.orders.findIndex(order => order._id.toString() === orderId);
        console.log('Order Index:', orderIndex);

        // Check if the order was found
        if (orderIndex === -1) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Remove the order from the orders array using splice
        patient.orders[orderIndex].status = 'Cancelled';
        if(patient.orders[orderIndex].paymentMethod === 'Wallet'){
          patient.wallet += patient.orders[orderIndex].totalAmount;
        }
        if(patient.orders[orderIndex].paymentMethod === 'Card'){
          patient.wallet += patient.orders[orderIndex].totalAmount;
        }

        // Save the updated patient document
        await patient.save();

        // Return the removed order or a success message
        return res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error removing order:', error);
        return res.status(500).json({ message: 'Error removing order' });
    }
};
const payment = async(req,res) => {
  try{
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'egp'
    
    });
    res.json({clientSecret: paymentIntent.client_secret});
  }
  catch(error){
    console.log(error);
    res.status(500).json({message: 'Error creating payment intent'});
  }
}


module.exports = { addMedicineToCart, getCartItems, deleteMedicineFromCart, changeQuantityInCart, getAddresses,zeroAmount,checkOut,chooseAddress,payWithWallet, viewOrders,removeOrder, payment,checkOutWithCard };