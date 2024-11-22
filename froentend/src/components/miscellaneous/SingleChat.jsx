import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaUsers } from 'react-icons/fa';
import ProfileModal from './ProfileModal';
import UpdateGroupModal from './UpdateGroupChatModal';
import { getSender, getSenderfull } from '../../config/Chatlogic';
import { ChatState } from '../../context/Chatrovide';
import profile from '../../assets/profile.jpeg';
import axios from 'axios';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:5000"; // Backend server endpoint
var socket, selectedChatCompare;

function SingleChat({ fetchagain, setfetchagain }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const { selectedChat, setSelectedChat, userData, notification, setNotification } = ChatState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setisTyping] = useState(false);
    const chatUser = !selectedChat?.isGroupchat
        ? getSenderfull(userData, selectedChat?.users)
        : selectedChat?.users;

    const messagesEndRef = useRef(null); // Reference for scroll position

    // Initialize socket and set up listeners
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", userData);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setisTyping(true));
        socket.on("stop typing", () => setisTyping(false));
    }, [userData]);

    // Fetch messages from the backend with a simulated delay
    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            };
            setTimeout(async () => {
                const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
                console.log("Fetched messages: ", data);
                setMessages(data);
                setLoading(false);
                socket.emit("join Chat", selectedChat._id);
            }, 1000); // Simulating a 1-second delay before fetching messages
        } catch (error) {
            console.error("Failed to load messages", error);
            setLoading(false);
        }
    };

    // Send a new message
    const sendMessage = async (e) => {
        e.preventDefault();
        if (newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userData.token}`,
                    },
                };
                const { data } = await axios.post(
                    "/api/message",
                    { content: newMessage, chatId: selectedChat._id },
                    config
                );
                console.log("Sent message: ", data);
                socket.emit("new message", data);
                setMessages((prevMessages) => [...prevMessages, data]);
                setNewMessage("");
            } catch (error) {
                console.error("Failed to send message", error);
            }
        }
    };

    // Scroll to the bottom when new message comes
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Fetch messages when selectedChat changes
    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
            selectedChatCompare = selectedChat;
        }
    }, [selectedChat]);

    // Listen for incoming messages
    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if (!selectedChatCompare || selectedChat._id !== newMessageReceived.chat._id) {
                // give notification
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
            }
        });

        // Cleanup listener on component unmount or dependency change
        return () => {
            socket.off('message received');
        };
    }, [selectedChat, selectedChatCompare]);

    const handleProfileClick = () => {
        if (selectedChat.isGroupchat) {
            setIsGroupModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        const timerLength = 2000;
        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-t-lg shadow-md">
                <button
                    className="text-xl text-blue-500 hover:text-blue-700"
                    onClick={() => setSelectedChat(null)}
                >
                    <FaArrowLeft />
                </button>

                <h3 className="text-lg font-bold text-blue-500 text-center w-full">
                    {selectedChat?.isGroupchat
                        ? selectedChat.chatName
                        : getSender(userData, selectedChat?.users) || 'User'}
                </h3>

                <div className="flex items-center">
                    {selectedChat?.isGroupchat ? (
                        <FaUsers
                            onClick={handleProfileClick}
                            className="text-xl text-blue-500 cursor-pointer hover:text-blue-700"
                        />
                    ) : (
                        <img
                            src={chatUser?.pic || profile}
                            alt="Profile"
                            className="w-8 h-8 rounded-full cursor-pointer"
                            onClick={handleProfileClick}
                        />
                    )}
                </div>
            </div>

            <div className="w-full bg-white p-4 flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                {loading ? (
                    <div>Loading messages...</div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`my-2 p-2 rounded-lg ${msg.sender._id === userData._id
                                ? 'bg-blue-100 text-right self-end'
                                : 'bg-gray-100 text-left self-start'
                                }`}
                        >
                            {!selectedChat?.isGroupchat && msg.sender._id !== userData._id ? null : (
                                <strong>{msg.sender.name}: </strong>
                            )}
                            {msg.content}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-gray-100 rounded-b-lg flex items-center">
                <input
                    type="text"
                    placeholder="Enter a message..."
                    value={newMessage}
                    onChange={typingHandler}
                    className="flex-grow px-4 py-2 mr-2 border rounded-md"
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                    Send
                </button>
            </form>

            {isModalOpen && (
                <ProfileModal
                    isGroupChat={selectedChat?.isGroupchat}
                    chatInfo={selectedChat}
                    onClose={() => setIsModalOpen(false)}
                    users={chatUser}
                    isAdmin={selectedChat?.groupAdmin?._id === userData._id}
                />
            )}

            {selectedChat?.isGroupchat && isGroupModalOpen && (
                <UpdateGroupModal
                    chatInfo={selectedChat}
                    onClose={() => setIsGroupModalOpen(false)}
                    isAdmin={selectedChat?.groupAdmin?._id === userData._id}
                    chatUser={chatUser}
                    fetchAgain={fetchagain}
                    setFetchAgain={setfetchagain}
                />
            )}
        </div>
    );
}

export default SingleChat;
