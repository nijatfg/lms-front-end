import React, { useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
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
        <div className="dashboard-wrapper">
            <div className="navbar-custom">
                <div className="nav-content">
                    <div className="logo">
                        <a href="/dashboard">Admin Dashboard</a>
                    </div>
                    <ul className="nav-links-vertical">
                        <li>
                            <a href="#users" className={activeTab === 'users' ? 'active' : ''} onClick={() => handleTabChange('users')}>Users</a>
                        </li>
                        <li>
                            <a href="#courses" className={activeTab === 'courses' ? 'active' : ''} onClick={() => handleTabChange('courses')}>Courses</a>
                        </li>
                        <li>
                            <a href="#groups" className={activeTab === 'groups' ? 'active' : ''} onClick={() => handleTabChange('groups')}>Groups</a>
                        </li>
                        <li>
                            <a href="#lessons" className={activeTab === 'lessons' ? 'active' : ''} onClick={() => handleTabChange('lessons')}>Lessons</a>
                        </li>
                    </ul>
                </div>
            </div>
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
