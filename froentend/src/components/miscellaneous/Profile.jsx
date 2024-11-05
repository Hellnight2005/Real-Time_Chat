import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileContainer = () => {
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: '',
        pic: '',
    });

    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        // Retrieve user data from local storage
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            // Generate a random ID for demonstration purposes
            const randomId = Math.floor(Math.random() * 1000); // Random ID between 0-999
            setUserData({ ...parsedUserInfo, id: randomId });
        } else {
            console.error('User data not found in local storage');
        }
    }, []);

    // Handle click outside the profile container
    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            navigate('/chat'); // Replace '/chat' with your chat page route
        }
    };

    useEffect(() => {
        // Add event listener for clicks outside the container
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-100">
            <div
                ref={containerRef}
                className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full transform transition-transform duration-500 hover:scale-105"
            >
                <h2 className="text-2xl font-semibold text-center text-[#003366] mb-4 animate-fade-in">
                    Profile
                </h2>
                <div className="flex flex-col items-center">
                    <img
                        src={userData.pic || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mb-4 transition-transform duration-300 ease-in-out hover:scale-110"
                    />
                    <div className="text-lg font-medium text-[#333333] space-y-2">
                        <p className="transition-colors duration-300 ease-in-out hover:text-[#3399CC]"><strong>ID:</strong> {userData.id}</p>
                        <p className="transition-colors duration-300 ease-in-out hover:text-[#3399CC]"><strong>Name:</strong> {userData.name}</p>
                        <p className="transition-colors duration-300 ease-in-out hover:text-[#3399CC]"><strong>Email:</strong> {userData.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileContainer;
