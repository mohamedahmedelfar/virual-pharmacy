import React, { useState } from 'react';

const MedicineFilter = () => {
  const [medicinalUse, setMedicinalUse] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  const handleFilterMedicines = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/medicine/filterMedicine?medicinalUse=${medicinalUse}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredMedicines(data);
      } else {
        console.error('Failed to filter medicines');
      }
    } catch (error) {
      console.error('Error filtering medicines:', error);
    }
  };

  return (
    <div>
      <h1>Filter Medicines by Medicinal Use</h1>
      <div>
        <h2>User! First letter has to be capitalized!</h2>
        <label>Medicinal Use:</label>
        <input
          type="text"
          value={medicinalUse}
          onChange={(e) => setMedicinalUse(e.target.value)}
        />
      </div>
      <button onClick={handleFilterMedicines}>Filter</button>

      <h2>Filtered Medicines:</h2>
      <ul>
        {filteredMedicines.map((medicine) => (
          <li key={medicine._id}>
            <p>Name: {medicine.name}</p>
            <p>Manufacturer: {medicine.manufacturer}</p>
            <p>Medicinal Use: {medicine.medicinalUse}</p>
            <p>Dosage: {medicine.dosage}</p>
            <p>Price: {medicine.price}</p>
            <p>Quantity: {medicine.quantity}</p>
            <p>Prescription Required: {medicine.prescriptionRequired ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicineFilter;
