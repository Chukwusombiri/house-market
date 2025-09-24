import React, { useEffect, useRef, useState } from 'react'
import { db } from '../firebase.config'
import { getDocs, collection, query, where, limit, startAfter, orderBy, deleteDoc, doc } from 'firebase/firestore'
import useAuthContext from '../contexts/AuthContext'
import ListingItem from './ListingItem'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { BsTrash3Fill } from "react-icons/bs";
import { GoPencil } from "react-icons/go";

export default function ProfileListings() {
    const { authUser } = useAuthContext();
    const [listings, setListings] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [inView, setInView] = useState(false)
    const [lastDoc, setLastDoc] = useState(null); // keep track of Firestore cursor
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef();

    //side effect for everytime loader scroll into view
    useEffect(() => {
        if (!loaderRef.current) return;
        const loaderObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && hasMore) {
                    setInView(true);
                } else {
                    setInView(false)
                }
            })
        }, {
            threshold: 0.5
        });
        loaderObserver.observe(loaderRef.current)

        return () => {
            if (loaderRef.current) {
                loaderObserver.unobserve(loaderRef.current);
            }
        }
    }, [loaderRef])


    // side effect for fetching data everytime loader is in view
    useEffect(() => {
        if (!inView || fetching) return;
        fetchFromFireBase();
    }, [inView])


    // data fetch function
    const fetchFromFireBase = async () => {
        try {
            setFetching(true)
            const listingsRef = collection(db, 'listings');
            let qry = query(listingsRef, where('userId', '==', authUser.uid), orderBy('timestamp', 'desc'), limit(5));
            if (lastDoc) {
                qry = query(listingsRef, where('userId', '==', authUser.uid), orderBy('timestamp', 'desc'), startAfter(lastDoc), limit(5));
            }

            const snapShot = await getDocs(qry);

            if (snapShot.empty) {
                setHasMore(false);
                return;
            }

            const result = [];
            snapShot.forEach(docSnap => {
                result.push({ id: docSnap.id, ...(docSnap.data()) });
            })
            setListings(prev => [...prev, ...result])
            setLastDoc(snapShot.docs[snapShot.docs.length - 1]);
            setInView(false)
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong!')
        } finally {
            setFetching(false)
        }
    }

    // handle delete
    const handleDelete = async (id) => {        
        if(!window.confirm("Are you sure you wish to delete this listing?")) return;
        await deleteDoc(doc(db, 'listings', id));
        setListings(prev => prev.filter(item => item.id != id));
        toast.success("Listing deleted");
    }

    return (
        <div className='flex flex-col gap-y-4'>
            {
                listings.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {
                        listings.map(item => <ListingItem key={item.id} listing={item}>
                            <div className="relative z-10 flex justify-end flex-nowrap gap-4">
                                <button onClick={(evt) => {                                    
                                    handleDelete(item.id)
                                }} type='button' className="cursor-pointer outline-none"><BsTrash3Fill size={24} className='text-red-600' /></button>
                                <Link to={`/edit-listing/${item.id}`} className="cursor-pointer outline-none"><GoPencil size={24} className='text-blue-600' /></Link>
                            </div>
                        </ListingItem>)
                    }
                </div>
            }
            <div ref={loaderRef} className='text-gray-500 text-center text-sm'>{
                fetching
                    ? 'Loading more...'
                    : (
                        !hasMore
                            ? (listings.length > 0
                                ? 'You reached the end'
                                : ('No listings to show'))
                            : 'Ready to load more'
                    )
            }</div>
        </div>
    )
}
