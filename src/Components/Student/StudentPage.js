import React, {useState} from 'react';
import {Container, Nav, Navbar} from 'react-bootstrap';
import ParticipationComponentStudent from "../Participation/ParticipationComponentStudent";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users'); // State to track active tab

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <Navbar expand="lg" bg="dark" variant="dark" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">Students</Navbar.Brand>
                    <Nav className="">
                        <Nav.Link onClick={() => handleTabChange('participationsStudent')}
                                  className={activeTab === 'participationsStudent' ? 'active' : ''}>Participation</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Container className="dashboard-content">
                {activeTab === 'participationsStudent' && <ParticipationComponentStudent/>}
            </Container>
        </>
    );
};

export default AdminDashboard;
