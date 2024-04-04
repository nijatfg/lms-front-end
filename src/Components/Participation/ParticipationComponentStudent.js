import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ParticipationComponentStudent.css'; // Import your CSS file

const ParticipationComponentStudent = () => {
    const [participationRecords, setParticipationRecords] = useState([]);
    const [participationPercentage, setParticipationPercentage] = useState(null);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        fetchParticipationData();
    }, []);

    const fetchParticipationData = async () => {
        try {
            const [recordsResponse, percentageResponse] = await Promise.all([
                axios.get(`http://localhost:8080/api/v1/participation/participationRecords/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
                axios.get(`http://localhost:8080/api/v1/participation/calculatePercentage/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            console.log(recordsResponse.data);
            setParticipationRecords(recordsResponse.data);
            setParticipationPercentage(percentageResponse.data);
        } catch (error) {
            console.error('Error fetching participation data:', error);
        }
    };

    return (
        <div className="participation-container">
            <h2 className="participation-heading">Participation Records</h2>
            <div className="participation-records">
                {participationRecords.map((record) => (
                    <div className="participation-record" key={record.id}>
                        <div className="lesson-details">
                            <div className="lesson-date">{record.lesson.date}</div>
                            <div className={`attendance-status ${record.attendance ? 'present' : 'absent'}`}>
                                {record.attendance ? 'Present' : 'Absent'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="participation-percentage">
                <h2>Participation Percentage:</h2>
                <span className="percentage-value">{participationPercentage !== null ? `${participationPercentage}%` : 'Loading...'}</span>
            </div>
        </div>
    );
};

export default ParticipationComponentStudent;
