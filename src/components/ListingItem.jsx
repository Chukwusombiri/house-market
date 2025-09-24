import React from 'react'
import { FaBed } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { MdBathtub } from "react-icons/md";
import useAuthContext from '../contexts/AuthContext';


export default function ListingItem({ listing, children }) {

    return (
        <div className='flex flex-col gap-2 bg-white p-3 rounded-xl shadow'>
            <Link to={`/categories/${listing.type}/${listing.id}`} className='flex gap-3 flex-wrap lg:flex-nowrap overflow-hidden group items-center transition-scale duration-300 ease-in-out'>
                <div className='flex w-full h-48 md:w-32 md:h-auto items-center'>
                    <div className='w-full h-full md:h-32 inline-flex overflow-hidden rounded-lg'>
                        <img src={listing.imageUrls[0]} alt={listing.name} className='w-full h-full group-hover:scale-125 object-cover transition-scale duration-300 ease-in-out' />
                    </div>
                </div>
                <div className="flex-grow flex flex-col gap-1">
                    <h4 className="text-xl font-bold group-hover:underline">{listing.name}</h4>
                    <p className="roboto-extralight text-md">{listing.location}</p>
                    <p className="text-lg expletus-sans text-green-700">${listing.offer ? listing.discountedPrice : listing.regularPrice}</p>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-gray-600">
                            <FaBed className='size-6' />
                            <span className='text-sm font-semibold'>{`${listing.bedrooms} bedroom${!isNaN(parseInt(listing.bedrooms)) && ((parseInt(listing.bedrooms) > 1) ? "s" : "")}`}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-gray-600">
                            <MdBathtub className='size-6' />
                            <span className='text-sm font-semibold'>{`${listing.bathrooms} bathroom${!isNaN(parseInt(listing.bathrooms)) && ((parseInt(listing.bathrooms) > 1) ? "s" : "")}`}</span>
                        </span>
                    </div>
                </div>
            </Link>
            {
                children
            }
        </div>
    )
}
