import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaUsers } from 'react-icons/fa';
import ProfileModal from './ProfileModal';
import UpdateGroupModal from './UpdateGroupChatModal'; // Assuming you have this component
import { getSender, getSenderfull } from '../../config/Chatlogic';
import { ChatState } from '../../context/Chatrovide';
import profile from '../../assets/profile.jpeg';

function SingleChat({ fetchagain, setfetchagain }) {
    // Destructure values from ChatState for accessing selected chat and user data
    const { selectedChat, setSelectedChat, userData } = ChatState();

    // State to control the visibility of the profile modal (for individual chats)
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State to control the visibility of the group chat update modal
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    // Determine the chat user based on chat type
    const chatUser = !selectedChat.isGroupchat
        ? getSenderfull(userData, selectedChat.users) // If one-on-one chat, get the other user’s info
        : selectedChat.users; // For group chats, use the list of users

    // Log chat user data for debugging purposes
    useEffect(() => {
        if (selectedChat) {
            if (selectedChat.isGroupchat) {
                console.log('Group chat users:', chatUser); // Logs users if group chat
            } else {
                console.log('One-on-one chat user:', chatUser); // Logs single user if one-on-one chat
            }
        }
    }, [selectedChat, chatUser]);

    // Open profile modal based on chat type (individual or group)
    const handleProfileClick = () => {
        if (selectedChat.isGroupchat) {
            setIsGroupModalOpen(true); // Opens group chat update modal for group chats
        } else {
            setIsModalOpen(true); // Opens individual profile modal for one-on-one chats
        }
    };

    return (
        <div className="flex flex-col w-full">
            {/* Header section: includes back button, chat name, and profile/group icon */}
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-t-lg shadow-md">
                {/* Back button to go back to chat list */}
                <button
                    className="text-xl text-blue-500 hover:text-blue-700"
                    onClick={() => setSelectedChat(null)} // Deselects chat to go back
                >
                    <FaArrowLeft />
                </button>

                {/* Chat title displays either the group name or the other user’s name */}
                <h3 className="text-lg font-bold text-blue-500 text-center w-full">
                    {selectedChat.isGroupchat
                        ? selectedChat.chatName // Group chat name
                        : getSender(userData, selectedChat.users) || 'User'}
                </h3>

                {/* Profile icon or group icon depending on chat type */}
                <div className="flex items-center">
                    {selectedChat.isGroupchat ? (
                        // Group icon that opens group modal when clicked
                        <FaUsers
                            onClick={handleProfileClick}
                            className="text-xl text-blue-500 cursor-pointer hover:text-blue-700"
                        />
                    ) : (
                        // Profile image for one-on-one chat user
                        <img
                            src={chatUser?.pic || profile} // Display profile picture or default
                            alt="Profile"
                            className="w-8 h-8 rounded-full cursor-pointer"
                            onClick={handleProfileClick}
                        />
                    )}
                </div>
            </div>

            {/* Chat content area: displays the chat messages (render logic can be added here) */}
            <div className="w-full bg-white p-4 flex-1 overflow-y-auto">
                {/* Render messages code has been omitted for simplicity */}
            </div>

            {/* Profile modal for individual chats */}
            {isModalOpen && (
                <ProfileModal
                    isGroupChat={selectedChat.isGroupchat} // Indicates if the chat is a group chat
                    chatInfo={selectedChat} // Passes selected chat data to the modal
                    onClose={() => setIsModalOpen(false)} // Function to close modal
                    users={chatUser} // Passes chat user data
                    isAdmin={selectedChat.groupAdmin?._id === userData._id} // Checks if current user is admin
                />
            )}

            {/* Group chat update modal, rendered only for group chats */}
            {selectedChat.isGroupchat && isGroupModalOpen && (
                <UpdateGroupModal
                    chatInfo={selectedChat} // Passes selected chat data to the modal
                    onClose={() => setIsGroupModalOpen(false)} // Function to close modal
                    isAdmin={selectedChat.groupAdmin?._id === userData._id} // Checks if current user is admin
                    chatUser={chatUser} // Passes list of users in group chat
                    fetchAgain={fetchagain} // Re-fetch flag to update UI after changes
                    setFetchAgain={setfetchagain} // Function to toggle fetchAgain for refreshing data
                />
            )}
        </div>
    );
}

export default SingleChat;
