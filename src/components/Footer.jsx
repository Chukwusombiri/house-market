import React from 'react'

function Footer() {
    const currentYear = new Date().getFullYear();    
    return (
        <footer className='w-full mt-auto pt-10 px-4 pb-6'>
            <div className="flex justify-center items-center capitalized text-sm text-gray-600">&copy; All rights reserved | House Marketplace {currentYear}</div>
        </footer>
    )
}

export default Footer
