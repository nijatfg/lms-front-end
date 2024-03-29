import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskSubmission = () => {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const assignmentId = localStorage.getItem('assignmentId');
    const groupId = localStorage.getItem('groupId');

    useEffect(() => {
        fetchTasks();
        fetchSubmissions();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/v1/assignments/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/v1/submissions/assignment/${assignmentId}/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    return (
        <div>
            <h2>Tasks and Submissions</h2>
            <div>
                <h3>Tasks</h3>
                <ul>
                    {assignments.map(task => (
                        <li key={task.id}>
                            <p>Title: {task.title}</p>
                            <p>Description: {task.description}</p>
                            {/* Display other task details as needed */}
                            <div>
                                <h4>Submissions</h4>
                                <ul>
                                    {submissions// Assuming taskId is the property to match with task ID
                                        .map(submission => (
                                            <li key={submission.id}>
                                                <p>Content: {submission.content}</p>
                                                <p>Link: {submission.link}</p>
                                                <p>User: {submission.user.username}</p>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskSubmission;
