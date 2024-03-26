import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ManageUsers.css"

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        authority: 'STUDENT',
        groupName: '', // Change to groupName
    });

    useEffect(() => {
        fetchUsers();
        fetchGroups();
    }, []);

    const fetchUsers = async () => {
        console.log(users)
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found. Please log in again.');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/v1/users', {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchGroups = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found. Please log in again.');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/v1/groups', {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const createUser = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found. Please log in again.');
                return;
            }

            console.log('Creating user with token:', jwtToken); // Debugging statement

            const response = await axios.post(`http://localhost:8080/api/v1/users/groups/${formData.groupName}`, formData, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            console.log('User created:', response.data);
            fetchUsers();
            setFormData({
                username: '',
                email: '',
                password: '',
                authority: 'STUDENT',
                groupName: '', // Reset groupName after successful creation
            });
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response) {
                console.error('Response data:', error.response.data); // Log response data for debugging
                console.error('Response status:', error.response.status); // Log response status for debugging
            }
        }
    };



    return (
        <div>
            <h2>Manage Users</h2>
            <form>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <select
                    name="authority"
                    value={formData.authority}
                    onChange={handleInputChange}
                >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                </select>
                {/* Changed to groupName */}
                <select
                    name="groupName"
                    value={formData.groupName}
                    onChange={handleInputChange}
                >
                    <option value="">Select Group</option>
                    {groups.map(group => (
                        <option key={group.id} value={group.name}>{group.name}</option>
                    ))}
                </select>
                <button type="button" onClick={createUser}>Create User</button>
            </form>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <strong>{user.username}</strong> ({user.email}) - {user.authorities[0].authority}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageUsers;