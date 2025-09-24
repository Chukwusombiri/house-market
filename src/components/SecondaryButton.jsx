import React from 'react'

export default function SecondaryButton({ children, ...props}) {
  return (
    <button {...props} className='inline-flex items-center justify-center gap-4 rounded-xl cursor-pointer px-4 py-3 text-xs text-gray-100 uppercase font-semibold tracking-wider bg-slate-900 hover:bg-slate-800 focus:ring-2 ring-offset-1 ring-gray-700'>{children}</button>
  )
}
