import React, { useState } from 'react';
import { ChatState } from '../context/Chatrovide';
import SideDraw from '../components/miscellaneous/SideDraw';
import MyChat from '../components/miscellaneous/MyChat'; // Import your chat component
import ChatBox from '../components/miscellaneous/ChatBox'; // Import your chat box component

function ChatPage() {
    const { userData } = ChatState();  // Using userData from context
    const [fetchagain, setfetchagain] = useState(false);

    return (
        <div className="flex flex-col w-full h-screen bg-gray-100">
            {/* Sidebar component only if user exists */}
            {userData && userData.name && <SideDraw />}

            <div className="flex flex-1 flex-col lg:flex-row">
                {/* MyChat component for smaller windows */}
                {userData && userData.name && (
                    <div className="lg:w-1/3 w-full bg-blue-100 rounded-lg shadow-md p-4 h-[91.5vh] overflow-y-auto lg:block hidden transition-all ease-in-out duration-300">
                        <MyChat fetchagain={fetchagain} />
                    </div>
                )}

                {/* ChatBox component taking the remaining space */}
                {userData && userData.name && (
                    <div className="flex-1 bg-white rounded-lg shadow-md p-4 h-[91.5vh] overflow-hidden transition-all ease-in-out duration-300">
                        <ChatBox fetchagain={fetchagain} setfetchagain={setfetchagain} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatPage;
