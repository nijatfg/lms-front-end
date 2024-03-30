import React, {useState} from 'react';
import {Container, Nav, Navbar} from 'react-bootstrap';
import ParticipationComponentStudent from "../Participation/ParticipationComponentStudent";
import GetMaterialComponent from "../Material/GetMaterialComponent";
import ViewAssignments from "../Assignment/ViewAssignments";
import ViewGroupUsers from "../Group/ViewGroupUsers";

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
                        <Nav.Link onClick={() => handleTabChange('getMaterials')}
                                  className={activeTab === 'getMaterials' ? 'active' : ''}>Materials</Nav.Link>
                        <Nav.Link onClick={() => handleTabChange('assignments')}
                                  className={activeTab === 'assignments' ? 'active' : ''}>Assignments</Nav.Link>
                        <Nav.Link onClick={() => handleTabChange('groups')}
                                  className={activeTab === 'groups' ? 'active' : ''}>Group</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Container className="dashboard-content">
                {activeTab === 'participationsStudent' && <ParticipationComponentStudent/>}
                {activeTab === 'getMaterials' && <GetMaterialComponent/>}
                {activeTab === 'assignments' && <ViewAssignments/>}
                {activeTab === 'groups' && <ViewGroupUsers/>}
            </Container>
        </>
    );
};

export default AdminDashboard;
