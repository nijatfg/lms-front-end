import React, {useState} from 'react';
import {Container, Nav, Navbar} from 'react-bootstrap';
import ParticipationComponent from "../Participation/ParticipationComponent";
import UploadMaterialComponent from "../Material/UploadMaterialComponent";

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
                    </Nav>
                </Container>
            </Navbar>
            <Container className="dashboard-content">
                {activeTab === 'participations' && <ParticipationComponent/>}
                {activeTab === 'materials' && <UploadMaterialComponent/>}
            </Container>
        </>
    );
};

export default AdminDashboard;
