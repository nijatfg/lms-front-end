import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./SubmitAssignment.css";

const SubmitAssignmentComponent = () => {
    const [title, setTitle] = useState('');
    const [submissionType, setSubmissionType] = useState('link'); // Default to 'link'
    const [submissionValue, setSubmissionValue] = useState(''); // Value for link or file
    const [file, setFile] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const assignmentId = localStorage.getItem("assignmentId");
    const groupId = localStorage.getItem("groupId");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/v1/submissions/assignment/${assignmentId}/groups/${groupId}/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSubmissions(response.data);
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
                responseType: 'blob',
            });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);

        if (submissionType === 'link') {
            formData.append('link', submissionValue);
        } else if (submissionType === 'file' && file) {
            formData.append('file', file);
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(`http://localhost:8080/api/v1/submissions/submit/${assignmentId}/${userId}/${groupId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Submission successful:', response.data);
            setTitle('');
            setSubmissionValue('');
            setFile(null);
            fetchSubmissions();
        } catch (error) {
            console.error('Error submitting assignment:', error);
        }
    };

    return (
        <div className="submit-assignment-container">
            <h2>Submit Assignment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                </div>
                <div>
                    <label>Submission Type:</label>
                    <select value={submissionType} onChange={(e) => setSubmissionType(e.target.value)}>
                        <option value="link">Link</option>
                        <option value="file">File</option>
                    </select>
                </div>
                {submissionType === 'link' ? (
                    <div>
                        <label>Link:</label>
                        <input type="text" value={submissionValue}
                               onChange={(e) => setSubmissionValue(e.target.value)}/>
                    </div>
                ) : (
                    <div>
                        <label>File:</label>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
                    </div>
                )}
                <button type="submit">Submit</button>
            </form>
            <div className="my-submissions-container">
                <h3>My Submissions</h3>
                <ul>
                    {submissions.map(submission => (
                        <li key={submission.id}>
                            <div className="submission-info">
                                <p className="submission-content">Content: {submission.content}</p>
                                <p className="submission-link">Link: {submission.link}</p>
                            </div>
                            <p onClick={() => handleDownload(submission.content)} className="submission-download">
                                Download
                            </p>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};

export default SubmitAssignmentComponent;
