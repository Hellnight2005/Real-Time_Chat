import React from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './Pages/Homepage'
import ChatePage from './Pages/ChatePage'
import Login from './Authentication/Login'
import Signup from './Authentication/Sigup'

function App() {
  return (

    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/chat' element={<ChatePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>

  )
}

export default App
