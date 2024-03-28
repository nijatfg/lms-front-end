import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetMaterialComponent = () => {
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        const groupId = localStorage.getItem('groupId');
        if (groupId) {
            fetchMaterials(groupId); // Fetch materials for the specific group
        }
    }, []);

    const fetchMaterials = async (groupId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/v1/materials/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    const renderContent = (material) => {
        if (material.type.includes('image')) {
            return <img src={`http://localhost:8080/api/v1/materials/download/${material.content}`} alt={material.title} />;
        } else if (material.type.includes('pdf')) {
            return <embed src={`http://localhost:8080/api/v1/materials/download/${material.content}`} type="application/pdf" />;
        } else {
            return <a href={`http://localhost:8080/api/v1/materials/download/${material.content}`} download>{material.title}</a>;
        }
    };

    return (
        <div className="get-material-container">
            <h2>Uploaded Materials</h2>
            <ul>
                {materials.map((material) => (
                    <li key={material.id}>
                        <strong>Title: {material.title}</strong>
                        <p>Type: {material.type}</p>
                        <p>Content: {renderContent(material)}</p>
                        <p>Group ID: {material.groupId}</p>
                        {/* Add more details as needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GetMaterialComponent;
