import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Home as HomeIcon } from 'lucide-react'

import LoginPage from './Pages/public/Login'
import SignupPage from './Pages/public/Signup'
import Home from './Pages/private/Home'
import Chat from './Pages/private/Chat'
import Task from './Pages/private/Task'
import Namaz from './Pages/private/Namaz'
import Income from './Pages/private/Income'
import Shopping from './Pages/private/shoping'
import Idea from './Pages/private/Idea'
import Schedule from './Pages/private/Schedule'

import AuthGuard from '../src/guards/AuthGurad'
import ForwardAuthGuard from './guards/ForwardAuthGuard'

import './index.css'
import LogoutButton from './util/Logout'

function FloatingHomeButton() {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/sign-up') return null

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
        {/* Public Routes with ForwardAuth */}
        <Route path="/login" element={
          <ForwardAuthGuard>
            <LoginPage />
          </ForwardAuthGuard>
        } />
        <Route path="/sign-up" element={
          <ForwardAuthGuard>
            <SignupPage />
          </ForwardAuthGuard>
        } />

        {/* Private Routes with AuthGuard */}
        <Route path="/" element={
          <AuthGuard>
            <Home />
          </AuthGuard>
        } />
        <Route path="/chat" element={
          <AuthGuard>
            <Chat />
          </AuthGuard>
        } />
        <Route path="/task" element={
          <AuthGuard>
            <Task />
          </AuthGuard>
        } />
        <Route path="/namaz" element={
          <AuthGuard>
            <Namaz />
          </AuthGuard>
        } />
        <Route path="/income" element={
          <AuthGuard>
            <Income />
          </AuthGuard>
        } />
        <Route path="/shoping" element={
          <AuthGuard>
            <Shopping />
          </AuthGuard>
        } />
        <Route path="/ideas" element={
          <AuthGuard>
            <Idea />
          </AuthGuard>
        } />
        <Route path="/schedule" element={
          <AuthGuard>
            <Schedule />
          </AuthGuard>
        } />
      </Routes>

      <LogoutButton />
      {/* Floating Home Button */}
      <FloatingHomeButton />

      {/* Toasts */}
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
