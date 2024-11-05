import React from 'react';
import { ChatState } from '../context/Chatrovide';
import SideDraw from '../components/miscellaneous/SideDraw';
import MyChat from '../components/miscellaneous/MyChat'; // Import your chat component
import ChatBox from '../components/miscellaneous/ChatBox'; // Import your chat box component

function ChatPage() {
    const { user } = ChatState();

    return (
        <div className="flex flex-col w-full h-screen bg-gray-100">
            {/* Sidebar component only if user exists */}
            {user && <SideDraw />}

            <div className="flex flex-1">
                {/* Main chat area */}
                <div className="flex flex-row w-full p-6 gap-7">
                    {/* MyChat component in a smaller window */}
                    {user && (
                        <div className="w-1/3 bg-white rounded-lg shadow-md p-4 h-[91.5vh] overflow-y-auto">
                            <MyChat />
                        </div>
                    )}

                    {/* ChatBox component taking the remaining space */}
                    {user && (
                        <div className="flex-1 bg-white rounded-lg shadow-md p-4 h-[91.5vh]">
                            <ChatBox />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default ChatPage;
