import React, { useState } from 'react';

const ViewPatientInfo = () => {
  const [patientUsername, setPatientUserName] = useState('');
  const [patientInfo, setPatientInfo] = useState('');
  const [error, setError] = useState('');

  const handleViewPatientInfo = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/medicine/patientinfo?patientusername=${patientUsername}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatientInfo(data);
        console.log(data);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error);
        setPatientInfo(null);
      }
    } catch (error) {
      console.error('Internal Server Error:', error);
      setError('Error occurred while fetching patient information');
      setPatientInfo(null);
    }
  };

  return (
    <div className="ViewPatientInfo">
      <h2>View Patient Information</h2>
      <input
        type="text"
        placeholder="Patient Username"
        value={patientUsername}
        onChange={(e) => setPatientUserName(e.target.value)}
      />
      <button onClick={handleViewPatientInfo}>View Information</button>
      {error && <p>Error: {error}</p>}
      {patientInfo && (
        <div>
          <h3>Patient Information</h3>
          <p>Username: {patientInfo.UserName}</p>
          <p>Name: {patientInfo.Name}</p>
          <p>Email: {patientInfo.Email}</p>
          <p>Date of Birth: {patientInfo.DateOfBirth}</p>
          <p>Gender: {patientInfo.Gender}</p>
          <p>Mobile Number: {patientInfo.MobileNumber}</p>
          <p>Emergency Contact: {patientInfo.EmergencyContact}</p>
      
          {/* Include other information fields as needed */}
        </div>
      )}
    </div>
  );
};

export default ViewPatientInfo;
