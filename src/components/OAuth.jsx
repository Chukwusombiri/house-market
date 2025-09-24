import React from 'react'
import { FcGoogle } from "react-icons/fc";
import useAuthContext from '../contexts/AuthContext';
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function OAuth() {
    const { auth, signInWithPopup, GoogleAuthProvider } = useAuthContext()
    const navigate = useNavigate();
    const { pathname } = useLocation()

    const handleOAuth = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            const result = await signInWithPopup(auth, provider);

            // The signed-in user info.
            const user = result.user;

            // check for user
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            // create user record if it doesnt exist
            if (!userSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    userId: user.uid,
                    timestamp: serverTimestamp()
                })
            }

            navigate('/');
            // This gives you a Google Access Token.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
        } catch (error) {
            console.error(error);
            toast.error("Oops! Unable to proceed with google authentication");
        }
    }
    return (
        <>
            <div className="flex items-center justify-center gap-1 flex-nowrap">
                <span className='h-[2px] w-10 flex-grow bg-gray-400'></span>
                <span className='flex-none text-sm font-medium '>You can also {pathname === '/sign-in' ? 'sign-in' : 'sign-up'} using google</span>
                <span className='h-[2px] w-10 flex-grow bg-gray-400'></span>
            </div>
            <div className='flex justify-center mt-4'>
                <button type='button' onClick={handleOAuth}
                    className='p-2 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-100'>
                    <FcGoogle className='size-8' />
                </button>
            </div>
        </>
    )
}
