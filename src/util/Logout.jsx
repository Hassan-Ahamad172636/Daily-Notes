import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ConfirmDialog from './confirmatoin'

const LogoutButton = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false);

  // sirf "/" route per dikhaye
  if (location.pathname !== '/') return null

  const handleLogout = () => {
    localStorage.removeItem('token') // or your token key
    navigate('/login') // redirect to login page
    toast.success('User logout!')
  }

  return (
    <>
    <button
      onClick={() => setDialogOpen(true)}
      className="cursor-pointer fixed top-80 left-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-r-full shadow-md transition-all z-50"
    >
      <LogOut/>
    </button>

    {dialogOpen && (
    <ConfirmDialog onConfirm={handleLogout} onCancel={() => setDialogOpen(false)} title={'Logout'} message={'Are you sure!'}></ConfirmDialog>
    )}
    
    </>
  )
}

export default LogoutButton
