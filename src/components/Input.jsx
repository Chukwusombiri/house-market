import React from 'react'

export default function Input({...props}) {
  return (
    <input {...props} className='rounded-lg p-2 border border-gray-300 focus:border-gray-500 ring-0 focus:ring-0 bg-white placeholder:text-gray-500 placeholder:text-sm' />
  )
}
