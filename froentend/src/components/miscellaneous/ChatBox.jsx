import React from 'react';
import { ChatState } from '../../context/Chatrovide';
import SingleChat from '../../components/miscellaneous/SingleChat.jsx'

function ChatBoxWrapper({ fetchagain, setfetchagain, setSelectedChat }) {
    const { selectedChat } = ChatState();

    return (
        <div className={`flex ${selectedChat ? "block" : "hidden"} md:flex flex-col w-full`}>
            {/* Render SingleChat with necessary props */}
            {selectedChat ? (
                <SingleChat
                    fetchagain={fetchagain}
                    setfetchagain={setfetchagain}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                />
            ) : (
                <div className="w-full flex justify-center items-center flex-1">
                    <p className="text-gray-500">No chat selected. Click on a user to start chatting.</p>
                </div>
            )}
        </div>
    );
}

export default ChatBoxWrapper;
