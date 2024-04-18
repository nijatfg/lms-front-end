import React, {useState, useEffect} from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import "./ChatRoom.css";
import axios from "axios";

const ChatRoom = () => {
    // State variables
    const [stompClient, setStompClient] = useState(null);
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [chatArea, setChatArea] = useState([]);
    const userIdData = localStorage.getItem("userId");

    useEffect(() => {
        // Connect to WebSocket server
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);
        setStompClient(client);

        return () => {
            client.disconnect();
        };
    }, []);

    useEffect(() => {
        if (stompClient) {
            stompClient.connect({}, onConnected, onError);
        }
    }, [stompClient]);

    const onConnected = () => {
        // Subscribe to message queues and fetch connected users
        stompClient.subscribe(`/user/${username}/queue/messages`, onMessageReceived);
        stompClient.subscribe(`/user/public`, onMessageReceived);
        findAndDisplayConnectedUsers();
    };

    const onMessageReceived = async (payload) => {
        // Update chat area and display notifications for new messages
        await findAndDisplayConnectedUsers();
        const message = JSON.parse(payload.body);
        if (selectedUserId && selectedUserId === message.senderId) {
            setChatArea(prevChatArea => [
                ...prevChatArea,
                {senderId: message.senderId, content: message.content}
            ]);
        }

        const notifiedUser = document.getElementById(message.senderId);
        if (notifiedUser && !notifiedUser.classList.contains('active')) {
            const nbrMsg = notifiedUser.querySelector('.nbr-msg');
            if (nbrMsg) {
                nbrMsg.classList.remove('hidden');
                nbrMsg.textContent = parseInt(nbrMsg.textContent) + 1;
            }
        }
    };

    const onError = () => {
        console.error('Could not connect to WebSocket server.');
    };

    const findAndDisplayConnectedUsers = async () => {
        // Fetch and display connected users
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found in localStorage.');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/v1/users/connectedUsers', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            if (!response.data) {
                console.error('Error fetching users.');
                return;
            }

            setConnectedUsers(response.data.filter(user => user.nickName !== user.username));
        } catch (error) {
            console.error('Error fetching and displaying users:', error);
        }
    };

    const userItemClick = (userId) => {
        setSelectedUserId(userId);
        fetchAndDisplayUserChat(userId);
    };

    const fetchAndDisplayUserChat = async (userId) => {
        // Fetch and display chat messages for a selected user
        try {
            const userResponse = await axios.get(`http://localhost:8080/api/v1/users/${userIdData}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });

            if (!userResponse.data || !userResponse.data.username) {
                console.error('Username not found in user data.');
                return;
            }

            setUsername(userResponse.data.username);

            const userChatResponse = await axios.get(`http://localhost:8080/api/v1/chats/messages/${userResponse.data.username}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });

            if (!userChatResponse.data || !Array.isArray(userChatResponse.data)) {
                console.error('User chat data is not an array.');
                return;
            }

            setChatArea(userChatResponse.data.map(chat => ({senderId: chat.senderId, content: chat.content})));
        } catch (error) {
            console.error('Error fetching and displaying user chat:', error);
        }
    };

    const sendMessage = () => {
        // Send a message through WebSocket
        if (messageInput.trim() && stompClient) {
            const chatMessage = {
                senderId: username,
                recipientId: selectedUserId,
                content: messageInput.trim(),
                timestamp: new Date()
            };
            stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
            setChatArea([...chatArea, {senderId: username, content: messageInput.trim()}]);
            setMessageInput('');
        }
    };

    const onLogout = () => {
        // Handle user logout
        stompClient.send("/app/user.disconnectUser", {}, JSON.stringify({
            nickName: username,
            fullName: fullname,
            status: 'OFFLINE'
        }));
        window.location.reload();
    };

    return (
        <div className="chat-container">
            <div className="users-list-chat">
                <div className="users-list-container">
                    <h2>Online Users</h2>
                    <ul>
                        {connectedUsers.map(user => (
                            <li key={user.username}
                                className={`user-item ${selectedUserId === user.username ? 'active' : ''}`}
                                onClick={() => userItemClick(user.username)}>
                                <span>{user.username}</span>
                                <span className="nbr-msg hidden">0</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p id="connected-user-fullname">{fullname}</p>
                    <button className="logout" onClick={onLogout}>Logout</button>
                </div>
            </div>
            <div className="chat-area">
                <div className="chat-area" id="chat-messages">
                    {chatArea.map((message, index) => (
                        <div key={index} className={`message ${message.senderId === username ? 'sender' : 'receiver'}`}>
                            <p>{message.content}</p>
                        </div>
                    ))}
                </div>
                <form className="message-input" onSubmit={sendMessage}>
                    <input type="text" id="message" placeholder="Type your message..." value={messageInput}
                           onChange={(e) => setMessageInput(e.target.value)}/>
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;
