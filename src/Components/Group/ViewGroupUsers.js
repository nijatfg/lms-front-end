import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./ViewGroupUsers.css";

const ViewGroupUsers = () => {
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(true); // Set default value to true
    const [groupName, setGroupName] = useState('');
    const groupId = localStorage.getItem('groupId');
    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        if (groupId) {
            fetchGroupInfo(groupId);
            fetchUsersByGroup(groupId);
        }
    }, [groupId]);

    useEffect(() => {
        localStorage.setItem('showUsers', showUsers);
    }, [showUsers]);

    const fetchGroupInfo = async (groupId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGroupName(response.data.name);
            console.log(response.data.name)
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
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching users by group ID:', error);
        }
    };

    return (
        <div className="group-users-container">
            {showUsers && (
                <ul className="users-list-group">
                    <li className="list-title">TEACHERS</li>
                    {users.filter(user => user.authorities[0].authority === 'TEACHER').map((user, index) => (
                        <li key={user.id} className="user-item">
                            <div className="user-info">
                                <p className="teacher">{`${user.firstName} ${user.lastName}`}</p>
                            </div>
                            <hr className="line-separator"/>
                        </li>
                    ))}
                    <li className="list-title">STUDENTS</li>
                    {users.filter(user => user.authorities[0].authority === 'STUDENT').map((user, index) => (
                        <li key={user.id} className="user-item">
                            <div className="user-info">
                                <p className="student">{`${user.firstName} ${user.lastName}`}</p>
                            </div>
                            <hr className="line-separator"/>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default ViewGroupUsers;
