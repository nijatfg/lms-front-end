import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [submissionRequirements, setSubmissionRequirements] = useState('');
    const groupId = localStorage.getItem('groupId');

    useEffect(() => {

        if (groupId) {
            setSelectedGroupId(groupId);
        }
        fetchAssignments(groupId); // Fetch assignments for the specific group
    }, []);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage
            const response = await axios.get(`http://localhost:8080/api/v1/assignments/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include JWT token in headers
                },
            });
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleCreateAssignment = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(`http://localhost:8080/api/v1/assignments/groups/${selectedGroupId}`, {
                title,
                description,
                dueDate,
                submissionRequirements,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Assignment created:', response.data);
            fetchAssignments(selectedGroupId); // Refresh assignments list for the selected group
        } catch (error) {
            console.error('Error creating assignment:', error);
        }
    };

    return (
        <div>
            <h2>Manage Assignments</h2>
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <label>Due Date:</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div>
                <label>Submission Requirements:</label>
                <input type="text" value={submissionRequirements} onChange={(e) => setSubmissionRequirements(e.target.value)} />
            </div>
            <div>
                <label>Select Group:</label>
                <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
                    <option value="">Select a Group</option>
                    {/* You can add your groups here */}
                </select>
            </div>
            <button onClick={handleCreateAssignment}>Create Assignment</button>

            <h3>Assignments List</h3>
            <ul>
                {assignments.map((assignment) => (
                    <li key={assignment.id}>
                        <p>Title: {assignment.title}</p>
                        <p>Description: {assignment.description}</p>
                        <p>Due Date: {assignment.dueDate}</p>
                        <p>Submission Requirements: {assignment.submissionRequirements}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageAssignments;
