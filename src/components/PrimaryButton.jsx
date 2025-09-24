import React from 'react'

export default function PrimaryButton({children, ...props}) {
  return (
    <button {...props} className='inline-flex items-center justify-center gap-4 rounded-xl px-4 py-3 text-xs text-gray-100 uppercase tracking-wider cursor-pointer font-semibold bg-green-600 hover:bg-green-700 focus:ring-2 ring-offset-1 ring-green-500'>{children}</button>
  )
}
