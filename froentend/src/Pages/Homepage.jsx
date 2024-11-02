import React from 'react';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLoginClick = () => {
        navigate('/login'); // Navigate to Login
    };

    const handleSignupClick = () => {
        navigate('/signup'); // Navigate to Signup
    };

    return (
        <div className="container mx-auto h-screen flex items-center justify-center">
            <div className="bg-gray-700 w-full max-w-lg p-8 rounded-lg shadow-lg">
                <div className="flex items-center justify-center h-1/2">
                    <span className="box-decoration-clone bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded">
                        CHATS
                    </span>
                </div>
                <div className="flex space-x-4 justify-center h-1/2 mt-4">
                    <button
                        onClick={handleLoginClick} // Handle Login button click
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleSignupClick} // Handle Signup button click
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
