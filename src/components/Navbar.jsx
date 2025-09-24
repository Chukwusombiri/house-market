import React from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import { MdOutlineExplore, MdOutlineLocalOffer } from "react-icons/md";
import { RxPerson } from "react-icons/rx";

const navItems = [
    {
        path: '/',
        label: 'Explore',
        icon: <MdOutlineExplore size={24}/>
    },
    {
        path: '/offers',
        label: 'Offers',
        icon: <MdOutlineLocalOffer size={24}/>
    },
    {
        path: '/profile',
        label: 'Profile',
        icon: <RxPerson size={24}/>
    },
]

export default function Navbar() {
    const { path } = useLocation();
    return (
        <nav className='fixed bottom-0 w-full h-16 bg-white z-[9999]'>
            <div className="h-full w-full px-4 py-2 flex items-center shadow">
                {
                    navItems.map((item) => <div key={item.label} className='w-1/3 flex justify-center'>
                        <NavLink                        
                        to={item.path}
                        className={({ isActive }) => `flex flex-col gap-1 items-center justify-center ${isActive ? 'text-green-500' : 'text-slate-800'}`}
                    >
                        {item.icon}
                        <span className='text-sm font-semibold'>{item.label}</span>
                    </NavLink>
                    </div>)
                }
            </div>
        </nav>
    )
}
