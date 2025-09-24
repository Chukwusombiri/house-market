import React from 'react'

export default function Textarea({...props}) {
    return (
        <textarea
            {...props}
            className='bg-white border-gray-300 focus:border-gray-500 rounde-xl text-sm placeholder:text-sm place:text-gray-500 p-2'            
        ></textarea>
    )
}
