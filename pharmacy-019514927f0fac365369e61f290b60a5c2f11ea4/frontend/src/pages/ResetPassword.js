// ResetPassword.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('pharmacist');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        try {

            if (userType === 'pharmacist') {
                var response = await fetch(`/api/medicine//PharmacisttsendOtpAndSetPassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ UserName: username, Email: email }),
                });
            } else if (userType === 'admin') {
                var response = await fetch(`/api/medicine/AdminsendOtpAndSetPassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ AdminUserName: username, AdminEmail: email }),
                });
            } else {
                var response = await fetch(`/api/medicine/PatientsendOtpAndSetPassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ UserName: username, Email: email }),
                });
            }

            const data = await response.json();

            if (response.status === 200) {
                console.log(data.message); // Display success message or redirect to login
                //display success message
                alert("OTP sent to your email")
                navigate('/');

            } else {
                console.error(data.error);
                //display error message
                throw new Error('User not found');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <label>
                User Type:
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="admin">Admin</option>
                    <option value="patient">Patient</option>
                </select>
            </label>
            <br />
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
                Email:
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <br />
            <button onClick={handleResetPassword}>Reset Password</button>
        </div>
    );
};

export default ResetPassword;
