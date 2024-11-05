import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ChatProvider from './context/Chatrovide.jsx'

import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>

    <ChatProvider>
      <App />
    </ChatProvider>

  </BrowserRouter>
)
