import React, { useRef, useState } from 'react'
import { db } from '../firebase.config';
import { collection, getDocs, doc, where, limit, startAfter, query, orderBy } from 'firebase/firestore';
import { toast } from 'react-toastify';
import PageHeader from '../components/PageHeader';
import ListingItem from '../components/ListingItem';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true)
  const [isInView, setIsInView] = useState(false);
  const loaderRef = useRef();

  // data fetch hook
  const fetchOffers = React.useCallback(async () => {    
    try {
      setLoading(true); 

      //prepare collection ref
      const offersRef = collection(db, 'listings');

      //prepare query
      let offersQuery = query(offersRef, where('offer', '==', true), orderBy('timestamp', 'desc'), limit(10));
      if (lastDoc) {
        offersQuery = query(offersRef, where('offer', '==', true), orderBy('timestamp', 'desc'), startAfter(lastDoc), limit(1));
      }

      //fetch offers
      const offersSnap = await getDocs(offersQuery);
      if (offersSnap.empty) {
        setHasMore(false);
      } else {
        // filter document data and ids in an object and push into an array
        const respOffers = [];
        offersSnap.forEach(element => {
          respOffers.push({ id: element.id, ...(element.data()) })
        });
        //set offers in sate
        setOffers(prev => [...prev, ...respOffers]);
        setLastDoc(offersSnap.docs[offersSnap.docs.length - 1]);

        if (offersSnap.docs.length < 1) {
          setHasMore(false)
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to fetch offers.")
    } finally {
      setLoading(false)
    }
  }, [lastDoc])

  // observer side effect
  React.useEffect(() => {
    if (!loaderRef.current) return;

    const loaderObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true)
        } else {
          setIsInView(false)
        }
      })
    }, {
      threshold: 0.5
    });

    loaderObserver.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) loaderObserver.unobserve(loaderRef.current);
    }
  }, [loaderRef])

  // data fetch side effect
  React.useEffect(() => {
    if (!isInView || loading || !hasMore) return;
    fetchOffers()
  }, [fetchOffers, isInView, loading, hasMore])



  return (
    <div className='pt-8'>
      <PageHeader title={'Available Offers'} />
      <div className="mt-8 flex flex-col gap-3">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          {
            offers.map((item) => <ListingItem key={item.id} listing={item} />)
          }
        </div>
        <p ref={loaderRef} className="text-sm text-gray-500 tracking-wide roboto-extralight text-center">
          {
            loading
              ? "Fetching more offers..."
              : (
                hasMore
                  ? "Ready to fetch"
                  : (
                    offers.length > 0
                      ? "You've reached the end"
                      : 'No offers available'
                  )
              )
          }
        </p>
      </div>
    </div>
  )
}
