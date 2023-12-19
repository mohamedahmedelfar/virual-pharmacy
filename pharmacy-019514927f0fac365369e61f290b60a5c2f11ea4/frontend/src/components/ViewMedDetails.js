import React, { useState, useEffect } from 'react';

function MedicineDetails() {
  const [medicineInfo, setMedicineInfo] = useState([]);

  const fetchMedicineInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/medicine/view');
      const data = await response.json();

      if (response.ok) {
        setMedicineInfo(data.info);
      } else {
        console.error('Failed to fetch medicine details.');
      }
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    }
  };

  useEffect(() => {
    // Fetch medicine details when the component mounts
    fetchMedicineInfo();
  }, []);

  return (
    <div>
      <h2>Medicine Details</h2>
      <button onClick={fetchMedicineInfo}>Fetch Medicine Details</button>

      {medicineInfo.length > 0 && (
        <ul>
          {medicineInfo.map((medicine, index) => (
            <li key={index}>
              <p>Name: {medicine.name}</p>
              <p>Quantity: {medicine.quantity}</p>
              <p>Sales: {medicine.sales}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MedicineDetails;
// hh ufshuhfuoif