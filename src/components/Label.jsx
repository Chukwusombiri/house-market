import React from 'react'

export default function Label({ children, ...props}) {
  return (
    <label {...props} className='text-sm text-gray-600 robot-semibold capitalize'>
      {children}
    </label>
  )
}
