import React, { useState, useEffect } from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function SideDraw() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [userData, setUserData] = useState({ name: '', email: '', pic: '' });
    const navigate = useNavigate();

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            setUserData(parsedUserInfo);
        } else {
            console.error('User data not found in local storage');
        }
    }, []);

    const handleLogout = () => {
        console.log('User logged out');
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    return (
        <div className="relative w-full p-4 bg-blue-100 flex items-center rounded-full transition-all duration-300 ease-in-out shadow-md">
            <div className="w-full max-w-screen-lg flex justify-between items-center">
                {/* Left Icon with Scale Animation */}
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <FaSearch
                            className="text-blue-700 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-125"
                            onClick={toggleSearch}
                        />
                        <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                            Search
                        </span>
                    </div>
                </div>

                {/* Center Text */}
                <div className="flex-grow text-center transition-opacity duration-300 ease-in-out">
                    <h1 className={`text-2xl font-bold text-blue-800 tracking-widest ${isSearchOpen ? 'opacity-0' : 'opacity-100'}`}>
                        CHATS
                    </h1>
                </div>

                {/* Right Icons (Notification, Profile and Logout) */}
                <div className="flex items-center space-x-4">
                    {/* Notification Icon */}
                    <div className="relative group">
                        <FaBell className="text-blue-300 text-2xl cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-125" />
                        <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-700 text-white text-sm rounded opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out">
                            Notifications
                        </span>
                    </div>

                    {/* User Profile and Logout */}
                    <div className="flex items-center space-x-2">
                        <img
                            src={userData.pic}
                            alt="Profile"
                            className="w-10 h-10 rounded-full cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110"
                            onClick={() => navigate('/profile')}
                        />
                        <span
                            className="ml-2 text-blue-800 cursor-pointer hover:underline"
                            onClick={() => navigate('/profile')}
                        >
                            {userData.name}
                        </span>
                        <button
                            className="text-blue-800 hover:underline transition-colors duration-300 ease-in-out"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Sliding Side Container from the left */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${isSearchOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} transition-transform duration-300 ease-in-out z-20`}>
                <div className="p-4">
                    <h2 className="text-xl font-semibold mb-4">Search User</h2>
                    <input
                        type="text"
                        placeholder="Enter username..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                    />
                </div>
            </div>

            {/* Overlay with Fade Effect */}
            {isSearchOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-30 z-10 transition-opacity duration-300 ease-in-out"
                    onClick={toggleSearch}
                ></div>
            )}
        </div>
    );
}

export default SideDraw;
