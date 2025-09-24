import React, { useState } from 'react'
import AuthCard from '../components/AuthCard';
import { isEmptyInput, isInvalidEmailAddress } from '../utilities/validation'
import { toast } from 'react-toastify';
import { FaEnvelope } from 'react-icons/fa';
import InputGroup from '../components/InputGroup'
import SecondaryButton from '../components/SecondaryButton'
import { Link } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import useAuthContext from '../contexts/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');  
  const [firebaseResp, setFirebaseResp] = useState(null);
  const [sending, setSending] = useState(false);
  const {auth, sendPasswordResetEmail} = useAuthContext();

  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  const requestResetLink = async() => {
    if (isEmptyInput(email) || isInvalidEmailAddress(email)) {
      toast.error("A valid email adddress is required");
      return;
    }

    try {
      /* set state for request init */
      setSending(true);
      setFirebaseResp(null);

      //send reset request to firebase
      await sendPasswordResetEmail(auth, email)

      /* set success states */
      setFirebaseResp({
          msg: "Excellent! Password reset link was sent to your email address.",
          type: "success"
        })      
      setEmail("")
    } catch (error) {
      console.error(error)
      if (error.message && error.statusCode === 404) {
        setFirebaseResp({
          msg: "Provided email address doesn't exist in our records",
          type: "error"
        })
      } else {
        toast.error("Unable to complete your request");
      }
    } finally {
      setSending(false);
    }
  }


  return (
    <AuthCard>
      <div className='w-full flex justify-center items-center pt-10'>
        <div className="w-full max-w-xl bg-white shadow rounded-xl p-8">
          <h2 className='text-2xl font-semibold text-gray-700 mb-6 text-center'>Forgot Password</h2>
          <p className='text-sm text-gray-600 text-center mb-6'>We'll email a password reset link to you. To proceed with this password reset request, provide below your valid email address used during <span className="font-bold text-gray-800">Sign-up.</span></p>
          {firebaseResp && <p className={`text-center text-sm mb-6 ${firebaseResp.type=='error' ? 'text-red-600' : 'text-green-600'}`}>{firebaseResp.msg}</p> }
          <InputGroup
            icon={<FaEnvelope size={20} /> }
            onChange={handleChange}
            name="email"
            id="email"
          />
          <div className="mt-6 flex justify-center">
              <SecondaryButton 
              type="button"
              onClick={requestResetLink}
              >{sending ? <span className="animate-pulse">submitting ...</span> : ( (firebaseResp && firebaseResp.type == 'success') ? 'Request new link' : 'Get reset link' )}</SecondaryButton>
          </div>
          <div className="mt-6 text-center">
            <Link 
            to={'/sign-in'} 
            className='text-sm font-semibold text-gray-600 hover:text-gray-800 hover:underline inline-flex gap-1 justify-center items-center'
            >
              <GoArrowLeft size={20}/>
              Return to Sign-In
            </Link>
          </div>
        </div>
      </div>
    </AuthCard>
  )
}
