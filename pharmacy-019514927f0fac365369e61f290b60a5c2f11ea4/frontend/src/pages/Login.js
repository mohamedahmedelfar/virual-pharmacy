// Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('pharmacist'); // Default to pharmacist


    const handleLogin = async (e) => {
        e.preventDefault();
    
        const userEndpoints = [
            { type: 'pharmacist', endpoint: '/api/medicine/Pharmacist/login' },
            { type: 'admin', endpoint: '/api/medicine/admin/login' },
            { type: 'Patient', endpoint: '/api/medicine/Patient/login' }
        ];
        const credentials = JSON.stringify({ username, password });
    
        for (const { type, endpoint } of userEndpoints) {
            try {
                var response = '';
                if(type === 'pharmacist'){
                    var response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ UserName: username, Password: password }),
                    });
                }else if(type === 'admin'){
                    var response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ AdminUserName: username, AdminPassword: password }),
                    });
                }else {
                    var response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ UserName: username, Password: password }),
                    });
                }
    
                if (response.status === 200) {
                    const data = await response.json();
                    localStorage.setItem('userType', type);
                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);
    
                    switch (type) {
                        case 'pharmacist':
                            navigate('/pharmacist');
                            return;
                        case 'admin':
                            navigate('/admin');
                            return;
                        case 'Patient':
                            navigate('/patient');
                            return;
                        default:
                            break;
                    }
                }
            } catch (error) {
                console.error('Error during login:', error.message);
            }
        }
    
        console.error('Invalid username or password');
    };

    const handleResetPassword = () => {
        // Navigate to the reset-password path
        navigate('/reset-password');
      };


        const handleRegisterAsPharmacist = () => {
            // Navigate to the reset-password path
            navigate('/hazem1');
        }
        const handleRegisterAsPatient = () => {
            // Navigate to the reset-password path
            navigate('/hazem3');
        }
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style = {{marginBottom: '150px'}}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <button type="submit">Login</button>
                
            </form>
            <button onClick={handleResetPassword} style = {{marginBottom: '10px'}}>Reset Password</button>
            <button onClick={handleRegisterAsPharmacist } style = {{marginBottom: '10px', marginLeft: '60px'}}>Register as Pharmacist</button>
            <button onClick={handleRegisterAsPatient}>Register as Patient</button>
        </div>
    );
};

export default Login;

