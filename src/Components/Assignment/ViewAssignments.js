import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {NavLink, useNavigate} from 'react-router-dom';
import './ViewAssignment.css';

const ViewAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [grades, setGrades] = useState({});
    const groupId = localStorage.getItem('groupId');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignmentsAndGrades(groupId);
    }, []);

    const fetchAssignmentsAndGrades = async (groupId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const assignmentsResponse = await axios.get(`http://localhost:8080/api/v1/assignments/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const gradesResponse = await axios.get('http://localhost:8080/api/v1/grades', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const assignmentsData = assignmentsResponse.data;
            const gradesData = {};

            // Map assignment IDs to grades
            gradesResponse.data.forEach((grade) => {
                gradesData[grade.submission.assignment.id] = `${grade.score}/100`;
            });

            setAssignments(assignmentsData);
            setGrades(gradesData);
        } catch (error) {
            console.error('Error fetching assignments and grades:', error);
        }
    };

    const handleClick = (assignmentId) => {
        localStorage.setItem("assignmentId", assignmentId);
        navigate(`/task-details/${assignmentId}`);
    };

    return (
        <div className="view-assignments-container">
            <h2>View Assignments</h2>
            <div className="assignment-grid">
                {assignments.map((assignment) => (
                    <div
                        key={assignment.id}
                        className="assignment-card"
                        onClick={() => handleClick(assignment.id)}
                    >
                        <div className="assignment-details">
                            <svg width="3em" height="3em" viewBox="0 0 28 28" fill="none">
                                <path
                                    d="M4 5.25C4 3.45508 5.45507 2 7.25 2H20.75C22.5449 2 24 3.45507 24 5.25V17.3787C23.8796 17.4592 23.7653 17.5527 23.659 17.659L22.5 18.818V5.25C22.5 4.2835 21.7165 3.5 20.75 3.5H7.25C6.2835 3.5 5.5 4.2835 5.5 5.25V22.7497C5.5 23.7162 6.2835 24.4997 7.25 24.4997H15.3177L16.8177 25.9997H7.25C5.45507 25.9997 4 24.5446 4 22.7497V5.25Z"
                                    fill="#212121"
                                />
                                <path
                                    d="M10.5 8.75C10.5 9.44036 9.94036 10 9.25 10C8.55964 10 8 9.44036 8 8.75C8 8.05964 8.55964 7.5 9.25 7.5C9.94036 7.5 10.5 8.05964 10.5 8.75Z"
                                    fill="#212121"
                                />
                                <path
                                    d="M9.25 15.2498C9.94036 15.2498 10.5 14.6902 10.5 13.9998C10.5 13.3095 9.94036 12.7498 9.25 12.7498C8.55964 12.7498 8 13.3095 8 13.9998C8 14.6902 8.55964 15.2498 9.25 15.2498Z"
                                    fill="#212121"
                                />
                                <path
                                    d="M9.25 20.5C9.94036 20.5 10.5 19.9404 10.5 19.25C10.5 18.5596 9.94036 18 9.25 18C8.55964 18 8 18.5596 8 19.25C8 19.9404 8.55964 20.5 9.25 20.5Z"
                                    fill="#212121"
                                />
                                <path
                                    d="M12.75 8C12.3358 8 12 8.33579 12 8.75C12 9.16421 12.3358 9.5 12.75 9.5H19.25C19.6642 9.5 20 9.16421 20 8.75C20 8.33579 19.6642 8 19.25 8H12.75Z"
                                    fill="#212121"
                                />
                                <path
                                    d="M12 13.9998C12 13.5856 12.3358 13.2498 12.75 13.2498H19.25C19.6642 13.2498 20 13.5856 20 13.9998C20 14.414 19.6642 14.7498 19.25 14.7498H12.75C12.3358 14.7498 12 14.414 12 13.9998Z"
                                    fill="#212121"
                                />
                                <path
                                    d="M12.75 18.5C12.3358 18.5 12 18.8358 12 19.25C12 19.6642 12.3358 20 12.75 20H19.25C19.6642 20 20 19.6642 20 19.25C20 18.8358 19.6642 18.5 19.25 18.5H12.75Z"
                                    fill="#212121"
                                />
                                <path
                                    d="M25.7803 19.7803L19.7803 25.7803C19.6397 25.921 19.4489 26 19.25 26C19.0511 26 18.8603 25.921 18.7197 25.7803L15.7216 22.7823C15.4287 22.4894 15.4287 22.0145 15.7216 21.7216C16.0145 21.4287 16.4894 21.4287 16.7823 21.7216L19.25 24.1893L24.7197 18.7197C25.0126 18.4268 25.4874 18.4268 25.7803 18.7197C26.0732 19.0126 26.0732 19.4874 25.7803 19.7803Z"
                                    fill="#212121"
                                />
                            </svg>
                            <div>
                                <p className="assignment-title">{assignment.title}</p>
                                {/* Display grade if available */}
                                {grades[assignment.id] && (
                                    <p className="assignment-grade">{grades[assignment.id]}</p>
                                )}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewAssignments;
