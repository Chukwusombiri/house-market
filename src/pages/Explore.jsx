import React from 'react'
import { Link } from 'react-router-dom'
import useAuthContext from '../contexts/AuthContext'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import PageHeader from '../components/PageHeader';
import Slider from '../components/Slider';

const categories = [
  {
    href: '/categories/rent',
    title: 'Places For Rent',
    subtitle: 'Explore our available rent listings.',
    imgUrl: rentCategoryImage 
  },
  {
    href: '/categories/sale',
    title: 'Places For Sale',
    subtitle: 'Explore our available sales listings.',
    imgUrl: sellCategoryImage
  },
];

function Explore() {
  const { authUser } = useAuthContext();  
  return (
    <div className='pt-8'>     
      <PageHeader title={'Explore'} />
      {/* Explore Slider */}
      <Slider />
      <div className="mt-8 max-w-6xl mx-auto">
        <h4 className='text-xl tracking-wide roboto-semibold'>Market Categories</h4>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {
            categories.map((cat, idx) => <Link to={cat.href} key={idx} className="group flex items-center jusitfy-center">
            <div className='relative w-full sm:w-48 h-48 md:w-56 md:w-full md:h-64 rounded-lg overflow-hidden flex'>
              <img src={cat.imgUrl} alt="Rent category image" className="absolute inset-0 w-full h-full rounded-lg" />
              <div className="w-full h-full bg-gray-900/40 z-10 p-8 flex items-end justify-start backdrop-blur-[1px]">
                <div className='text-white capitalize group-hover:underline inline-flex flex-col gap-2'>
                  <span className='text-lg md:text-xl font-semibold'>{cat.title}</span>
                  <span className='text-sm md:text-md'>{cat.subtitle}</span>
                </div>
              </div>
            </div>
          </Link>)
          }
        </div>
      </div>
    </div>
  )
}

export default Explore
