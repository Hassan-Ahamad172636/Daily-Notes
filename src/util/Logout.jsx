import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
// import { toast } from 'sonner'
import ConfirmDialog from './confirmatoin'
import { useToast } from "ai-toast";


const LogoutButton = () => {
   const { showToast } = useToast();
  const location = useLocation()
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false);

  // sirf "/" route per dikhaye
  if (location.pathname !== '/') return null

  const handleLogout = () => {
    // localStorage.removeItem('token')
    // navigate('/login') 
    // toast.success('User logout!')
    showToast('User logout successfully!')
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
    <ConfirmDialog onConfirm={handleLogout} onCancel={() => setDialogOpen(false)} title={'Logout'} message={'Are you sure!'} isLogout={true}></ConfirmDialog>
    )}
    
    </>
  )
}

export default LogoutButton
