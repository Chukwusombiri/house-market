import React, { useEffect } from 'react'
import useAuthContext from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';

export default function AuthCard( { children } ) {
    const {authUser} = useAuthContext();
    const navigate = useNavigate()

    useEffect(() => {
        if(authUser){
            navigate('/');
        }
    }, [])

    return authUser ? null : (
        <>
            {children}
        </>
    )
}
