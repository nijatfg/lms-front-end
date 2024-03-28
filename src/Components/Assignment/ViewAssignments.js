import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {NavLink, useNavigate} from 'react-router-dom';

const ViewAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const groupId = localStorage.getItem('groupId');
    const navigate = useNavigate(); // Use the useNavigate hook to get the navigate function

    useEffect(() => {
        fetchAssignments(groupId); // Fetch assignments for the specific group
    }, []);

    const fetchAssignments = async (groupId) => {
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

    const handleClick = (assignmentId) => {
        // Store the assignment ID in local storage
        localStorage.setItem('assignmentId', assignmentId);
        // Navigate to the submission page using the navigate function
        navigate('/submit-assignment'); // Adjust the path as per your route configuration
    };

    return (
        <div>
            <h2>View Assignments</h2>
            <h3>Assignments List</h3>
            <ul>
                {assignments.map((assignment) => (
                    <li key={assignment.id}>
                        <p>Title: {assignment.title}</p>
                        <p>Description: {assignment.description}</p>
                        <p>Due Date: {assignment.dueDate}</p>
                        <p>Submission Requirements: {assignment.submissionRequirements}</p>
                        {/* Use NavLink for navigation */}
                        <NavLink to="/submit-assignment" onClick={() => handleClick(assignment.id)}>Click to submit submission</NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewAssignments;
