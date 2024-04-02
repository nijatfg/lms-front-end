import React, {useEffect, useState} from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';

const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });
    const [allUsers, setAllUsers] = useState([]);
    let stompClient = null;

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            registerUser(token);
        }
    }, []);

    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        console.log("WebSocket connected successfully!");
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
    };

    const userJoin = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                console.error("JWT token not found in localStorage.");
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/v1/users/${userData.userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const user = response.data;
            const chatMessage = {
                senderName: user.username,
                status: "JOIN"
            };
            stompClient.send("/app/message", { Authorization: `Bearer ${token}` }, JSON.stringify(chatMessage));
        } catch (error) {
            console.error(error);
        }
    };



    const onMessageReceived = (payload) => {
        const payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                setPublicChats([...publicChats, payloadData]);
                break;
            default:
                break;
        }
    };

    const onPrivateMessage = (payload) => {
        const payloadData = JSON.parse(payload.body);
        if (privateChats.has(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            const list = [payloadData];
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    };

    const onError = (err) => {
        console.log("WebSocket connection error:", err);
        console.error(err);
    };

    const handleMessage = (event) => {
        const {value} = event.target;
        setUserData({...userData, "message": value});
    };

    const sendValue = () => {
        console.log("Sending public message...");
        if (stompClient) {
            const chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            console.log("Message to send:", chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData, "message": ""});
        }
    };

    const sendPrivateValue = () => {
        console.log("Sending private message...");
        if (stompClient) {
            const chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };
            console.log("Private message to send:", chatMessage);
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({...userData, "message": ""});
        }
    };



    const handleUsername = (event) => {
        const {value} = event.target;
        setUserData({...userData, "username": value});
    };

    const registerUser = async (token) => {
        try {
            userData.userId = localStorage.getItem("userId");
            const response = await axios.get(`http://localhost:8080/api/v1/users/${userData.userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const user = response.data;
            setUserData({...userData, "username": user.username});
            connect();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    console.error("JWT token not found in localStorage.");
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/v1/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const users = response.data;
                setAllUsers(users);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAllUsers();
    }, []);


    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                    {/* Chat UI */}
                    <select value={tab} onChange={(e) => setTab(e.target.value)}>
                        {allUsers.map((user) => (
                            <option key={user.id} value={user.username}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                    <input
                        id="user-message"
                        placeholder="Enter your message"
                        name="userMessage"
                        value={userData.message}
                        onChange={handleMessage}
                        margin="normal"
                    />
                    <button type="button" onClick={sendPrivateValue}>
                        Send
                    </button>
                </div>
                :
                <div className="register">
                    <input
                        id="user-name"
                        placeholder="Enter your name"
                        name="userName"
                        value={userData.username}
                        onChange={handleUsername}
                        margin="normal"
                    />
                    <button type="button" onClick={registerUser}>
                        Connect
                    </button>
                </div>}
        </div>
    );
};
export default ChatRoom;
