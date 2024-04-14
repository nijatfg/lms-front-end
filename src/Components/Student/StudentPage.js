import React, { useState } from 'react';
import './StudentPage.css'; // Import the navbar CSS file
import { Container } from 'react-bootstrap';
import ParticipationComponentStudent from '../Participation/ParticipationComponentStudent';
import GetMaterialComponent from '../Material/GetMaterialComponent';
import ViewAssignments from '../Assignment/ViewAssignments';
import ViewGroupUsers from '../Group/ViewGroupUsers';
import ChatRoom from '../Chat/ChatRoom';
import HomePage from "./HomePage";

const StudentPage = () => {
    const [activeTab, setActiveTab] = useState('home'); // Set the initial active tab

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="dashboard-wrapper">
            <nav className={`navbar-custom ${activeTab !== 'home' ? 'sticky' : ''}`}>
                <div className="nav-content">
                    <div className="logo">
                        <a href="/student">Students</a>
                    </div>
                    <ul className="nav-links-vertical">
                        <li><a href="#home" className={activeTab === 'home' ? 'active' : ''} onClick={() => handleTabChange('home')}>Home</a></li>
                        <li><a href="#participationsStudent" className={activeTab === 'participationsStudent' ? 'active' : ''} onClick={() => handleTabChange('participationsStudent')}>Participation</a></li>
                        <li><a href="#getMaterials" className={activeTab === 'getMaterials' ? 'active' : ''} onClick={() => handleTabChange('getMaterials')}>Materials</a></li>
                        <li><a href="#assignments" className={activeTab === 'assignments' ? 'active' : ''} onClick={() => handleTabChange('assignments')}>Assignments</a></li>
                        <li><a href="#groups" className={activeTab === 'groups' ? 'active' : ''} onClick={() => handleTabChange('groups')}>Group</a></li>
                        <li><a href="#chat" className={activeTab === 'chat' ? 'active' : ''} onClick={() => handleTabChange('chat')}>Chat</a></li>
                    </ul>
                </div>
            </nav>
            <Container className="dashboard-content">
                {activeTab === 'participationsStudent' && <ParticipationComponentStudent />}
                {activeTab === 'getMaterials' && <GetMaterialComponent />}
                {activeTab === 'assignments' && <ViewAssignments />}
                {activeTab === 'groups' && <ViewGroupUsers />}
                {activeTab === 'chat' && <ChatRoom />}
                {activeTab === 'home' && <HomePage />}
            </Container>
        </div>
    );
};

export default StudentPage;
