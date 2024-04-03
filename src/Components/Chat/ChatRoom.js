import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import axios from 'axios';

const ChatRoom = () => {
    const [stompClient, setStompClient] = useState(null);
    const [userData, setUserData] = useState({ username: '', connected: false, message: '' });
    const [allUsers, setAllUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                try {
                    const userId = localStorage.getItem('userId');
                    const userResponse = await axios.get(`http://localhost:8080/api/v1/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const usersResponse = await axios.get('http://localhost:8080/api/v1/users', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const currentUser = userResponse.data;
                    const allUsersData = usersResponse.data;
                    setUserData({ ...userData, username: currentUser.username });
                    setAllUsers(allUsersData);
                    connect();
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = over(socket);
        client.connect({}, () => {
            setStompClient(client);
            setUserData({ ...userData, connected: true });
            client.subscribe('/topic/messages', onMessageReceived);
            // Move userJoin inside the connect callback
            userJoin(client);
        }, onError);
    };


    const userJoin = (client) => {
        if (client) {
            const chatMessage = { senderName: userData.username, status: 'JOIN' };
            client.send('/app/chat', {}, JSON.stringify(chatMessage));
        } else {
            console.error('Stomp client is not initialized.');
        }
    };


    const sendMessage = () => {
        if (selectedUser && userData.message && stompClient) {
            const chatMessage = {
                senderName: userData.username,
                receiverName: selectedUser,
                message: userData.message,
                status: 'MESSAGE',
            };
            stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, message: '' });
        }
    };

    const onMessageReceived = (payload) => {
        const payloadData = JSON.parse(payload.body);
        setMessages((prevMessages) => [...prevMessages, payloadData]);
    };

    const onError = (err) => {
        console.error('WebSocket error:', err);
    };

    return (
        <div className="container">
            {userData.connected ? (
                <div className="chat-box">
                    <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">Select user</option>
                        {allUsers.map((user) => (
                            <option key={user.id} value={user.username}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Enter your message"
                        value={userData.message}
                        onChange={(e) => setUserData({ ...userData, message: e.target.value })}
                    />
                    <button onClick={sendMessage}>Send</button>
                    <ul>
                        {messages.map((msg, index) => (
                            <li key={index}>
                                {msg.senderName}: {msg.message}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="register">
                    <p>{`Welcome, ${userData.username}!`}</p>
                </div>
            )}
        </div>
    );
};

export default ChatRoom;
