import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.css';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const jwtToken = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const handleChangePassword = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/auth/changePassword/users/${userId}`,
                { oldPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            setSuccessMessage(response.data.message);

            // Redirect based on user role after successful password change
            const userRole = localStorage.getItem('userRole'); // Assuming you have stored the user role during login
            if (userRole === 'STUDENT') {
                navigate('/student');
            } else if (userRole === 'TEACHER') {
                navigate('/teacher');
            }
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Change Password</button>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default ChangePassword;
