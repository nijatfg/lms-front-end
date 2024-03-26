import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [submissionRequirements, setSubmissionRequirements] = useState('');

    useEffect(() => {
        fetchAssignments();
        fetchGroups();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/assignments');
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:8080/api/v1/groups', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
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
            fetchAssignments(); // Refresh assignments list after creating a new assignment
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
                    {groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
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
