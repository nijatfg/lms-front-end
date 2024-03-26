import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ParticipationComponent.css'; // Import your CSS file

const ParticipationComponent = ({ userId }) => {
    const [lessonDate, setLessonDate] = useState('');
    const [students, setStudents] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10); // Get today's date
        setLessonDate(today);
        fetchStudents();
        // fetchAttendanceRecords();
    }, []);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage
            const response = await axios.get('http://localhost:8080/api/v1/users', {
                headers: {
                    Authorization: `Bearer ${token}`, // Include JWT token in headers
                },
            });
            const filteredStudents = response.data.filter(student => student.authorities.some(auth => auth.authority === 'STUDENT'));
            setStudents(filteredStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const markAttendance = async (studentId, isPresent) => {
        try {
            const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage

            // Fetch lesson ID by date
            const lessonResponse = await axios.get(`http://localhost:8080/api/v1/lessons/findByDate?date=${lessonDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include JWT token in headers
                },
            });

            const lessonId = lessonResponse.data[0].id;
            console.log(lessonResponse.data)// Assuming the API response contains the lesson ID

            // Mark attendance using the fetched lesson ID
            const attendanceResponse = await axios.post(
                `http://localhost:8080/api/v1/participation/markAttendance/${lessonId}/${studentId}`,
                {
                    lessonDate: lessonDate,
                    attendance: isPresent,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include JWT token in headers
                    },
                }
            );

            console.log('Attendance marked:', attendanceResponse.data);
            // fetchAttendanceRecords();
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };

    return (
        <div className="participation-container">
            <h2 className="participation-header">Participation</h2>
            <div className="lesson-date">Today's Lesson Date: {lessonDate}</div>
            <div className="attendance-list">
                {students.map((student) => (
                    <div key={student.id} className="attendance-item">
                        <span>{student.username}</span>
                        <input
                            type="checkbox"
                            checked={attendanceRecords.some((record) => record.userId === student.id)}
                            onChange={(e) => markAttendance(student.id, e.target.checked)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParticipationComponent;
