import React from 'react'
import { PiSignOut } from "react-icons/pi";
import useAuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';
import { PiSignInLight } from "react-icons/pi";


export default function AuthStateButton() {
  const { authUser, signOut } = useAuthContext()
  const navigate = useNavigate()
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  }

  const redirectToSignIn = () => {
    navigate('/sign-in');
  }

  return authUser ? (
    <button
      className='bg-transparent p-1 text-gray-700 text-xs uppercase roboto-extrabold border-b-2 border-transparent cursor-pointer hover:border-gray-700 inline-flex gap-2 items-center'
      onClick={handleSignOut}>
      Sign Out
      <PiSignOut className='size-5' strokeWidth={4}/>
    </button>
  ) : <button 
  type="button" 
  onClick={redirectToSignIn}
  className='bg-transparent p-1 text-green-700 text-xs uppercase roboto-extrabold border-b-2 border-transparent cursor-pointer hover:border-green-700 inline-flex gap-2 items-center'
   >    
    <span>Sign in</span>
    <PiSignInLight size={20} strokeWidth={4}/>
  </button>
}
