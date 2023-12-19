import React, { useState, useEffect } from 'react';

function FilterPatient() {
    console.log('Hiii')
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [medicinalUse, setMedicinalUse] = useState('');

  // Fetch all medicines
  const fetchMedicines = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/medicine/getAllMedicinesPharmacist');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMedicines(data);

      console.log('Fetched Medicines:', data)
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  // Filter medicines based on medicinal use
  const filterMedicines = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/medicine/filterMedicine?medicinalUse=${medicinalUse}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data)
      setFilteredMedicines(data);
    } catch (error) {
      console.error('Error filtering medicines:', error);
    }
  };

  // Archive a medicine
  const archive = async (medicineId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/medicine/archiveMedicine/${medicineId}`, {
        method: 'post',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data)
      //const updatedMedicines = medicines.filter((medicine) => medicine.name !== medicineName);
      //setMedicines(updatedMedicines);
    } catch (error) {
      console.error('Error archiving medicine:', error);
    }
  };

  // Unarchive a medicine
  const unarchive = async (medicineId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/medicine/unarchiveMedicine/${medicineId}`, {
        method: 'post',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data)
      // const updatedMedicines = medicines.filter((medicine) => medicine.name !== medicineName);
      // setMedicines(updatedMedicines);
    } catch (error) {
      console.error('Error unarchiving medicine:', error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []); // Fetch medicines when the component mounts

  return (
    <div>
      <h1>Medicine App</h1>
      <input
        type="text"
        placeholder="Medicinal Use"
        value={medicinalUse}
        onChange={(e) => setMedicinalUse(e.target.value)}
      />
      <button onClick={filterMedicines}>Filter Medicines</button>
      <ul>
        {filteredMedicines.length > 0
          ? filteredMedicines.map((medicine) => (
              <li key={medicine._id}>
                {medicine.name} - {medicine.manufacturer} - {medicine.dosage} - {medicine.medicinalUse}
              </li>
            ))
          : medicines.map((medicine) => (
              <li key={medicine._id}>
                {medicine.name} - {medicine.manufacturer} - {medicine.dosage} - {medicine.medicinalUse}     
              </li>
            ))}
      </ul>
    </div>
  );
}

export default FilterPatient;
