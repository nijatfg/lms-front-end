import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './ParticipationComponent.css'; // Import your CSS file

const ParticipationComponent = ({userId}) => {
    const [lessonDate, setLessonDate] = useState('');
    const [lessonDates, setLessonDates] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [showRecords, setShowRecords] = useState(false); // State to control visibility of records
    const groupId = localStorage.getItem('groupId');

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
            setLessonDates(response.data.map((lesson) => lesson.date)); // Extract lesson dates from response
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
            const response = await axios.get(`http://localhost:8080/api/v1/users/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include JWT token in headers
                },
            });
            const filteredStudents = response.data.filter((student) =>
                student.authorities.some((auth) => auth.authority === 'STUDENT')
            );
            console.log(response.data);
            setStudents(filteredStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const markAttendance = async (lessonDate, studentId, attendanceStatus) => {
        try {
            const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage

            // Fetch lesson ID by date
            const lessonResponse = await axios.get(`http://localhost:8080/api/v1/lessons/findByDate?date=${lessonDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include JWT token in headers
                },
            });

            const lessonId = lessonResponse.data[0].id; // Assuming only one lesson is found for the given date

            // Fetch groupId from localStorage
            const groupId = localStorage.getItem('groupId');

            // Mark attendance using the fetched lesson ID and groupId
            const attendanceResponse = await axios.post(
                `http://localhost:8080/api/v1/participation/markAttendance/${lessonId}/${studentId}/${groupId}`,
                {
                    lessonDate: lessonDate,
                    attendance: attendanceStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include JWT token in headers
                    },
                }
            );

            console.log('Attendance marked:', attendanceResponse.data);

            // Update attendance records for the specific student
            setAttendanceRecords((prevState) => {
                const updatedRecords = prevState.map((record) => {
                    if (record.userId === studentId && record.date === lessonDate) {
                        return {
                            ...record,
                            attendance: attendanceStatus,
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

    const fetchParticipationRecords = async (userId) => {
        try {
            const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage
            const response = await axios.get(`http://localhost:8080/api/v1/participation/participationRecords/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include JWT token in headers
                },
            });
            setAttendanceRecords(response.data); // Set the fetched participation records
            console.log(response.data)
            // Scroll to the attendance records section
            document.getElementById('attendance-records').scrollIntoView({behavior: 'smooth'});
        } catch (error) {
            console.error('Error fetching participation records:', error);
        }
    };

    const handleViewRecords = async (studentName) => {
        try {
            const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage

            // Fetch user ID based on the student's username
            const response = await axios.get(`http://localhost:8080/api/v1/users/username/${studentName}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include JWT token in headers
                },
            });
            console.log(response.data)

            const userId = response.data.id; // Assuming the response includes the user ID

            // Fetch participation records using the fetched user ID
            fetchParticipationRecords(userId);

            // Toggle visibility of attendance records
            setShowRecords(!showRecords);
        } catch (error) {
            console.error('Error fetching user ID or participation records:', error);
        }
    };

    return (
        <div className="participation-container">
            <h2 className="participation-header">Participation</h2>
            <div className="lesson-date">
                <label htmlFor="lessonDateSelect">Select Lesson Date:</label>
                <select id="lessonDateSelect" value={lessonDate} onChange={(e) => setLessonDate(e.target.value)}>
                    {lessonDates.map((date) => (
                        <option key={date} value={date}>
                            {date}
                        </option>
                    ))}
                </select>
            </div>
            <table className="attendance-table">
                <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Group Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {students.map((student) => (
                    <tr key={student.id}>
                        <td>{student.username}</td>
                        <td>{student.group.name}</td>
                        <td>
                            <button onClick={() => markAttendance(lessonDate, student.id, 'ATTEND')}>Attend</button>
                            <button onClick={() => markAttendance(lessonDate, student.id, 'ABSENT')}>Absent</button>
                            <button onClick={() => markAttendance(lessonDate, student.id, 'LATE')}>Late</button>
                            <button onClick={() => markAttendance(lessonDate, student.id, 'ALLOWED')}>Allowed</button>
                            <button onClick={() => handleViewRecords(student.username)}>
                                {showRecords ? 'Hide Records' : 'View Records'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {showRecords && (
                <div className="attendance-records">
                    <h3>Attendance Records</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Attendance Mark</th>
                        </tr>
                        </
                            thead>
                        <tbody>
                        {attendanceRecords.map((record) => (
                            <tr key={record.id}>
                                <td>{record.lesson.date}</td>
                                <td>{record.attendance}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ParticipationComponent;


