import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import "./ViewAssignment.css"

const ViewAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [showSubmissionDetails, setShowSubmissionDetails] = useState(false); // State to control showing submission details
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
            console.log(response.data)
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleClick = (assignmentId, assignmentDetails) => {
        // Store the assignment ID and details in local storage
        localStorage.setItem('assignmentId', assignmentId);
        localStorage.setItem('assignmentDetails', JSON.stringify(assignmentDetails));
        // Set showSubmissionDetails to true to show submission requirements
        setShowSubmissionDetails(true);
        // Scroll to the submission requirements section if it exists
        const submissionRequirementsSection = document.getElementById('submission-requirements');
        if (submissionRequirementsSection) {
            submissionRequirementsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSubmission = () => {
        // Navigate to the submission page using the navigate function
        navigate('/submit-assignment'); // Adjust the path as per your route configuration
    };

    return (
        <div className="view-assignments-container">
            <h2>View Assignments</h2>
            <div className="assignment-grid">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="assignment-card" onClick={() => handleClick(assignment.id, assignment)}>
                        <div className="assignment-thumbnail">
                            <img src={assignment.thumbnail} alt="Assignment Thumbnail" />
                        </div>
                        <div className="assignment-details">
                            <p className="assignment-title">{assignment.title}</p>
                            <p className="due-date">Due Date: {assignment.dueDate}</p>
                            <p className="status">Status: {assignment.status}</p>
                        </div>
                    </div>
                ))}
            </div>
            {showSubmissionDetails && (
                <div id="submission-requirements" className="submission-details">
                    <h3>Submission Requirements</h3>
                    <p>{JSON.parse(localStorage.getItem('assignmentDetails')).submissionRequirements}</p>
                    {/* Display submission requirements here */}
                    <button onClick={handleSubmission}>Submit Assignment</button>
                </div>
            )}
        </div>
    );
};

export default ViewAssignments;
