import React, { useState, useEffect, useRef } from 'react';
import { ChatState } from '../../context/Chatrovide';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

function GroupChatModal({ isOpen, setIsOpen }) {
    const [groupchatname, setgroupchatname] = useState("");
    const [selectedUser, setselectedUser] = useState([]);
    const [search, setsearch] = useState("");
    const [searchResult, setsearchResult] = useState([]);
    const [loading, setloading] = useState(false);
    const [message, setMessage] = useState("");

    const { userData, chats, setChats } = ChatState();
    const navigate = useNavigate();
    const modalRef = useRef(null); // Reference for the modal container

    const handleSearch = async (query) => {
        setsearch(query);
        if (!query) return;
        setloading(true);
        setTimeout(async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userData.token}` } };
                const { data } = await axios.get(`/api/user?search=${query}`, config);
                setloading(false);
                setsearchResult(data);
            } catch (error) {
                setloading(false);
                console.error(error);
            }
        }, 500);
    };

    const handleAddUser = (user) => {
        if (selectedUser.find((u) => u._id === user._id)) {
            setMessage("User already added");
            return;
        }
        setselectedUser([...selectedUser, user]);
        gsap.fromTo(
            `.user-badge-${user._id}`,
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
    };

    const handleDeleteUser = (userToRemove) => {
        setselectedUser(selectedUser.filter((u) => u._id !== userToRemove._id));
        gsap.to(`.user-badge-${userToRemove._id}`, { opacity: 0, scale: 0.5, duration: 0.3, ease: 'back.in(1.7)' });
    };

    const handlesubmit = async () => {
        if (!groupchatname || selectedUser.length === 0) {
            setMessage("Please fill out all the fields");
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${userData.token}` } };
            const { data } = await axios.post("/api/chat/group", {
                name: groupchatname,
                users: JSON.stringify(selectedUser.map((u) => u._id)),
            }, config);

            setChats([data, ...chats]);
            setMessage("Group chat created successfully!");
            setIsOpen(false); // Close modal on successful creation
            navigate('/chat');
        } catch (error) {
            setMessage("Failed to create group chat");
        }
    };

    // Effect to close the modal when clicking outside
    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(
                '.modal-content',
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
            );
        }

        // Close modal when clicking outside of it
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            window.addEventListener('mousedown', handleClickOutside);
        } else {
            window.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            window.removeEventListener('mousedown', handleClickOutside); // Cleanup on component unmount
        };
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div ref={modalRef} className="modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <header className="text-center font-semibold text-lg mb-4">Create Group Chat</header>
                <form className="flex flex-col space-y-3">
                    <input
                        type="text"
                        placeholder="Chat Name"
                        className="p-2 border rounded-md"
                        value={groupchatname}
                        onChange={(e) => setgroupchatname(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Add User"
                        className="p-2 border rounded-md"
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedUser.map((user, index) => (
                            <UserBadgeItem
                                key={user._id}
                                user={user}
                                className={`user-badge-${user._id}`}
                                handleFunction={() => handleDeleteUser(user)}
                            />
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center mt-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        searchResult.slice(0, 4).map((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                        ))
                    )}

                    {message && (
                        <p className="text-center text-red-500 mt-2">{message}</p>
                    )}

                    <button
                        type="button"
                        className="bg-blue-500 text-white p-2 rounded-md mt-4"
                        onClick={handlesubmit}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default GroupChatModal;
