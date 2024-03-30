import React, { useState, useEffect } from "react";
import axios from 'axios';

const ViewGroupUsers = () => {
    const [users, setUsers] = useState([]);
    const groupId = localStorage.getItem('groupId'); // Get groupId from local storage

    useEffect(() => {
        if (groupId) {
            fetchUsersByGroup(groupId);
        }
    }, [groupId]); // Fetch users when groupId changes

    const fetchUsersByGroup = async (groupId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/users/groups/${groupId}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users by group ID:', error);
        }
    };

    return (
        <div>
            <h2>Users by Group</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.authorities[0].authority}</p>
                        {/* Display other user details as needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default ViewGroupUsers;
