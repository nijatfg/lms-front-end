import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GradeSubmission from "../Grade/GradeSubmission"; // Assuming GradeSubmission is a separate component for grading

const TaskSubmission = () => {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradeData, setGradeData] = useState({ score: 0, feedback: '' });
    const groupId = localStorage.getItem("groupId");
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        fetchTasks();
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
            response.data.forEach(task => {
                console.log(task.id);
                fetchSubmissions(task.id); // Fetch submissions for each task
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchSubmissions = async (assignmentId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/submissions/assignment/${assignmentId}/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSubmissions(prevSubmissions => [...prevSubmissions, ...response.data]); // Append new submissions to existing list
            console.log(response.data);
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

    const handleGradeSubmission = (submissionId) => {
        setSelectedSubmission(submissionId);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGradeData({ ...gradeData, [name]: value });
    };

    const refreshSubmissions = () => {
        setSubmissions([]); // Clear submissions state
        fetchTasks(); // Fetch tasks and submissions again
    };

    return (
        <div style={{ position: 'relative' }}>
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
                                    {submissions
                                        .filter(submission => submission.assignment.id === task.id) // Filter submissions for current task
                                        .map(submission => (
                                            <li key={submission.id}>
                                                <p>Content: {submission.content}</p>
                                                <p>Link: {submission.link}</p>
                                                <p>User: {submission.user.username}</p>
                                                {/* Add download functionality to content */}
                                                <p onClick={() => handleDownload(submission.content)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                                                    {submission.content}
                                                </p>
                                                {/* Add grade button */}
                                                <button onClick={() => handleGradeSubmission(submission.id)}>Grade</button>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Render GradeSubmission component conditionally */}
            {selectedSubmission && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', background: 'white', zIndex: 9999 }}>
                    <GradeSubmission submissionId={selectedSubmission} refreshSubmissions={refreshSubmissions} handleInputChange={handleInputChange} gradeData={gradeData} />
                </div>
            )}
        </div>
    );
};

export default TaskSubmission;
