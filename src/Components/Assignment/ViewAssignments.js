import React, {useState, useEffect} from 'react';
import axios from 'axios';

const ViewAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const groupId = localStorage.getItem('groupId');

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
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewAssignments;
