import React, { useState, useEffect } from 'react';
import './HomePage.css'; // Import your CSS file for styling

const HomePage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [
        'https://code.edu.az/wp-content/uploads/2021/08/mentor-sistemi.jpeg',
        'https://code.edu.az/wp-content/uploads/2021/08/akademik-transkript.jpeg',
        // Add more image URLs as needed
    ];
    const announcements = [
        'Join our upcoming webinar on the latest trends in computer science!',
        'The deadline for course registration has been extended. Enroll now!',
        'Explore our new library resources for research and study materials.',
        'Faculty development workshops scheduled for professional growth.',
        'Exciting internship opportunities available for students in collaboration with industry partners.',
        'Announcing the launch of our new AI and machine learning course. Register today!',
        // Add more announcements as needed
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        }, 5000); // Change slide interval as needed (in milliseconds)
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="home-page">
            <div className="background-container">
                <div className="background-image"></div>
                <div className="gears-container">
                    {/* SVG or custom graphics for gears */}
                    <div className="gear"></div>
                    <div className="gear"></div>
                    {/* Add more gears as needed */}
                </div>
            </div>
            <div className="content-container">
                <section className="big-photo-section">
                    <div className="big-photo" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                        {/* Big photo content */}
                        {images.map((image, index) => (
                            <div key={index} className={`slide ${activeIndex === index ? 'active' : ''}`}>
                                <img src={image} alt={`Image ${index}`} />
                            </div>
                        ))}
                    </div>
                    <div className="point-navigation">
                        {/* Bottom navigation points */}
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`point ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => setActiveIndex(index)}
                            ></div>
                        ))}
                    </div>
                </section>
                <section className="text-content">
                    <h1>Welcome to <span className="highlight">Code Academy LMS</span></h1>
                    <p>Manage courses, students, and more with ease.</p>
                </section>
                <section className="announcements-section">
                    <div className="announcements">
                        {/* Display new announcements */}
                        {announcements.map((announcement, index) => (
                            <div key={index} className="announcement">
                                <h3>{`Announcement ${index + 1}`}</h3>
                                <p>{announcement}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
