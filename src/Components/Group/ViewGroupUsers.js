import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./ViewGroupUsers.css";

const ViewGroupUsers = () => {
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);
    const [groupName, setGroupName] = useState(''); // State to store the group name
    const groupId = localStorage.getItem('groupId'); // Get groupId from local storage
    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        if (groupId) {
            fetchGroupInfo(groupId);
            fetchUsersByGroup(groupId);
        }
    }, [groupId]); // Fetch group info and users when groupId changes

    const fetchGroupInfo = async (groupId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGroupName(response.data.name);
        } catch (error) {
            console.error('Error fetching group info:', error);
        }
    };

    const fetchUsersByGroup = async (groupId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/users/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users by group ID:', error);
        }
    };

    const toggleUsersList = () => {
        setShowUsers(!showUsers);
    };

    return (
        <div className="group-users-container">
            <div className="group-users-header" onClick={toggleUsersList}>
                <h2>{groupName}</h2>
                <p>{users.filter(user => user.authorities[0].authority === 'STUDENT').length} Students</p>
            </div>
            {showUsers && (
                <ul className="users-list">
                    {users.filter(user => user.authorities[0].authority === 'STUDENT').map(user => (
                        <li key={user.id}>
                            <p>{user.username}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default ViewGroupUsers;
