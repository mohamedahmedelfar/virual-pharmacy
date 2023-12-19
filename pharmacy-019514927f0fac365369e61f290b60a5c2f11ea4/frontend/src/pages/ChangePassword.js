// ChangePassword.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const userType = localStorage.getItem('userType');

      if (userType === 'pharmacist') {
        var response = await fetch(`/api/medicine/updatePharmacistPassword`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Pharmacistusername:username, currentPassword:currentPassword, newPassword:newPassword }),
          });
        } else if (userType === 'admin') {
            var response = await fetch(`/api/medicine/updateAdminPassword`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ AdminUserName:username, currentPassword:currentPassword, newPassword:newPassword }),
            });
        }else{
            var response = await fetch(`/api/medicine/updatePatientPassword`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Patientusername:username, currentPassword:currentPassword, newPassword:newPassword}),
            });
        }
      const data = await response.json();

      if (response.status === 200) {
        console.log(data.message); // Password updated successfully
        // You can redirect to a different page or display a success message
        alert("Password updated successfully")
      } else {
        console.error(data.error);
        // Handle error, display error message, etc.
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handlePasswordChange}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </label>
        <br />
        <label>
          Current Password:
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </label>
        <br />
        <label>
          New Password:
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
