import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './ParticipationComponent.css'; // Import your CSS file

const ParticipationComponent = ({userId}) => {
    const [lessonDate, setLessonDate] = useState('');
    const [lessonDates, setLessonDates] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
        fetchLessonDates();
        fetchStudents();
    }, []);

    const fetchLessonDates = async () => {
        try {
            const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage
            const response = await axios.get('http://localhost:8080/api/v1/lessons', {
                headers: {
                    Authorization: `Bearer ${token}`, // Include JWT token in headers
                },
            });
            setLessonDates(response.data.map(lesson => lesson.date)); // Extract lesson dates from response
            // Set initial lesson date to the first date in the list
            if (response.data.length > 0) {
                setLessonDate(response.data[0].date);
            }
        } catch (error) {
            console.error('Error fetching lesson dates:', error);
        }
    };


    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage
            const response = await axios.get('http://localhost:8080/api/v1/users', {
                headers: {
                    Authorization: `Bearer ${token}`, // Include JWT token in headers
                },
            });
            const filteredStudents = response.data.filter(student => student.authorities.some(auth => auth.authority === 'STUDENT'));
            console.log(response.data);
            setStudents(filteredStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const markAttendance = async (lessonDate, studentId, isPresent) => {
        try {
            const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage

            // Fetch lesson ID by date
            const lessonResponse = await axios.get(`http://localhost:8080/api/v1/lessons/findByDate?date=${lessonDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include JWT token in headers
                },
            });

            const lessonId = lessonResponse.data[0].id; // Assuming only one lesson is found for the given date

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

            // Update attendance records
            setAttendanceRecords(prevState => {
                const updatedRecords = prevState.map(record => {
                    if (record.userId === studentId) {
                        return {
                            ...record,
                            attendance: isPresent,
                        };
                    }
                    return record;
                });
                return updatedRecords;
            });
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };


    return (
        <div className="participation-container">
            <h2 className="participation-header">Participation</h2>
            <div className="lesson-date">
                <label htmlFor="lessonDateSelect">Select Lesson Date:</label>
                <select id="lessonDateSelect" value={lessonDate} onChange={(e) => setLessonDate(e.target.value)}>
                    {lessonDates.map((date) => (
                        <option key={date} value={date}>{date}</option>
                    ))}
                </select>
            </div>
            <div className="attendance-list">
                {students.map((student) => (
                    <div key={student.id} className="attendance-item">
                        <span>{student.username}</span> <span>{student.group.name}</span>
                        <button onClick={() => markAttendance(lessonDate, student.id, true)}>Attend</button>
                        <button onClick={() => markAttendance(lessonDate, student.id, false)}>Absent</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParticipationComponent;
