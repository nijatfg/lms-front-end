import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ParticipationComponentStudent.css'; // Import your CSS file

const ParticipationComponentStudent = () => {
    const [participationRecords, setParticipationRecords] = useState([]);
    const [participationPercentage, setParticipationPercentage] = useState(null);
    const userId = localStorage.getItem('userId');
    const groupId = localStorage.getItem('groupId'); // Assuming groupId is set during login
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        fetchParticipationRecords();
        fetchParticipationPercentage();
    }, []);

    const fetchParticipationRecords = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/participation/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            setParticipationRecords(response.data);
        } catch (error) {
            console.error('Error fetching participation records:', error);
        }
    };

    const fetchParticipationPercentage = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/participation/calculatePercentage/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setParticipationPercentage(response.data);
        } catch (error) {
            console.error('Error calculating participation percentage:', error);
        }
    };

    return (
        <div className="participation-container">
            <h2>Participation Records</h2>
            <table className="participation-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Attendance</th>
                    <th>Lesson Date</th>
                </tr>
                </thead>
                <tbody>
                {participationRecords.map((record) => (
                    <tr key={record.id}>
                        <td>{record.id}</td>
                        <td>{record.attendance ? 'Present' : 'Absent'}</td>
                        <td>{record.lesson.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <h2>Participation Percentage: {participationPercentage !== null ? `${participationPercentage}%` : 'Loading...'}</h2>
        </div>
    );
};

export default ParticipationComponentStudent;
