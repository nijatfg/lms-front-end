import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import './ViewAssignment.css';

const ViewAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [showSubmissionDetails, setShowSubmissionDetails] = useState(false);
    const groupId = localStorage.getItem('groupId');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignments(groupId);
    }, []);

    const fetchAssignments = async (groupId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/v1/assignments/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleClick = (assignmentId, assignmentDetails) => {
        localStorage.setItem('assignmentId', assignmentId);
        localStorage.setItem('assignmentDetails', JSON.stringify(assignmentDetails));
        setShowSubmissionDetails(true);
    };

    const handleSubmission = () => {
        navigate('/submit-assignment');
    };

    return (
        <div className="view-assignments-container">
            <h2>View Assignments</h2>
            <div className="assignment-grid">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="assignment-card" onClick={() => handleClick(assignment.id, assignment)}>
                        <div className="assignment-details">
                            <p className="assignment-title">{assignment.title}</p>
                            <p className="due-date">Due Date: {assignment.dueDate}</p>
                            <p className="status">Status: {assignment.status}</p>
                        </div>
                    </div>
                ))}
            </div>
            {showSubmissionDetails && (
                <div className="submission-details">
                    <h3>Submission Requirements</h3>
                    <p>{JSON.parse(localStorage.getItem('assignmentDetails')).submissionRequirements}</p>
                    <button onClick={handleSubmission}>Submit Assignment</button>
                </div>
            )}
        </div>
    );
};

export default ViewAssignments;
