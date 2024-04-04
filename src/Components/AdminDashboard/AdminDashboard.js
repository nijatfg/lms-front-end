import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import ManageCourse from '../Course/ManageCourse';
import ManageGroup from '../Group/ManageGroup';
import ManageUsers from '../User/ManageUsers';
import ManageLessons from '../Lesson/ManageLessons';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users'); // State to track active tab

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="admin-dashboard">
            <Navbar bg="dark" variant="dark" className="navbar">
                <Container>
                    <Navbar.Brand href="#home">Admin Dashboard</Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Link onClick={() => handleTabChange('users')} className={activeTab === 'users' ? 'active' : ''}>Users</Nav.Link>
                        <Nav.Link onClick={() => handleTabChange('courses')} className={activeTab === 'courses' ? 'active' : ''}>Courses</Nav.Link>
                        <Nav.Link onClick={() => handleTabChange('groups')} className={activeTab === 'groups' ? 'active' : ''}>Groups</Nav.Link>
                        <Nav.Link onClick={() => handleTabChange('lessons')} className={activeTab === 'lessons' ? 'active' : ''}>Lessons</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Container className="dashboard-content">
                {activeTab === 'users' && <ManageUsers />}
                {activeTab === 'courses' && <ManageCourse />}
                {activeTab === 'groups' && <ManageGroup />}
                {activeTab === 'lessons' && <ManageLessons />}
            </Container>
        </div>
    );
};

export default AdminDashboard;
