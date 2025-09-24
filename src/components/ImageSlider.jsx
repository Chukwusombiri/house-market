import React, { useEffect, useState } from 'react'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { ImSpinner3 } from "react-icons/im";

export default function ImageSlider({ images }) {
    const [currentImg, setCurrentImg] = useState(0);
    const [validImages, setValidImages] = useState([]);
    const nextSlide = () => setCurrentImg(prev => (prev + 1) % validImages.length)
    const prevSlide = () => setCurrentImg(prev => ((prev - 1) + validImages.length) % validImages.length)


    async function fetchListingImages() {
        const imagesPromise = images.map(async (element) => {
            return fetch(element).then(resp => resp.blob())
        });

        let imgs = []
        try {
            const responses = await Promise.all(imagesPromise)
            imgs = responses.map(resp => {
                const imageObjectURL = URL.createObjectURL(resp)
                return imageObjectURL
            })
            setValidImages([...imgs])
        } catch (error) {
            console.error('Error fetching image:', error)
        }
    }

    //check images existence
    useEffect(() => {
        fetchListingImages()

        return () => {
            let urls = [...validImages];
            if(urls.length > 0){
                for(let x = 0; x < urls.length; x++){
                    URL.revokeObjectURL(urls[x])
                }
            }
        }
    }, [])

    if (validImages.length === 0) {
        return <div className='w-full h-56 md:h-72 lg:h-96 flex items-center justify-center'>
            <ImSpinner3 size={20} className='text-blue-600 animate-spin' />
        </div>
    }
    return (
        <div className='w-full bg-purple-500 h-56 md:h-72 lg:h-96 overflow-hidden rounded-xl relative flex shadow-lg'>
            {
                validImages.map((img, idx) => {
                    if (idx != currentImg) return null;

                    return <img
                        key={idx}
                        src={img}
                        alt={`Listing photo ${idx + 1}`}
                        className={`w-full h-full object-cover`} />
                })
            }
            <button
                onClick={prevSlide}
                type="button"
                className="absolute top-1/2 transform -translate-y-1/2 left-2 z-10 w-8 h-8 cursor-pointer rounded-full bg-gray-900/50 hover:bg-gray-900/80 flex items-center justify-center text-white">
                <FaAngleLeft />
            </button>
            <button
                onClick={nextSlide}
                type="button"
                className="absolute top-1/2 transform -translate-y-1/2 right-2 z-10 w-8 h-8 cursor-pointer rounded-full bg-gray-900/50 hover:bg-gray-900/80 flex items-center justify-center text-white">
                <FaAngleRight />
            </button>
            {/* Dots indicator */}
            <div className="absolute bottom-2 z-10 w-full flex justify-center mt-2 gap-2">
                {validImages.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentImg(index)}
                        className={`w-3 h-3 rounded-full cursor-pointer ${index === currentImg ? "bg-blue-500 ring-2 ring-offset-1 ring-gray-300" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
