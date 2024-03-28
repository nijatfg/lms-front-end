import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubmitAssignmentComponent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [submissionType, setSubmissionType] = useState('link'); // Default to 'link'
    const [submissionValue, setSubmissionValue] = useState(''); // Value for link or file
    const [file, setFile] = useState(null);
    const [submissions, setSubmissions] = useState([]); // State for storing submissions
    const assignmentId = localStorage.getItem("assignmentId");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchSubmissions(); // Fetch submissions when the component mounts
    }, []);

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/v1/submissions/assignment/${assignmentId}/submissions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Update the submission data to include the file name for download
            const submissionsWithDownload = response.data.map(submission => ({
                ...submission,
                downloadUrl: `http://localhost:8080/api/v1/submissions/download/${submission.content}`,
            }));
            setSubmissions(submissionsWithDownload);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);

        if (submissionType === 'link') {
            formData.append('link', submissionValue);
        } else if (submissionType === 'file' && file) {
            formData.append('file', file);
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(`http://localhost:8080/api/v1/submissions/submit/${assignmentId}/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Submission successful:', response.data);
            // Clear form fields after successful submission
            setTitle('');
            setDescription('');
            setSubmissionValue('');
            setFile(null);
            // Fetch updated submissions after successful submission
            fetchSubmissions();
        } catch (error) {
            console.error('Error submitting assignment:', error);
        }
    };

    return (
        <div>
            <h2>Submit Assignment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
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
                        <input type="text" value={submissionValue} onChange={(e) => setSubmissionValue(e.target.value)} />
                    </div>
                ) : (
                    <div>
                        <label>File:</label>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                )}
                <button type="submit">Submit</button>
            </form>
            <div>
                <h3>My Submissions</h3>
                <ul>
                    {submissions.map(submission => (
                        <li key={submission.id}>
                            {/* Display submission details */}
                            <p>Content: <a href={submission.downloadUrl} download>{submission.content}</a></p>
                            <p>Link: {submission.link}</p>
                            <p>Description: {submission.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SubmitAssignmentComponent;
