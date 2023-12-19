import React, { useState, useEffect } from 'react';

// Define your functional component
function MedicineInfo() {
  const [medicineData, setMedicineData] = useState([]);

  const fetchMedicineData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/medicine/show');
      const data = await response.json();

      setMedicineData(data);
    } catch (error) {
      console.error('Error fetching medicine data:', error);
    }
  };

  useEffect(() => {
    // Fetch medicine data when the component mounts
    fetchMedicineData();
  }, []);

  return (
    <div>
      <h2>Medicine Information</h2>

      {medicineData.length > 0 && ( // Ensure medicineData is not empty before rendering
        <ul>
          {medicineData.map((medicine, index) => (
            <li key={index}>
                 <p>Name: {medicine.name}</p>
              <p>Price: {medicine.price}</p>
              <p>Description: {medicine.details}</p>
              <img src={medicine.imageUrl} alt={medicine.name} style={{ maxWidth: "100px" }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MedicineInfo;
