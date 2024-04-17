import React, {useState, useEffect} from "react";
import axios from 'axios';
import "./ManageGroup.css"; // Import custom CSS file

const ManageGroup = () => {
    const [groups, setGroups] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        courseName: '',
    });
    const [courses, setCourses] = useState([]);
    const [showAddGroupForm, setShowAddGroupForm] = useState(false); // State for showing/hiding the course form


    useEffect(() => {
        fetchGroups();
        fetchCourses();
    }, []);

    const fetchGroups = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found. Please log in again.');
                return;
            }

            const response = await axios.get("http://localhost:8080/api/v1/groups", {
                headers: {Authorization: `Bearer ${jwtToken}`},
            });
            setGroups(response.data);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

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

    const createGroup = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found. Please log in again.');
                return;
            }

            const response = await axios.post(`http://localhost:8080/api/v1/groups/${formData.courseName}`, formData, {
                headers: {Authorization: `Bearer ${jwtToken}`},
            });
            console.log('Group created:', response.data);
            fetchGroups();
            setFormData({name: '', courseName: ''});
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    const toggleAddGroupForm = () => {
        setShowAddGroupForm(!showAddGroupForm);
    };

    return (
        <div className="manage-group-container"> {/* Apply custom CSS class */}
            <h2>Manage Groups</h2>
            <button className="btn btn-primary" onClick={toggleAddGroupForm}>Add Group</button>
            {showAddGroupForm && (
                <form className="group-form">
                    {/* Apply custom CSS class */}
                    <input
                        type="text"
                        name="name"
                        placeholder="group Name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <select
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.name}>{course.name}</option>
                        ))}
                    </select>
                    <button type="button" onClick={createGroup}>Create Group</button>
                </form>
            )
            }
            <table className="group-list"> {/* Apply custom CSS class */}
                <thead>
                <tr>
                    <th>Group Name</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {groups.map((group) => (
                    <tr key={group.id}>
                        <td>{group.name}</td>
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

export default ManageGroup;
