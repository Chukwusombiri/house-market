import React from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function Loader() {
    return (
        <div className="h-screen flex items-center justify-center">
            <AiOutlineLoading3Quarters size={34} className="animate-spin" />
        </div>
    )
}
