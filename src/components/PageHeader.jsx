import React from 'react'
import AuthStateButton from './AuthStateButton'

export default function PageHeader({title}) {
    return (
        <div className="flex items-center flex-nowrap justify-between">
            <h2 className='text-2xl md:text-3xl font-bold capitalize'>{title}</h2>
            <AuthStateButton />
        </div>
    )
}
