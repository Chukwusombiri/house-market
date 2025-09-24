import React, { useState } from 'react'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa6'

function InputGroupPassword({ ...props }) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className='flex flex-nowrap gap-2 items-center rounded-lg border ring ring-transparent overflow-hidden focus:ring-2 focus:ring-green-500 px-2'>
            <FaLock className="size-5 flex items-center justify-center flex-none text-gray-600" />
            <input
                {...props}
                type={showPassword ? 'text' : 'password'}
                className="py-2 flex-grow placeholder:text-gray-600 text-md outline-none ring-0 focus:outline-none focus:ring-0 text-gray-800" />
            <button type='button' 
            onClick={() => setShowPassword(!showPassword)}
            className='size-6 flex items-center justify-center flex-none text-gray-600'>
                {
                    showPassword
                        ? <FaEyeSlash className="size-5" />
                        : <FaEye className="size-5" />
                }
            </button>
        </div>
    )
}

export default InputGroupPassword
