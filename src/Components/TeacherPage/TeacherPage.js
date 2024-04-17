import React, {useState} from 'react';
import './TeacherPage.css'; // Import the navbar CSS file
import {Container} from 'react-bootstrap';
import ParticipationComponent from "../Participation/ParticipationComponent";
import UploadMaterialComponent from "../Material/UploadMaterialComponent";
import ManageAssignments from "../Assignment/ManageAssignments";
import ViewGroupUsers from "../Group/ViewGroupUsers";
import ChatRoom from "../Chat/ChatRoom";
import HomePage from "../Student/HomePage";
import TaskSubmission from "../Submission/TaskSubmission";

const StudentPage = () => {
    const [activeTab, setActiveTab] = useState('home'); // Set the initial active tab

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="teacher-wrapper">
            <nav className={`navbar-custom ${activeTab !== 'home' ? 'sticky' : ''}`}>
                <div className="nav-content">
                    <div className="logo">
                        <a href="/teacher">Teachers</a>
                    </div>
                    <ul className="nav-links-vertical">
                        <li><a href="#home" className={activeTab === 'home' ? 'active' : ''}
                               onClick={() => handleTabChange('home')}>Home</a></li>
                        <li><a href="#participations"
                               className={activeTab === 'participations' ? 'active' : ''}
                               onClick={() => handleTabChange('participations')}>Participation</a></li>
                        <li><a href="#materials" className={activeTab === 'materials' ? 'active' : ''}
                               onClick={() => handleTabChange('materials')}>Materials</a></li>
                        <li><a href="#assignments" className={activeTab === 'assignments' ? 'active' : ''}
                               onClick={() => handleTabChange('assignments')}>Assignments</a></li>
                        <li><a href="#submissions" className={activeTab === 'submissions' ? 'active' : ''}
                               onClick={() => handleTabChange('submissions')}>Submissions</a></li>
                        <li><a href="#groups" className={activeTab === 'groups' ? 'active' : ''}
                               onClick={() => handleTabChange('groups')}>Group</a></li>
                        <li><a href="#chat" className={activeTab === 'chat' ? 'active' : ''}
                               onClick={() => handleTabChange('chat')}>Chat</a></li>

                    </ul>
                </div>
            </nav>
            <Container className="teacher-content">
                {activeTab === 'participations' && <ParticipationComponent/>}
                {activeTab === 'home' && <HomePage/>}
                {activeTab === 'materials' && <UploadMaterialComponent/>}
                {activeTab === 'assignments' && <ManageAssignments/>}
                {activeTab === 'groups' && <ViewGroupUsers/>}
                {activeTab === 'chat' && <ChatRoom/>}
                {activeTab === 'submissions' && <TaskSubmission/>}
            </Container>
        </div>
    );
};

export default StudentPage;
