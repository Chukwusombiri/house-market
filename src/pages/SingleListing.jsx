import React, { useCallback, useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase.config'
import { getDoc, doc } from 'firebase/firestore'
import { FaShare, FaClipboardCheck, FaCheck } from 'react-icons/fa6'
import useAuthContext from '../contexts/AuthContext'
import Loader from '../components/Loader'
import PageHeader from '../components/PageHeader'
import ImageSlider from '../components/ImageSlider'
import { toast } from 'react-toastify'
import ListingMap from '../components/ListingMap'


export default function SingleListing({ }) {
  const { listingId } = useParams()
  const navigate = useNavigate();
  const { authUser } = useAuthContext()
  const [listing, setListing] = useState(null)
  const [fetching, setFetching] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  // async fetchlisting function
  const fetchListing = useCallback(async () => {
    const docRef = doc(db, 'listings', listingId);
    const docSnap = await getDoc(docRef);

    // return home if doc doesnt exist
    if (!docSnap.exists()) {
      navigate('/');
      return;
    }

    setListing({ id: listingId, ...(docSnap.data()) });
    setFetching(false);
  }, [])

  // side-effect fetch listing from firebase
  useEffect(() => {
    // return home if id is undefined
    if (!listingId) {
      navigate('/');
      return;
    }

    // make fetch call
    fetchListing();

  }, [fetchListing])

  // side-effect for share link copied
  useEffect(() => {
    if (!shareLinkCopied) return;
    const timeOutId = setTimeout(() => setShareLinkCopied(false), 3000);

    return () => clearTimeout(timeOutId);
  }, [shareLinkCopied])

  if (fetching) return <Loader />

  return (
    <div className='pt-8'>
      <PageHeader title={'View Listing'} />
      <div className="mt-8 text-gray-700 max-w-5xl mx-auto">
        {/* content div */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-gray-300 pb-8">
          {/* image slider */}
          <div className='md:order-2 lg:col-span-3'>
            <ImageSlider images={listing.imageUrls} />
          </div>
          {/* listing content */}
          <div className="md:order-1 lg:col-span-2">
            <h2 className="text-2xl roboto-semibold mb-2">{listing.name}</h2>
            <p className='text-lg font-semibold'>Price: <span className='expletus-sans'>${listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
            <div className="flex items-center mt-2 gap-3">
              <span className="bg-gray-800 text-white rounded-full text-xs uppercase tracking-wide px-4 py-2 roboto-bold">For {listing.type == 'rent' ? 'rent' : 'sale'}</span>
              {
                listing.offer && <span className="bg-green-600 text-white rounded-full text-xs uppercase tracking-wide px-4 py-2 roboto-bold">${(listing.regularPrice - listing.discountedPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} discount</span>
              }
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <p className='roboto-extralight text-sm'><span className="roboto-semibold uppercase">Listed on</span> September 12, 2025</p>
              <p className='text-sm flex items-center gap-3'>
                <span>Share</span>
                <button
                  type='button'
                  className='rounded-full w-8 h-8 shadow bg-white flex items-center justify-center'
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    setShareLinkCopied(true);
                    toast.success('Listing link copied!', {
                      autoClose: 1000
                    })
                  }}
                >
                  {
                    shareLinkCopied
                      ? <FaClipboardCheck className='text-green-600 size-5' />
                      : <FaShare />
                  }
                </button>
              </p>
            </div>
            {/* features */}
            <div className="mt-4">
              <h4 className="text-xl roboto-semibold text-gray-700 mb-2">Features</h4>
              <ul className="list-none space-y-2">
                <li className="flex items-center gap-2">
                  <FaCheck className='text-green-600' />
                  <span className="text-sm robot-semibold">{`${listing.bedrooms} bedroom${!isNaN(parseInt(listing.bedrooms)) && ((parseInt(listing.bedrooms) > 1) ? "s" : "")}`}</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className='text-green-600' />
                  <span className="text-sm robot-semibold">{`${listing.bathrooms} bathroom${!isNaN(parseInt(listing.bathrooms)) && ((parseInt(listing.bathrooms) > 1) ? "s" : "")}`}</span>
                </li>
                {
                  listing.furnished && (
                    <li className="flex items-center gap-2">
                      <FaCheck className='text-green-600' />
                      <span className="text-sm robot-semibold">Listing is furnished</span>
                    </li>
                  )
                }
                {
                  listing.parking && (
                    <li className="flex items-center gap-2">
                      <FaCheck className='text-green-600' />
                      <span className="text-sm robot-semibold">Packing space available</span>
                    </li>
                  )
                }
              </ul>
            </div>
            {/* contact landlord */}
            {
              listing.userId !== authUser?.uid && <div className="mt-4 flex flex-col">
                <Link to={`/contact-landlord/${listing.userId}?listing=${listing.name}`} className='w-full sm:max-w-72 inline-flex justify-center text-gray-50 bg-green-600 rounded-xl text-sm uppercase tracking-wide px-6 py-3 hover:bg-green-700 roboto-bold'>Contact Landlord</Link>
              </div>
            }
          </div>
        </div>
        {/* map */}
        <div className="mt-6">
          <h2 className="text-2xl roboto-semibold tracking-wide text-gray-800 mb-4">Location</h2>
          <ListingMap lat={listing.geolocation.lat} lng={listing.geolocation.lng} popup={listing.name} />
        </div>
      </div>
    </div>
  )
}
