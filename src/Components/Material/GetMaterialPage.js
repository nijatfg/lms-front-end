import React from 'react';
import './GetMaterialPage.css'; // Import the CSS file

const cubeData = [
    {
        id: 1,
        label: 'Files Or Recordings',
        link: '/student/materials/files',
    }
];

const GetMaterialPage = () => {
    return (
        <div className="cube-container">
            {cubeData.map((cube) => (
                <a key={cube.id} href={cube.link} className="cube">
                    {cube.icon && (
                        <div className="cube-icon">{cube.icon}</div>
                    )}
                    <div className="cube-label">{cube.label}</div>
                    <div>
                        {cube.text}
                    </div>
                </a>
            ))}
        </div>
    );
};

export default GetMaterialPage;
