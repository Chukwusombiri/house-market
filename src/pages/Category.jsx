import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, startAfter, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify'
import { db } from '../firebase.config';
import PageHeader from '../components/PageHeader';
import ListingItem from '../components/ListingItem';

export default function Category() {
    const { category } = useParams();
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastFetched, setLastFetched] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isInView, setIsInView] = useState(false);
    const loaderRef = useRef();

    // observe loader
    useEffect(() => {
        if (!loaderRef.current) return;

        const loaderObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }else{
                    setIsInView(false);
                }
            });
        }, { threshold: 0.5 });

        loaderObserver.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) loaderObserver.unobserve(loaderRef.current);
        };
    }, [loaderRef])

    // fetch data function
    const fetchListing = useCallback(async () => {
        if (!hasMore) return;

        setIsLoading(true);
        try {
            const listingsRef = collection(db, 'listings');
            let listingsQuery = query(
                listingsRef,
                where('type', '==', category.toLowerCase()),
                orderBy('timestamp', 'desc'),
                limit(10)
            );

            if (lastFetched) {
                listingsQuery = query(
                    listingsRef,
                    where('type', '==', category.toLowerCase()),
                    orderBy('timestamp', 'desc'),
                    startAfter(lastFetched),
                    limit(10)
                );
            }

            const listingsSnap = await getDocs(listingsQuery);

            if (listingsSnap.empty) {
                setHasMore(false);
                return;
            }

            const dbListings = listingsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setListings(prev => [...prev, ...dbListings]);
            setLastFetched(listingsSnap.docs[listingsSnap.docs.length - 1]);

            if (listingsSnap.docs.length < 10) {
                setHasMore(false); // reached the end
            }

        } catch (error) {
            console.error(error);
            toast.error("Oops! Could not complete request");
        } finally {
            setIsLoading(false);
        }
    }, [category, lastFetched, hasMore]);

    // fetch data
    useEffect(() => {
        if (!isInView || isLoading) return;

        fetchListing();              

    }, [fetchListing, isInView]);

    

    return (
        <div className='pt-8'>
            <PageHeader title={`Places for ${category}`} />
            <div className='text-gray-700 mt-8 flex flex-col gap-3'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                    {
                        listings.map((item) => <ListingItem key={item.id} listing={item} />)
                    }
                </div>
                <div ref={loaderRef} className="text-center text-gray-500 text-sm roboto-extralight">
                    {
                        isLoading
                            ? 'Fetching more ...'
                            : (
                                hasMore
                                    ? 'Ready to fetch more'
                                    : (
                                        listings.length > 0
                                            ? 'You\'ve reached the end'
                                            : 'No listings are available for ' + category
                                    )
                            )
                    }
                </div>
            </div>
        </div>
    )
}
