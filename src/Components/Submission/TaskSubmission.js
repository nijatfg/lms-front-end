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
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const handleDownload = async (fileName) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/v1/submissions/download/${fileName}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', // Specify response type as blob
            });
            // Create a blob URL for the file and open it in a new window
            const blobUrl = URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
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
                                    {submissions.map(submission => (
                                        <li key={submission.id}>
                                            <p>Content: {submission.content}</p>
                                            <p>Link: {submission.link}</p>
                                            <p>User: {submission.user.username}</p>
                                            {/* Add download functionality to content */}
                                            <p onClick={() => handleDownload(submission.content)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                                                {submission.content}
                                            </p>
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
