import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadMaterialComponent = () => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [content, setContent] = useState('');
    const [groupId, setGroupId] = useState('');
    const [file, setFile] = useState(null);
    const [groups, setGroups] = useState([]);
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        const groupId = localStorage.getItem('groupId');
        if (groupId) {
            setGroupId(groupId);
        }
        fetchGroups();
        fetchMaterials(groupId); // Fetch materials for the specific group
    }, []);

    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:8080/api/v1/groups', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwtToken');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('type', type);
        formData.append('content', content);
        formData.append('groupId', groupId);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/materials/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, // Include JWT token in headers
                },
            });
            console.log('Material uploaded:', response.data);
            // Clear form fields after successful upload
            setTitle('');
            setType('');
            setContent('');
            setFile(null);
            fetchMaterials(groupId); // Refresh materials list for the selected group
        } catch (error) {
            console.error('Error uploading material:', error);
        }
    };

    return (
        <div className="upload-material-container">
            <h2>Upload Material</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Type:</label>
                    <input type="text" value={type} onChange={(e) => setType(e.target.value)} required />
                </div>
                <div>
                    <label>Content:</label>
                    <input type="text" value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <div>
                    <input type="hidden" value={groupId} />
                </div>
                <div>
                    <label>File:</label>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                </div>
                <button type="submit">Upload</button>
            </form>

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

export default UploadMaterialComponent;
