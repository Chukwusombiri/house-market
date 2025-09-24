import { createContext, useContext, useEffect, useState } from "react";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import Loader from "../components/Loader";

const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
    const auth = getAuth();
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth])

    // Wrap Firebase functions
    const signUp = async (email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password);
    };

    const signOut = () => {
        return firebaseSignOut(auth);
    };

    const updateUserProfile = async (obj) => {
        if (!obj || obj.constructor !== Object) {
            return "failed";
        }
        await updateProfile(auth.currentUser, obj)
        return "successful";
    }

    // Expose values & functions
    const value = {
        auth,
        authUser,
        loading,
        signUp,
        signIn,
        signOut,
        updateUserProfile,
        sendPasswordResetEmail,
        signInWithPopup,
        GoogleAuthProvider
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : (
                <Loader />
            )}
        </AuthContext.Provider>
    )
}


const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;