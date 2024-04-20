import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ParticipationComponentStudent.css'; // Import your CSS file

const ParticipationComponentStudent = () => {
    const [participationRecords, setParticipationRecords] = useState([]);
    const [participationPercentage, setParticipationPercentage] = useState(null);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
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

    const handleShowDetails = (groupId) => {
        setSelectedGroupId(groupId === selectedGroupId ? null : groupId);
    };

    // Get unique group names from participationRecords
    const uniqueGroupNames = [...new Set(participationRecords.map(record => record.lesson.group.name))];

    return (
        <div className="participation-container">
            <h2 className="participation-heading">Participation Records</h2>
            <table className="participation-table">
                <thead>
                <tr>
                    <th>Group Name</th>
                    <th>Percentage</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {uniqueGroupNames.map(groupName => (
                    <tr key={groupName}>
                        <td>{groupName}</td>
                        <td>{participationPercentage !== null ? `${participationPercentage}%` : 'Loading...'}</td>
                        <td>
                            <button onClick={() => handleShowDetails(groupName)}>
                                {selectedGroupId === groupName ? 'Hide Details' : 'Show Details'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedGroupId && (
                <div className="attendance-details-container">
                    <h3>Attendance Details</h3>
                    <table className="attendance-details-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {participationRecords
                            .filter(record => record.lesson.group.name === selectedGroupId)
                            .map(record => (
                                <tr key={record.id}>
                                    <td>{record.lesson.date}</td>
                                    <td>
                                        {record.attendance}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ParticipationComponentStudent;
