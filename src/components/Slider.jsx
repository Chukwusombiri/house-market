import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, limit, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom';
import { ImSpinner3 } from 'react-icons/im';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';


function Slider({ }) {
  const navigate = useNavigate();
  const [currentListing, setCurrentListing] = useState(0);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const nextSlide = () => setCurrentListing(prev => (prev + 1) % listings.length)
  const prevSlide = () => setCurrentListing(prev => ((prev - 1) + listings.length) % listings.length)


  async function fetchLatestListings() {
    try {
      const collectionRef = collection(db, 'listings');
      const q = query(collectionRef, orderBy('timestamp', 'desc'), limit(5))
      const listingsSnap = await getDocs(q);
      if (!listingsSnap) {
        setLoading(false);
        return;
      }
      // set state
      const results = []
      listingsSnap.forEach(item => {
        const { name, type, offer, regularPrice, discountedPrice, imageUrls: [imageUrl] } = item.data();
        results.push({ id: item.id, name, type, offer, regularPrice, discountedPrice, imageUrl });
      })
      setListings([...results]);
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  //fetch listings
  useEffect(() => {
    fetchLatestListings()
  }, [])

  // checking loading state
  if (loading) {
    return <div className='w-full h-56 md:h-72 lg:h-96 flex items-center justify-center'>
      <ImSpinner3 size={20} className='text-blue-600 animate-spin' />
    </div>
  }

  return listings.length > 0
    ? (
      <div className="mt-8">
        <h2 className="mb-6 text-xl roboto-semibold">Recommended</h2>
        <div className='w-full h-56 md:h-72 overflow-hidden rounded-xl relative flex shadow-lg'>
          {
            listings.map((item, idx) => {
              if (idx != currentListing) return null;

              return <div
                key={idx}
                onClick={() => navigate(`/categories/${item.type}/${item.id}`)}
                className='relative w-full h-full group flex cursor-pointer'>
                <img src={item.imageUrl} alt={`Listing ${idx + 1} photo`} className="absolute inset-0 w-full h-full object-cover" />
                <div className="w-full h-full bg-gray-900/40 z-10 p-8 flex items-end justify-start backdrop-blur-[1px]">
                  <div className='text-white capitalize group-hover:underline inline-flex flex-col gap-2'>
                    <p className='text-lg md:text-xl font-semibold text-white'>{item.name}</p>
                    <div>
                      <p className='bg-white rounded-full text-xs expletus-sans text-gray-800 p-2 inline-flex items-center justify-center'>${item.offer ? item.discountedPrice : item.regularPrice} {item.type == 'rent' && '/ Month'}</p>
                    </div>
                  </div>
                </div>
              </div>
            })
          }
          <button
            onClick={prevSlide}
            type="button"
            className="absolute top-1/2 transform -translate-y-1/2 left-2 z-10 w-8 h-8 cursor-pointer rounded-full bg-gray-900/50 hover:bg-gray-900/80 flex items-center justify-center text-white">
            <FaAngleLeft />
          </button>
          <button
            onClick={nextSlide}
            type="button"
            className="absolute top-1/2 transform -translate-y-1/2 right-2 z-10 w-8 h-8 cursor-pointer rounded-full bg-gray-900/50 hover:bg-gray-900/80 flex items-center justify-center text-white">
            <FaAngleRight />
          </button>
          {/* Dots indicator */}
          <div className="absolute bottom-2 z-10 w-full flex justify-center mt-2 gap-2">
            {listings.map((_, index) => (
              <span
                key={index}
                onClick={() => setCurrentListing(index)}
                className={`w-3 h-3 rounded-full cursor-pointer ${index === currentListing ? "bg-blue-500 ring-2 ring-offset-1 ring-gray-300" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    ) : null
}

export default Slider
