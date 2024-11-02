import React, { useEffect, useState } from 'react'
import axios from 'axios'

function ChatePage() {
    const [chats, Setchats] = useState([]);
    const fetchChat = async () => {
        try {
            const response = await axios.get("/api/chat")
            Setchats(response.data) // Logs only the data part of the response

        } catch (error) {
            console.error("Error fetching chat data:", error)
        }
    }

    useEffect(() => {
        fetchChat()
    }, [])

    return (
        <div>
            {chats.map(chat => (
                <div key={chat.id}>
                    <strong>{chat.user}:  </strong> {chat.message}
                </div>
            ))}
        </div>
    )
}

export default ChatePage
