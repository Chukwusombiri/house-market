import React, { useState } from 'react'
import InputGroup from '../components/InputGroup';
import { FaEnvelope, FaUser } from 'react-icons/fa6';
import InputGroupPassword from '../components/InputGroupPassword';
import { Link, useNavigate } from 'react-router-dom';
import SecondaryButton from '../components/SecondaryButton';
import { updateProfile } from "firebase/auth";
import { db } from "../firebase.config";
import { isInvalidEmailAddress, passwordDoNotMatch } from '../utilities/validation';
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import AuthCard from '../components/AuthCard';
import useAuthContext from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const navigate = useNavigate();
  const {signUp, auth} = useAuthContext()

  const isInvalidForm = (form) => {
    let instantErrors = {};
    if (form.email == "") {
      instantErrors.email = "Email cannot be empty."
    }
    if (form.name == "") {
      instantErrors.name = "Username cannot be empty.";
    }

    if (form.password == "") {
      instantErrors.password = "Password cannot be empty.";
    }
    if (form.repeatPassword == "") {
      instantErrors.repeatPassword = "Password Confirmation cannot be empty.";
    }

    if (!instantErrors.email && isInvalidEmailAddress(form.email)) {
      instantErrors.email = "Email provided is invalid.";
    }

    if (passwordDoNotMatch(form.password, form.repeatPassword)) {
      instantErrors.password = "Passwords do not match.";
    }

    setErrors({ ...instantErrors });

    return Object.keys(instantErrors).length > 0;
  }

  const handleChange = (e) => {
    const newValue = e.target.value;
    const field = e.target.name;

    setFormData({ ...formData, [field]: newValue });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* check empty field */
    if (isInvalidForm(formData)) return;

    /* start user creation */
    try {
      setSubmitting(true)      
      const userCredential = await signUp(formData.email, formData.password); //create user record and return the record
      
      const user = userCredential.user;

      await updateProfile(auth.currentUser, {
        displayName: formData.name
      });

      setErrors({}); //clear client errors if any

      const formForDoc = { name: formData.name, email: formData.email, userId: user.uid, timestamp: serverTimestamp() };

      await setDoc(doc(db, 'users', user.uid), formForDoc);

      /* navigate to home page */
      navigate('/');
    } catch (error) {
      const errorMessage = error.message || "Oops! Unable to create user";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard>
      <div className='flex items-center justify-center py-10'>
        <div className="w-full max-w-lg mx-auto flex flex-col bg-white rounded-xl shadow-md p-6">
          <h1 className="text-center text-2xl font-semibold">Let's get you started</h1>          
          <div className="w-full mt-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6 flex flex-col gap-1">
                <InputGroup
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your Username"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<FaUser />}
                />
                {
                  errors.name && <p className="text-sm text-red-500 font-normal">{errors.name}</p>
                }
              </div>
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
                  errors.email && <p className="text-sm text-red-500 font-normal">{errors.email}</p>
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
                  errors.password && <p className="text-sm text-red-500 font-normal">{errors.password}</p>
                }
              </div>
              <div className="mb-6 flex flex-col gap-1">
                <InputGroupPassword
                  id="repeatPassword"
                  name="repeatPassword"
                  placeholder="Re-Enter your password"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                />
                {
                  errors.repeatPassword && <p className="text-sm text-red-500 font-normal">{errors.repeatPassword}</p>
                }
              </div>
              <div className="mt-4 flex flex-col">
                <SecondaryButton type="submit">
                  {
                    submitting ? <span className="animate-pulse">Submitting...</span> : 'Sign-up'
                  }
                </SecondaryButton>
              </div>
            </form>
            <div className="mt-4 text-center">
              <Link to={'/sign-in'} className='font-normal text-green-600 capitalize text-sm hover:text-green-500 underline'>Already have an account? Sign-in instead.</Link>
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
