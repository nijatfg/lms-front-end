import React, {useState} from 'react';
import {Container, Nav, Navbar} from 'react-bootstrap';
import ParticipationComponent from "../Participation/ParticipationComponent";
import UploadMaterialComponent from "../Material/UploadMaterialComponent";
import ManageAssignments from "../Assignment/ManageAssignments";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users'); // State to track active tab

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <Navbar expand="lg" bg="dark" variant="dark" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">Teachers</Navbar.Brand>
                    <Nav className="">
                        <Nav.Link onClick={() => handleTabChange('participations')}
                                  className={activeTab === 'participations' ? 'active' : ''}>Participation</Nav.Link>
                        <Nav.Link onClick={() => handleTabChange('materials')}
                                  className={activeTab === 'materials' ? 'active' : ''}>Materials</Nav.Link>
                        <Nav.Link onClick={() => handleTabChange('assignments')}
                                  className={activeTab === 'assignments' ? 'active' : ''}>Assignments</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Container className="dashboard-content">
                {activeTab === 'participations' && <ParticipationComponent/>}
                {activeTab === 'materials' && <UploadMaterialComponent/>}
                {activeTab === 'assignments' && <ManageAssignments/>}
            </Container>
        </>
    );
};

export default AdminDashboard;
