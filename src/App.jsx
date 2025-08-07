import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Home as HomeIcon } from 'lucide-react'

import LoginPage from './Pages/public/Login'
import SignupPage from './Pages/public/Signup'
import Home from './Pages/private/Home'
import Chat from './Pages/private/Chat'

import 'sonner'
import './index.css' // make sure Tailwind is working
import Task from './Pages/private/Task'
import Namaz from './Pages/private/Namaz'
import Income from './Pages/private/Income'
import Shopping from './Pages/private/shoping'
import Idea from './Pages/private/Idea'
import Schedule from './Pages/private/Schedule'

function FloatingHomeButton() {
  const navigate = useNavigate()
  const location = useLocation()

  // Hide button on "/" (home page) if desired
  if (location.pathname === '/') return null

  return (
    <button
      onClick={() => navigate('/')}
      className="cursor-pointer fixed ease-in-out bottom-4 left-4 bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-full shadow-lg z-50 transition-all"
      title="Go to Home"
    >
      <HomeIcon className="h-5 w-5" />
    </button>
  )
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/task" element={<Task />} />
        <Route path="/namaz" element={<Namaz />} />
        <Route path="/income" element={<Income />} />
        <Route path="/shoping" element={<Shopping />} />
        <Route path="/ideas" element={<Idea />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>

      {/* Floating Home Button */}
      <FloatingHomeButton />

      {/* Toast Notifications */}
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
