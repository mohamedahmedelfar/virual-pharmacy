// controllers/medicineController.js
const Medicine = require('../models/medicineModel.js');


const showMedicine = async (req, res) => {

  const medicines = await Medicine.find();
  
   if (!medicines)
   {
    return res.status(404).json({error: 'no medicine'})
   }
   const simplifiedMedicines = medicines.map(({name, price, details, imageUrl }) => ({
    name,
    price,
    details,
    imageUrl,
  }));
   
   res.status(200).json(simplifiedMedicines);
 
 
  }
;

module.exports={showMedicine};