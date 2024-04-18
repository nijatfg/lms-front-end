import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import './TaskDetails.css';

const TaskDetails = () => {
    const [taskDetails, setTaskDetails] = useState(null);
    const {assignmentId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTaskDetails();
    }, []);

    const fetchTaskDetails = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/v1/assignments/${assignmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTaskDetails(response.data);
        } catch (error) {
            console.error('Error fetching task details:', error);
        }
    };

    const handleSubmission = () => {
        navigate('/submit-assignment');
    };

    if (!taskDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="task-details-container">
            <h2>Task Details</h2>
            <div className="task-details">
                <p>Title: {taskDetails.title}</p>
                <p>Description: {taskDetails.description}</p>
                <p className="date">Due Date: {taskDetails.dueDate}</p>
                <div className="line"></div>
                <div className="button-container">
                    <button className="submit-button" onClick={handleSubmission}>
                        Submit Assignment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
