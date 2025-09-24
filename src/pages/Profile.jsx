import React, { useEffect, useState } from 'react'
import useAuthContext from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import { TbHomeDollar } from "react-icons/tb";
import { GoPencil } from "react-icons/go";
import SecondaryButton from '../components/SecondaryButton';
import { toast } from 'react-toastify';
import { isEmptyInput } from '../utilities/validation';
import { FaTimes } from 'react-icons/fa';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import PageHeader from '../components/PageHeader';
import ProfileListings from '../components/ProfileListings';

export default function Profile() {
  const { authUser, updateUserProfile } = useAuthContext();
  const navigate = useNavigate();
  const [isEditting, setIsEditting] = useState(false);
  const [formData, setFormData] = useState({
    displayName: authUser?.displayName || '',
    email: authUser?.email || ''
  })

  /* handle state change */
  const handleChange = (e) => {
    const newValue = e.target.value;
    const field = e.target.name;

    setFormData({ ...formData, [field]: newValue });
  }

  /* init formstate */
  const initFormState = () => setFormData({ displayName: authUser.displayName, email: authUser.email })

  /* save to firestore */
  const handleSave = async () => {
    //check empty inputs
    if (isEmptyInput(formData.displayName) || isEmptyInput(formData.email)) {
      toast.error("Empty fields are not allowed!");
      initFormState();
      return;
    }

    /* save to firestore */
    let valuesToUpdate = {};
    for (const key in formData) {
      if (!Object.hasOwn(formData, key)) continue;
      if (key === 'displayName' && authUser.displayName == formData[key]) continue;
      if (key === 'email' && authUser.email == formData[key]) continue;

      valuesToUpdate[key] = formData[key];
    }

    if (Object.keys(valuesToUpdate).length == 0) return;

    try {
      //update auth profile
      const resp = await updateUserProfile(valuesToUpdate);

      if (resp == 'failed') {
        throw new Error("Update object was empty or not an object literal")
      }

      const userRef = doc(db, 'users', authUser.uid);

      //update user document
      await updateDoc(userRef, {
        name: formData.displayName,
        email: formData.email
      })

      toast.success('saved')
      setIsEditting(false);
    } catch (error) {
      console.error(error);
      toast.error("Unable to complete your request");
    }
  }

  /* initiate auth user */
  useEffect(() => {
    if (!authUser) {
      navigate('/sign-in')
    }
  }, [])

  return authUser ? (
    <div className='pt-8'>
      <PageHeader title={'My Profile'} />
      <div className="max-w-3xl mx-auto">
        {/* personal details */}
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h4 className='text-gray-700 text-xl font-bold'>Personal Details</h4>
            {
              isEditting
                ? <button
                  onClick={() => {
                    initFormState();
                    setIsEditting(false);
                  }}
                  className='inline-flex items-center gap-1 flex-nowrap outline-none border-0 text-sm font-semibold text-red-600 hover:text-red-500 hover:underline cursor-pointer'>
                  <FaTimes />
                  <span>cancel</span>
                </button>
                : <button
                  type='button'
                  onClick={() => setIsEditting(true)}
                  className="inline-flex items-center gap-1 flex-nowrap outline-none border-0 text-sm font-semibold text-green-600 hover:text-green-500 hover:underline cursor-pointer">
                  <GoPencil />
                  <span>Edit Info</span>
                </button>
            }
          </div>
          <div className="mt-4 rounded-lg p-4 bg-white space-y-4">
            <div className='flex gap-4 items-center'>
              <p className='text-gray-700 text-sm uppercase font-semibold tracking-wide flex-none'>Username</p>
              <input
                type="text"
                name="displayName"
                id="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className={`p-2 text-sm flex-grow border-b ${isEditting ? ' border-gray-300 focus:border-gray-500' : 'border-white'} ring-0 outline-0`}
                readOnly={!isEditting}
              />
            </div>
            <div className='flex gap-4 items-center'>
              <p className='text-gray-700 text-sm uppercase font-semibold tracking-wide flex-none'>Email Address</p>
              <input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`p-2 text-sm flex-grow border-b ${isEditting ? ' border-gray-300 focus:border-gray-500' : 'border-white'} ring-0 outline-0`}
                readOnly={!isEditting}
              />
            </div>
            {
              isEditting && (
                <div className="text-center">
                  <SecondaryButton
                    type="button"
                    onClick={handleSave}
                  >Save changes</SecondaryButton>
                </div>
              )
            }
          </div>
        </div>
        {/* User listings */}
        <div className="mt-6">
          <div className="flex justify-between flex-wrap gap-y-4 items-center">
            <h4 className='text-gray-700 text-xl font-bold'>My Listings</h4>
            <Link to={'/create-listing'}
              className='text-green-700 text-sm capitalize hover:underline hover:text-green-600 roboto-semibold inline-flex items-center gap-2'
            >
              <TbHomeDollar className='size-5'/>
              <span>Sell or rent out your home</span>
            </Link>
          </div>  
          <div className="mt-6">
            <ProfileListings />
          </div>        
        </div>
      </div>
    </div>
  ) : null
}
