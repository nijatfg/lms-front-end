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

    const handleDownload = async (fileName) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/v1/materials/download/${fileName}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', // Specify response type as blob
            });
            // Create a blob URL for the file and open it in a new window
            const blobUrl = URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
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
                        <p>Content: {material.content}</p>
                        <p>Group ID: {material.groupId}</p>
                        <p onClick={() => handleDownload(material.content)}
                           style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>
                            {material.content}
                        </p>
                        {/* Add more details as needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GetMaterialComponent;
