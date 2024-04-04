import React, {useEffect, useState} from 'react';
import SockJS from 'sockjs-client';
import {over} from 'stompjs';
import axios from 'axios';
import {Box, Button, List, ListItem, MenuItem, TextField, Typography} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme();

const ChatRoom = () => {
    const [stompClient, setStompClient] = useState(null);
    const [userData, setUserData] = useState({
        username: '',
        connected: false,
        message: '',
        senderName: '',
        receiverName: '',
        date: ''
    });
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
                        headers: {Authorization: `Bearer ${token}`},
                    });
                    const usersResponse = await axios.get('http://localhost:8080/api/v1/users', {
                        headers: {Authorization: `Bearer ${token}`},
                    });
                    const currentUser = userResponse.data;
                    console.log(userResponse.data);
                    const allUsersData = usersResponse.data;
                    setUserData({...userData, username: currentUser.username, senderName: currentUser.username});
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
            setUserData({...userData, connected: true});
            client.subscribe('/topic/messages', onMessageReceived);
            // Move userJoin inside the connect callback
            userJoin(client);
        }, onError);
    };


    const userJoin = (client) => {
        if (client) {
            const chatMessage = {senderName: userData.username, status: 'JOIN'};
            client.send('/app/chat', {}, JSON.stringify(chatMessage));
        } else {
            console.error('Stomp client is not initialized.');
        }
    };


    const sendMessage = () => {
        if (selectedUser && userData.message && stompClient) {
            const chatMessage = {
                senderName: userData.username, // Use userData.username as the senderName
                receiverName: selectedUser,
                message: userData.message,
                status: 'MESSAGE',
            };
            stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
            setUserData({...userData, message: '', senderName: userData.username}); // Update senderName here
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
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <div className="container">
                {userData.connected ? (
                    <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
                        {/* Chat Header */}
                        <Box sx={{backgroundColor: theme.palette.primary.main, color: '#fff', p: 2}}>
                            <Typography variant="h6">Chat Room</Typography>
                        </Box>
                        {/* Recipient Selection */}
                        <Box sx={{p: 2}}>
                            <TextField
                                select
                                label="Select Recipient"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                fullWidth
                            >
                                {allUsers.map((user) => (
                                    <MenuItem key={user.id} value={user.username}>
                                        {user.username}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        {/* Chat Messages */}
                        <List sx={{flex: 1, overflowY: 'auto', px: 2}}>
                            {messages.map((msg, index) => (
                                <ListItem key={index} sx={{
                                    display: 'flex',
                                    justifyContent: msg.senderName === userData.username ? 'flex-end' : 'flex-start'
                                }}>
                                    <Box sx={{
                                        bgcolor: msg.senderName === userData.username ? 'primary.main' : 'background.default',
                                        color: '#fff',
                                        borderRadius: 4,
                                        p: 1
                                    }}>
                                        <Typography variant="body1">{msg.message}</Typography>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                        {/* Message Input */}
                        <Box sx={{p: 2}}>
                            <TextField
                                type="text"
                                placeholder="Enter your message"
                                value={userData.message}
                                onChange={(e) => setUserData({...userData, message: e.target.value})}
                                fullWidth
                            />
                            <Button variant="contained" color="primary" onClick={sendMessage} sx={{mt: 2}}>Send</Button>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
                        <Typography variant="h4">Welcome, {userData.username}!</Typography>
                    </Box>
                )}
            </div>
        </ThemeProvider>
    );
};

export default ChatRoom;
