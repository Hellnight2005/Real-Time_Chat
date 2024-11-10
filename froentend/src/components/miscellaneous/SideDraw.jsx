import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { ChatState } from '../../context/Chatrovide';

function SideDraw() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [datas, setDatas] = useState([]);
    const navigate = useNavigate();
    const { userData, setUserData, setChats, chats, setSelectedChat } = ChatState();
    const searchContainerRef = useRef(null);

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

    return (
        <div className="relative w-full p-7 bg-blue-100 flex items-center rounded-lg shadow-md">
            <div className="flex w-full max-w-screen-lg justify-between items-center">
                <FaSearch className="text-blue-700 cursor-pointer" onClick={() => setIsSearchOpen(!isSearchOpen)} />
                <h1 className="text-2xl font-bold text-blue-800 flex-grow text-center">CHATS</h1>
                <FaBell className="text-blue-300 text-2xl cursor-pointer" />
                <img src={userData?.pic} alt="Profile" className="w-10 h-10 rounded-full cursor-pointer" onClick={() => navigate('/profile')} />
                <span className="text-blue-800 cursor-pointer" onClick={() => navigate('/profile')}>{userData?.name}</span>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {isSearchOpen && (
                <div ref={searchContainerRef} className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-20 p-4">
                    <h2 className="text-xl font-semibold mb-4">Search User</h2>
                    <div className="flex items-center">
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Enter username..." className="p-2 border rounded-md flex-grow" />
                        <button onClick={handleSearch} disabled={loading} className={`p-2 ml-2 rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}>{loading ? 'Searching...' : 'Go'}</button>
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
