import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { ChatState } from '../../context/Chatrovide';
import gsap from 'gsap';

function SideDraw() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [datas, setDatas] = useState([]);
    const navigate = useNavigate();
    const { userData, setUserData, setChats, chats, setSelectedChat } = ChatState();
    const searchContainerRef = useRef(null);
    const searchInputRef = useRef(null);
    const searchButtonRef = useRef(null);
    const profileImageRef = useRef(null);
    const userNameRef = useRef(null);
    const logoutButtonRef = useRef(null);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserData(JSON.parse(storedUserInfo));
        } else {
            setLoading(false);
        }

        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setUserData]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUserData(null);
        navigate('/');
    };

    const handleSearch = async () => {
        if (!search.trim()) {
            setError("Please enter a search term");
            setDatas([]);
            return;
        }

        try {
            setLoading(true);
            setError('');
            const config = { headers: { Authorization: `Bearer ${userData.token}` } };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setDatas(data);
        } catch (error) {
            setError("Unable to fetch search results.");
        } finally {
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${userData.token}` } };
            const { data } = await axios.post('/api/chat', { userId }, config);

            // If the chat is new, add it to the chats list
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            setSelectedChat(data);  // Set the newly created chat as selected
            setIsSearchOpen(false);  // Close the search container after selecting a user
        } catch (error) {
            setError("Error accessing chat.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSearchOpen) {
            gsap.fromTo(searchContainerRef.current, { x: -300, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
            gsap.fromTo(searchInputRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
            gsap.fromTo(searchButtonRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, delay: 0.1 });
        } else {
            gsap.to(searchContainerRef.current, { x: -300, opacity: 0, duration: 0.3 });
        }

        // Animation for profile image and username
        if (userData) {
            gsap.fromTo(profileImageRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
            gsap.fromTo(userNameRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, delay: 0.2 });
        }

        // Animation for the logout button
        gsap.fromTo(logoutButtonRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, delay: 0.3 });
    }, [isSearchOpen, userData]);

    return (
        <div className="relative w-full p-7 bg-blue-100 flex items-center rounded-lg shadow-md">
            <div className="flex w-full max-w-screen-lg justify-between items-center">
                <FaSearch className="text-blue-700 cursor-pointer" onClick={() => setIsSearchOpen(!isSearchOpen)} />
                <h1 className="text-2xl font-bold text-blue-800 flex-grow text-center">CHATS</h1>
                <FaBell className="text-blue-300 text-2xl cursor-pointer"
                    onMouseEnter={() => gsap.to('.text-blue-300', { scale: 1.1, duration: 0.3 })}
                    onMouseLeave={() => gsap.to('.text-blue-300', { scale: 1, duration: 0.3 })}
                />
                <img
                    ref={profileImageRef}
                    src={userData?.pic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full cursor-pointer"
                    onClick={() => navigate('/profile')}
                />
                <span
                    ref={userNameRef}
                    className="text-blue-800 cursor-pointer"
                    onClick={() => navigate('/profile')}
                >
                    {userData?.name}
                </span>
                <button
                    ref={logoutButtonRef}
                    onClick={handleLogout}
                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            {isSearchOpen && (
                <div ref={searchContainerRef} className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-20 p-4">
                    <h2 className="text-xl font-semibold mb-4">Search User</h2>
                    <div className="flex items-center">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Enter username..."
                            className="p-2 border rounded-md flex-grow"
                        />
                        <button
                            ref={searchButtonRef}
                            onClick={handleSearch}
                            disabled={loading}
                            className={`p-2 ml-2 rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
                        >
                            {loading ? 'Searching...' : 'Go'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    {loading ? (
                        <ChatLoading />
                    ) : (
                        datas.length > 0 ? (
                            datas.map(user => (
                                <UserListItem key={user._id} handleFunction={() => accessChat(user._id)} user={user} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-center mt-4">No users found.</p>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default SideDraw;
