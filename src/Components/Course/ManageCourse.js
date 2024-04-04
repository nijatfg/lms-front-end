import React, {useState, useEffect} from "react";
import axios from 'axios';
import "./ManageCourse.css"; // Import custom CSS file

const ManageCourse = () => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [showAddCourseForm, setShowAddCourseForm] = useState(false); // State for showing/hiding the course form


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
                headers: {Authorization: `Bearer ${jwtToken}`},
            });
            setCourses(response.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const createCourse = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found. Please log in again.');
                return;
            }

            const response = await axios.post("http://localhost:8080/api/v1/courses", formData, {
                headers: {Authorization: `Bearer ${jwtToken}`},
            });
            console.log('Course created:', response.data);
            fetchCourses();
            setFormData({name: '', description: ''});
        } catch (error) {
            console.error("Error creating course:", error);
        }
    };

    const toggleAddCourseForm = () => {
        setShowAddCourseForm(!showAddCourseForm);
    };

    return (
        <div className="manage-course-container"> {/* Apply custom CSS class */}
            <h2>Manage Courses</h2>
            <button className="btn btn-primary" onClick={toggleAddCourseForm}>Add Course</button>
            {showAddCourseForm && (
                <form className="course-form">
                    {/* Apply custom CSS class */}
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
            )
            }
            <table className="course-list"> {/* Apply custom CSS class */}
                <thead>
                <tr>
                    <th>Course Name</th>
                    <th>Description</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {courses.map((course) => (
                    <tr key={course.id}>
                        <td>{course.name}</td>
                        <td>{course.description}</td>
                        <td>
                            {/*<button className="btn btn-primary" onClick={() => editUser(user)}>Edit</button>*/}
                            {/*<button className="btn btn-danger" onClick={() => deleteUser(user.id)}>Delete</button>*/}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
};

export default ManageCourse;
