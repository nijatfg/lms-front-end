import React, { useState } from 'react';
import axios from 'axios';

const GradeSubmission = ({ submissionId, refreshSubmissions }) => {
    const [gradeData, setGradeData] = useState({ score: 0, feedback: '' });

    const handleGradeSubmission = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(`http://localhost:8080/api/v1/grades/submissions/${submissionId}`, {
                score: gradeData.score,
                feedback: gradeData.feedback,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Grade submitted for submission ID:', submissionId, response.data);
            // Refresh submissions after grading
            refreshSubmissions();
        } catch (error) {
            console.error('Error grading submission:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGradeData({ ...gradeData, [name]: value });
    };

    return (
        <div>
            <h3>Grade Submission</h3>
            <div>
                <label htmlFor="score">Score:</label>
                <input type="number" id="score" name="score" value={gradeData.score} onChange={handleInputChange} />
            </div>
            <div>
                <label htmlFor="feedback">Feedback:</label>
                <textarea id="feedback" name="feedback" value={gradeData.feedback} onChange={handleInputChange}></textarea>
            </div>
            <button onClick={handleGradeSubmission}>Submit Grade</button>
        </div>
    );
};

export default GradeSubmission;
