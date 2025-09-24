import React from 'react'

export default function InputGroup({ icon, ...props }) {
  return (
    <div className='flex flex-nowrap gap-2 items-center rounded-lg border ring ring-transparent overflow-hidden focus:ring-2 focus:ring-green-500 px-2'>
        <span className="size-6 flex items-center justify-center flex-none text-gray-600">{icon}</span>
        <input 
        {...props}
        className="py-2 flex-grow placeholder:text-gray-600 text-md outline-none ring-0 focus:outline-none focus:ring-0 text-gray-800" />
    </div>
  )
}
