import React, { useState, useEffect } from 'react';
import { ChatState } from '../../context/Chatrovide';
import axios from 'axios';
import ChatLoading from '../miscellaneous/ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/Chatlogic';  // Assuming this function is defined in the right way
import GroupChatModal from './GroupChatModal';

function MyChat({ fetchagain }) {
    const { userData, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [loggedUser, setLoggedUser] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${userData.token}` } };
            const { data } = await axios.get('/api/chat', config);
            setChats(data); // Update the chats state with fetched data
        } catch (error) {
            setError('Failed to load chats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            setLoggedUser(JSON.parse(userInfo));  // Set logged user from localStorage
        }
    }, []);

    useEffect(() => {
        if (userData?.token) {
            fetchChats();  // Fetch chats after userData is available
        }
    }, [fetchagain]);  // Dependency on userData to fetch chats when it's available

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);  // On click, set the selected chat
    };

    return (
        <div className="p-4">
            <div className="flex flex-col border-r-2 pr-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-blue-600">My Chats</h2>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-2xl">+Group Chat</button>
                </div>

                <div className="mt-4">
                    {loading ? (
                        <ChatLoading />
                    ) : error ? (
                        <p className="text-red-800">{error}</p>
                    ) : (
                        chats.length > 0 ? (
                            chats.map((chat) => (
                                <div
                                    key={chat._id}
                                    onClick={() => handleSelectChat(chat)}  // On click, set the selected chat
                                    className={`p-2 border-b cursor-pointer ${selectedChat && selectedChat._id === chat._id ? 'bg-blue-100' : ''}`}
                                >
                                    {!chat.isGroupchat ? (
                                        getSender(loggedUser, chat.users)  // Display the second user's name for one-on-one chat
                                    ) : (
                                        <div>{chat.chatName}</div>  // For group chats, display the group name
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No chats available</p>
                        )
                    )}
                </div>
            </div>

            {isModalOpen && <GroupChatModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />}
        </div>
    );
}

export default MyChat;
