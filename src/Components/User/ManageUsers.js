import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        authority: 'STUDENT',
        groupName: '',
        firstName: '',
        lastName: ''
    });
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [showEditUserForm, setShowEditUserForm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchGroups();
    }, []);

    const fetchUsers = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found. Please log in again.');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/v1/users', {
                headers: {Authorization: `Bearer ${jwtToken}`},
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
                headers: {Authorization: `Bearer ${jwtToken}`},
            });
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const createUser = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found. Please log in again.');
                return;
            }

            const response = await axios.post(`http://localhost:8080/api/v1/users/groups/${formData.groupName}`, formData, {
                headers: {Authorization: `Bearer ${jwtToken}`},
            });
            console.log('User created:', response.data);
            fetchUsers();
            setFormData({
                username: '',
                email: '',
                password: '',
                authority: 'STUDENT',
                groupName: '',
            });
            setShowAddUserForm(false); // Close the form after user creation
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
        }
    };

    const toggleAddUserForm = () => {
        setShowAddUserForm(!showAddUserForm);
    };

    const toggleEditUserForm = (userId) => {
        setShowEditUserForm(!showEditUserForm);
        setSelectedUserId(userId);
        const selectedUser = users.find(user => user.id === userId);
        setFormData({
            username: selectedUser.username,
            email: selectedUser.email,
            authority: selectedUser.authority,
            groupName: selectedUser.group ? selectedUser.group.name : '',
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName
        });
    };

    const updateUser = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found. Please log in again.');
                return;
            }

            const response = await axios.put(`http://localhost:8080/api/v1/users/${selectedUserId}`, formData, {
                headers: {Authorization: `Bearer ${jwtToken}`},
            });
            console.log('User updated:', response.data);
            fetchUsers();
            setShowEditUserForm(false); // Close the edit form after user update
        } catch (error) {
            console.error('Error updating user:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
        }
    };

    const deleteUser = async (userId) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                console.error('JWT token not found. Please log in again.');
                return;
            }

            await axios.delete(`http://localhost:8080/api/v1/users/${userId}`, {
                headers: {Authorization: `Bearer ${jwtToken}`},
            });
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="manage-users-container">
            <h2 className="table-title">Manage Users</h2>
            <button className={`btn ${showAddUserForm ? 'btn-danger' : 'btn-primary'}`} onClick={toggleAddUserForm}>
                {showAddUserForm ? 'Close Form' : 'Add User'}
            </button>
            {showAddUserForm && (
                <form className="user-form">
                    {/* Input fields for adding a new user */}
                    <input
                        type="text"
                        name="firstName"
                        placeholder="FirstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="LastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                    />
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
                    <button type="button" className="btn btn-success" onClick={createUser}>Create User</button>
                </form>

            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>FirstName</th>
                        <th>LastName</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Authority</th>
                        <th>Group</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.authorities[0].authority}</td>
                            <td>{user.group ? user.group.name : 'N/A'}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => toggleEditUserForm(user.id)}>Edit
                                </button>
                                <button className="btn btn-danger" onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Edit User Form */}
            {showEditUserForm && (
                <form className="user-form">
                    {/* Input fields for updating a user */}
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                    />
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
                    <input
                        type="text"
                        name="groupName"
                        placeholder="Group Name"
                        value={formData.groupName}
                        onChange={handleInputChange}
                    />
                    {/* Update User button */}
                    <button type="button" className="btn btn-success" onClick={updateUser}>Update User</button>
                </form>
            )}
        </div>
    );
};

export default ManageUsers;
