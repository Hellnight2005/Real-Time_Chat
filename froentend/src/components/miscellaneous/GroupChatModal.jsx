import React, { useState } from 'react';
import { ChatState } from '../../context/Chatrovide';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { useNavigate } from 'react-router-dom';

function GroupChatModal({ isOpen, setIsOpen }) {
    const [groupchatname, setgroupchatname] = useState("");
    const [selectedUser, setselectedUser] = useState([]);
    const [search, setsearch] = useState("");
    const [searchResult, setsearchResult] = useState([]);
    const [loading, setloading] = useState(false);
    const [message, setMessage] = useState("");

    const { userData, chats, setChats } = ChatState();
    const navigate = useNavigate();

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
    };

    const handleDeleteUser = (userToRemove) => {
        setselectedUser(selectedUser.filter((u) => u._id !== userToRemove._id));
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

    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
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
