import React, { useState } from 'react'
import InputGroup from '../components/InputGroup';
import { FaEnvelope } from 'react-icons/fa6';
import InputGroupPassword from '../components/InputGroupPassword';
import { Link, useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton';
import { isInvalidEmailAddress } from '../utilities/validation';
import AuthCard from '../components/AuthCard';
import useAuthContext from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()
  const {signIn} = useAuthContext();

  const handleChange = (e) => {
    const newValue = e.target.value;
    const field = e.target.name;

    setFormData({ ...formData, [field]: newValue });
  }

  function isInvalidForm(form) {
    let instantErrors = {};
    if (form.email == "") {
      instantErrors.email = "Email cannot be empty."
    }

    if (form.password == "") {
      instantErrors.password = "Password cannot be empty.";
    }

    if (!instantErrors.email && isInvalidEmailAddress(form.email)) {
      instantErrors.email = "Email provided is invalid.";
    }

    setErrors({ ...instantErrors });
    return Object.keys(instantErrors).length > 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    //check empty input
    if (isInvalidForm(formData)) return;

    //sign in user
    try {
      setErrors({})
      setSubmitting(true);      
     
      const userCredential = await signIn(formData.email, formData.password);
      if (!userCredential.user) throw new Error("Operation failed, unable to find user");
      /* navigate */
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Oops! Unable to Sign-in, try again another time.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard>
      <div className='flex items-center justify-center py-10'>
        <div className="w-full max-w-lg mx-auto flex flex-col bg-white rounded-xl shadow-md p-6">
          <h1 className="text-center text-2xl font-semibold">Glad to see you again! Sign-in</h1>         
          <div className="w-full mt-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6 flex flex-col gap-1">
                <InputGroup
                  id="email"
                  type="text"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  icon={<FaEnvelope />}
                />
                {
                  errors.email && <p className="text-sm text-red-600">{errors.email}</p>
                }
              </div>
              <div className="mb-6 flex flex-col gap-1">
                <InputGroupPassword
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {
                  errors.email && <p className="text-sm text-red-600">{errors.email}</p>
                }
              </div>
              <div className="flex justify-end">
                <Link to={'/forgot-password'} className='capitalize text-gray-600 hover:underline hover:text-gray-800 font-semibold text-sm tracking-wide'>Forgot Password?</Link>
              </div>
              <div className="mt-4 flex flex-col">
                <PrimaryButton type="submit">{submitting ? <span className='animate-pulse'>Signing in ...</span> : 'Sign-in'}</PrimaryButton>
              </div>
            </form>
            <div className="mt-4 text-center">
              <Link to={'/sign-up'} className='font-normal text-green-600 capitalize text-sm hover:text-green-500 underline'>Don't have an account yet? Sign-up now.</Link>
            </div>
          </div>
          {/* Google Oauth */}
          <div className="mt-6">
            <OAuth />
          </div>
        </div>
      </div>
    </AuthCard>
  )
}
