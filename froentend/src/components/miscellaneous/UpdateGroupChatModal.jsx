import React, { useState } from 'react';
import axios from 'axios';
import { FaEye } from 'react-icons/fa';
import { ChatState } from '../../context/Chatrovide';
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

// Modal component to manage group chat settings, including renaming, adding, and removing users
const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, chatUser }) => {
    const [isOpen, setIsOpen] = useState(false); // State to control modal visibility
    const [groupChatName, setGroupChatName] = useState(""); // State to store new group name
    const [search, setSearch] = useState(""); // State to store search input
    const [searchResult, setSearchResult] = useState([]); // State to store search results
    const [loading, setLoading] = useState(false); // Loading state for search
    const [renameloading, setRenameLoading] = useState(false); // Loading state for renaming
    const { selectedChat, setSelectedChat, userData } = ChatState(); // Chat state management

    // Check if the user is an admin of the group
    const isAdmin = selectedChat.groupAdmin?._id === userData.id;
    console.log(isAdmin); // Debugging log
    console.log(selectedChat.groupAdmin?._id); // Debugging log
    console.log(userData.id); // Debugging log

    // Function to toggle modal visibility
    const toggleModal = () => setIsOpen(!isOpen);

    // Function to handle search for adding new users to the group
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;

        try {
            setLoading(true); // Start loading state
            const config = {
                headers: { Authorization: `Bearer ${userData.token}` }, // Set auth token in headers
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config); // Fetch search results
            setLoading(false); // Stop loading state
            setSearchResult(data); // Store search results
        } catch (error) {
            console.error(error); // Log any error
            setLoading(false); // Stop loading state in case of error
        }
    };

    // Function to rename the group chat
    const handleRename = async () => {
        if (!groupChatName) return; // Return if no new name is provided

        try {
            setRenameLoading(true); // Start rename loading state
            const config = {
                headers: { Authorization: `Bearer ${userData.token}` }, // Set auth token in headers
            };
            const { data } = await axios.put(
                `/api/chat/rename`,
                { chatId: selectedChat._id, chatName: groupChatName }, // Send new group name to backend
                config
            );
            setSelectedChat(data); // Update the selected chat with new name
            setFetchAgain(!fetchAgain); // Toggle fetchAgain to refresh data
            setRenameLoading(false); // Stop rename loading state
        } catch (error) {
            console.error(error); // Log any error
            setRenameLoading(false); // Stop rename loading state in case of error
        }
        setGroupChatName(""); // Clear the input field after renaming
    };

    // Function to add a user to the group
    const handleAddUser = async (user1) => {
        // Check if user is already in the group
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            alert("User already in group!"); // Show alert if user is already in group
            return;
        }

        // Check if the current user is an admin
        if (!isAdmin) {
            alert("Only admins can add someone!"); // Show alert if current user isn't an admin
            return;
        }

        try {
            setLoading(true); // Start loading state
            const config = {
                headers: { Authorization: `Bearer ${userData.token}` }, // Set auth token in headers
            };
            const { data } = await axios.put(
                `/api/chat/groupadd`,
                { chatId: selectedChat._id, userId: user1._id }, // Send user data to backend for adding to group
                config
            );
            setSelectedChat(data); // Update selected chat with added user
            setFetchAgain(!fetchAgain); // Toggle fetchAgain to refresh data
            setLoading(false); // Stop loading state
        } catch (error) {
            console.error(error); // Log any error
            setLoading(false); // Stop loading state in case of error
        }
    };

    // Function to remove a user from the group
    const handleRemove = async (userId) => {
        // Confirm action with the user
        const confirmation = window.confirm(`Are you sure you want to ${userId === userData.id ? "leave" : "remove"} this group?`);

        if (!confirmation) return; // Return if user cancels

        // Check if the current user is an admin or trying to leave the group
        if (!isAdmin && userId !== userData.id) {
            alert("Only admins can remove someone from the group."); // Show alert if user isn't an admin
            return;
        }

        try {
            setLoading(true); // Start loading state
            const config = {
                headers: { Authorization: `Bearer ${userData.token}` }, // Set auth token in headers
            };
            const { data } = await axios.put(
                `/api/chat/groupremove`,
                { chatId: selectedChat._id, userId: userId }, // Send user ID for removal from group
                config
            );

            // Check if removed user is the group admin, reset selected chat if admin is removed
            if (userId === selectedChat.groupAdmin._id) {
                setSelectedChat(null); // Clear selected chat if admin is removed
            } else {
                userId === userData.id ? setSelectedChat(null) : setSelectedChat(data);
            }

            setFetchAgain(!fetchAgain); // Toggle fetchAgain to refresh data
            setLoading(false); // Stop loading state
        } catch (error) {
            console.error(error); // Log any error
            setLoading(false); // Stop loading state in case of error
        }
    };

    return (
        <>
            {/* Button to open modal */}
            <button onClick={toggleModal} className="p-2 bg-blue-500 text-white rounded-lg">
                <FaEye /> {/* Eye icon to indicate modal button */}
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-96 rounded-lg shadow-lg p-4">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b pb-3 mb-3">
                            <h2 className="text-2xl font-semibold">{selectedChat.chatName}</h2>
                            <button className="text-gray-500 text-xl" onClick={toggleModal}>
                                X {/* Close button */}
                            </button>
                        </div>

                        <div className="mb-4">
                            {/* Display selected users in group */}
                            <div className="flex flex-wrap gap-2">
                                {chatUser.map((u) => (
                                    <UserBadgeItem
                                        key={u._id}
                                        user={u}
                                        admin={selectedChat.groupAdmin}
                                        handleFunction={() => isAdmin && handleRemove(u._id)} // Remove user if admin
                                    />
                                ))}
                            </div>

                            {/* Group admin controls */}
                            {isAdmin && (
                                <>
                                    {/* Group chat name input */}
                                    <input
                                        type="text"
                                        className="w-full p-2 mt-4 border border-gray-300 rounded-md"
                                        placeholder="Chat Name"
                                        value={groupChatName}
                                        onChange={(e) => setGroupChatName(e.target.value)}
                                    />
                                    <button
                                        onClick={handleRename}
                                        className="mt-2 p-2 bg-teal-500 text-white rounded-md"
                                        disabled={renameloading}
                                    >
                                        {renameloading ? "Renaming..." : "Update"}
                                    </button>

                                    {/* User search input */}
                                    <input
                                        type="text"
                                        className="w-full p-2 mt-4 border border-gray-300 rounded-md"
                                        placeholder="Add User to group"
                                        value={search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />

                                    {/* Display search results */}
                                    {loading ? (
                                        <div className="flex justify-center items-center mt-4">
                                            <span>Loading...</span>
                                        </div>
                                    ) : (
                                        <div className="mt-4">
                                            {searchResult?.map((user) => (
                                                <UserListItem
                                                    key={user._id}
                                                    user={user}
                                                    handleFunction={() => handleAddUser(user)} // Add user
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateGroupChatModal;
