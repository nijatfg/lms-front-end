import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./ManageCourse.css"; // Import custom CSS file

const ManageCourse = () => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found. Please log in again.');
                return;
            }

            const response = await axios.get("http://localhost:8080/api/v1/courses", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setCourses(response.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const createCourse = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found. Please log in again.');
                return;
            }

            const response = await axios.post("http://localhost:8080/api/v1/courses", formData, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            console.log('Course created:', response.data);
            fetchCourses();
            setFormData({ name: '', description: '' });
        } catch (error) {
            console.error("Error creating course:", error);
        }
    };

    return (
        <div className="manage-course-container"> {/* Apply custom CSS class */}
            <h2>Manage Courses</h2>
            <form className="course-form"> {/* Apply custom CSS class */}
                <input
                    type="text"
                    name="name"
                    placeholder="Course Name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Course Description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <button type="button" onClick={createCourse}>Create Course</button>
            </form>
            <ul className="course-list"> {/* Apply custom CSS class */}
                {courses.map((course) => (
                    <li key={course.id}>
                        <strong>{course.name}</strong>: {course.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageCourse;
