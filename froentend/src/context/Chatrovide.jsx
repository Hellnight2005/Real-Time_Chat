import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);  // Ensure you have useState imported from 'react'

    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            setUserData(JSON.parse(storedUserInfo));
            setLoading(false);
        } else {
            navigate('/');
        }
    }, []);

    const login = (userInfo) => {
        setUserData(userInfo);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
    };

    return (
        <ChatContext.Provider value={{ userData, setUserData, login, selectedChat, setSelectedChat, chats, setChats, loading }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;
