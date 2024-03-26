import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./ManageLessons.css"; // Import CSS file for styling

const ManageLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        groupName: "",
        duration: 0,
    });
    const [groups, setGroups] = useState([]); // State to store groups

    useEffect(() => {
        fetchLessons();
        fetchGroups(); // Fetch groups when component mounts
    }, []);

    const fetchLessons = async () => {
        try {
            const jwtToken = localStorage.getItem("jwtToken");
            if (!jwtToken) {
                console.error("JWT token not found. Please log in again.");
                return;
            }

            const response = await axios.get("http://localhost:8080/api/v1/lessons", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setLessons(response.data);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        }
    };

    const fetchGroups = async () => {
        try {
            const jwtToken = localStorage.getItem("jwtToken");
            if (!jwtToken) {
                console.error("JWT token not found. Please log in again.");
                return;
            }

            const response = await axios.get("http://localhost:8080/api/v1/groups", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setGroups(response.data);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const createLesson = async () => {
        try {
            const jwtToken = localStorage.getItem("jwtToken");
            if (!jwtToken) {
                console.error("JWT token not found. Please log in again.");
                return;
            }

            const response = await axios.post(`http://localhost:8080/api/v1/lessons/${formData.groupName}`, formData, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            console.log("Lesson created:", response.data);

            // Update lessons state with the new lesson
            setLessons([...lessons, response.data]);

            setFormData({ title: "", description: "", date: "", groupName: "", duration: 0 }); // Reset form data
        } catch (error) {
            console.error("Error creating lesson:", error);
        }
    };

    return (
        <div>
            <h2>Manage Lessons</h2>
            <form>
                <input
                    type="text"
                    name="title"
                    placeholder="Lesson Title"
                    value={formData.title}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Lesson Description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                />
                <select
                    name="groupName"
                    value={formData.groupName}
                    onChange={handleInputChange}
                    className="scroll-select" // Apply custom class for scrolling
                >
                    <option value="">Select Group</option>
                    {groups.map((group) => (
                        <option key={group.id} value={group.name}>{group.name}</option>
                    ))}
                </select>
                <input
                    type="number"
                    name="duration"
                    placeholder="Duration (in minutes)"
                    value={formData.duration}
                    onChange={handleInputChange}
                />
                <button type="button" onClick={createLesson}>
                    Create Lesson
                </button>
            </form>
            <ul>
                {lessons.map((lesson) => (
                    <li key={lesson.id}>
                        <strong>{lesson.date}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageLessons;
