import React, { useEffect, useState } from 'react'
import useAuthContext from '../contexts/AuthContext'
import PageHeader from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import Label from '../components/Label';
import Input from '../components/Input';
import { allowImageSize, allowImageTypes } from '../utilities/appconstants';
import { MdClose } from 'react-icons/md';
import { db } from '../firebase.config'
import { doc, setDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import SecondaryButton from '../components/SecondaryButton';
import axios from 'axios'
import { toast } from 'react-toastify';
import { isEmptyInput, isInvalidBoolean, isInvalidNumber } from '../utilities/validation'
import Loader from '../components/Loader';

const cloudBaseUrl = import.meta.env.VITE_CLOUDINARY_BASE_URL;
const cloudId = import.meta.env.VITE_CLOUDINARY_ID;
const cloudUploadpreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const mapboxSearchUrl = import.meta.env.VITE_MAPBOX_SEARCH_URL;
const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const initFormState = {
    name: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    offer: false,
    parking: false,
    furnished: false,
    location: '',
    regularPrice: 0,
    discountedPrice: 0,
    lat: 0,
    lng: 0,
    imageUrls: [],
}
export default function CreateListing() {
    const { authUser } = useAuthContext();
    const navigate = useNavigate();
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
    const [formData, setFormData] = useState(initFormState);
    const { name,
        type,
        bedrooms,
        bathrooms,
        offer,
        parking,
        furnished,
        location,
        regularPrice,
        discountedPrice,
        lat,
        lng,
        } = formData
    const [images, setImages] = useState([])
    const [address, setAddress] = useState('');
    const [addressSuggestions, setAddressSuggestions] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const imagesToDisplay = images.map(img => {
        const tempImg = URL.createObjectURL(img);
        return tempImg;
    })

    // onchange function
    const handleChange = (evt) => {
        const field = evt.target.name;
        const newValue = evt.target.value;

        setFormData({ ...formData, [field]: newValue });
    }

    // search address
    const searchAddress = async () => {
        if (address.length < 6) return;

        const params = new URLSearchParams({
            q: address,
            access_token: mapboxAccessToken,
            limit: 6,
            type: 'address'
        })

        const url = `${mapboxSearchUrl}?${params}`
        try {
            const response = await axios.get(url);
            const results = (response.data.features).map(feature => {
                const { id, properties: { name, name_preferred, place_formatted, full_address, coordinates: { longitude, latitude } } } = feature
                return {
                    id,
                    address: full_address ?? `${name_preferred || name}, ${place_formatted}`,
                    lng: longitude,
                    lat: latitude
                }
            })
            setAddressSuggestions([...results]);
        } catch (error) {
            console.error(error);
            setAddressSuggestions(null);
        }
    }

    // select address
    const handleSelectAddress = (obj) => {
        const { address, lat, lng } = obj
        if (!address || !lng || !lat) return;

        setFormData(prev => ({ ...prev, location: address, lat, lng }));
        setAddressSuggestions(null);
        setAddress(obj.address);
    }

    // upload images
    const uploadImages = async () => {
        //return if no images
        if (images.length == 0) return;

        const uploadPromises = images.map(image => {
            const data = new FormData();
            data.append('file', image);
            data.append('cloud_name', cloudId);
            data.append('upload_preset', cloudUploadpreset);
            data.append('folder', 'house-marketplace/listings')

            return axios.post(`${cloudBaseUrl}/${cloudId}/image/upload`, data)
        })

        try {
            const responses = await Promise.all(uploadPromises);
            const responseUrls = responses.map(resp => resp.data.secure_url);
            
            //check for empty data
            if (responseUrls.length == 0) return;

            //update state
            setFormData(prev => ({ ...prev, imageUrls: [...responseUrls] }))

            return responseUrls;
        } catch (err) {
            console.error("Failure with image uploads: ", err)
            throw new Error("Unable to upload images");
        }
    };

    // submit form
    const handleSubmit = async (evt) => {
        evt.preventDefault();

        //validate form
        const { isInvalid, message } = validateForm(formData, images)
        if (isInvalid) {
            toast.error(message);
            return
        }        

        // start submission
        setSubmitting(true)
        try {       
            //upload images and return imageUrls
            const imgUrls = await uploadImages();   

            // prepare document ref
            const { lat, lng, ...rest } = formData;            
            const listingObj = {
                ...rest,
                imageUrls: [...imgUrls],
                geolocation: { lat, lng },
                timestamp: serverTimestamp()
            };            

            const docRef = await addDoc(collection(db, 'listings'), listingObj);
            toast.success("Listing created successfully")
            setFormData(initFormState);
            setImages([]);
            setAddress('');
            navigate(`/categories/${listingObj.type}/${docRef.id}`)
        } catch (error) {
            toast.error('Unable to create listing');
            console.error("Unable to create listing", error);
        } finally {
            setSubmitting(false);
        }
    }

    // check auth status
    useEffect(() => {
        if (!authUser) {
            navigate('/sign-in')
        }
        setFormData(prev => ({ ...prev, userId: authUser.uid }))
    }, [authUser])

    if(submitting){
        return <Loader />
    }

    return authUser ? (
        <div className='pt-8'>
            <PageHeader title={'Create a Listing'} />
            <div className="mt-6 max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                    {/* type */}
                    <div>
                        <p className="text-md robot-semibold">Are you Selling or Renting?</p>
                        <div className="flex gap-4 mt-2">
                            <label htmlFor='rent' className={`inline-flex items-center justify-center rounded-lg px-4 py-1 ${type == 'rent' ? 'bg-green-600 text-white' : 'bg-white text-gray-800'} shadow`}>
                                <input className='hidden' type="radio" name="type" id="rent" value={'rent'} onChange={handleChange} />
                                <span>Rent</span>
                            </label>
                            <label htmlFor='sale' className={`inline-flex items-center justify-center rounded-lg px-4 py-1 ${type == 'sale' ? 'bg-green-600 text-white' : 'bg-white text-gray-800'} shadow`}>
                                <input className='hidden' type="radio" name="type" id="sale" value={'sale'} onChange={handleChange} />
                                <span>Sale</span>
                            </label>
                        </div>
                    </div>
                    {/* name */}
                    <div className="mt-4 flex flex-col gap-1">
                        <Label htmlFor="name">Listing Name</Label>
                        <div className="w-full max-w-lg flex flex-col">
                            <Input
                                name="name"
                                id="name"
                                value={name}
                                onChange={handleChange}
                                placeholder="Enter unique name for this listing ..."
                                required
                            />
                        </div>
                    </div>
                    {/* adress */}
                    <div className="mt-6">
                        {/* set geocoder */}
                        <div className="mb-2 flex items-center flex-nowrap gap-3">
                            <input
                                type="checkbox"
                                name="geoLocationEnabled"
                                id="geoLocationEnabled"
                                checked={geoLocationEnabled}
                                onChange={() => setGeoLocationEnabled(prev => !prev)}
                            />
                            <Label htmlFor="geoLocationEnabled">Enable Geo-location for automatic address / coordinates retrieval</Label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                            <div className="md:col-span-3 flex flex-col gap-1 relative">
                                <Label htmlFor={geoLocationEnabled ? "address" : "location"}>Listing Address</Label>
                                {
                                    geoLocationEnabled
                                        ? <>
                                            <Input
                                                name="address"
                                                id="address"
                                                value={address}
                                                onChange={(evt) => setAddress(evt.target.value)}
                                                onFocus={searchAddress}
                                                placeholder="Enter address for this listing ..."
                                                required
                                            />
                                            {
                                                addressSuggestions && (
                                                    <div className="absolute top-full h-56 w-full z-10 mt-2 flex">
                                                        <div className="w-full h-full bg-white shadow rounded-lg overflow-x-hidden overlow-y-auto">
                                                            {
                                                                addressSuggestions.map(addr => (
                                                                    <div
                                                                        key={addr.id}
                                                                        className="flex">
                                                                        <button
                                                                            type='button'
                                                                            onClick={() => handleSelectAddress(addr)}
                                                                            className="w-full inline-flex bg-transparent hover:bg-gray-100 p-2 border-b last:border-0 border-gray-200 text-sm break-words text-wrap outline-none active:outline-none"
                                                                        >{addr.address}
                                                                        </button>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </>
                                        : <textarea
                                            name="location"
                                            id="location"
                                            onChange={handleChange}
                                            value={location}
                                            placeholder="Enter address for this listing ..."
                                            rows={4}
                                            className='bg-white border-gray-300 focus:border-gray-500 rounde-xl text-sm placeholder:text-sm place:text-gray-500 p-2'
                                            required
                                        ></textarea>
                                }
                            </div>
                            {
                                !geoLocationEnabled && (
                                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <Label htmlFor="lat">Latitude</Label>
                                            <input
                                                type='number'
                                                name="lat"
                                                id="lat"
                                                value={lat}
                                                onChange={handleChange}
                                                required
                                                className='text-center p-2 bg-white w-20 rounded-lg border border-gray-300 ring-0 outline-none focus:border-gray-500 focus:ring-0'
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <Label htmlFor="lat">Longitude</Label>
                                            <input
                                                type='number'
                                                name="lng"
                                                id="lng"
                                                value={lng}
                                                onChange={handleChange}
                                                required
                                                className='text-center p-2 bg-white w-20 rounded-lg border border-gray-300 ring-0 outline-none focus:border-gray-500 focus:ring-0'
                                            />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    {/* bedrooms/bathrooms */}
                    <div className="mt-4">
                        <p className="w-full">Number of bedrooms and Bathrooms</p>
                        <div className="mt-2 flex flex-wrap gap-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="bedrooms" >Bedrooms</Label>
                                <input type="number" name="bedrooms" id="bedrooms" value={bedrooms} onChange={handleChange} className='p-2 bg-white w-20 rounded-lg border border-gray-300 ring-0 outline-none focus:border-gray-500 focus:ring-0' />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="bathrooms" >Bathrooms</Label>
                                <input type="number" name="bathrooms" id="bathrooms" value={bathrooms} onChange={handleChange} className='p-2 bg-white w-20 rounded-lg border border-gray-300 ring-0 outline-none focus:border-gray-500 focus:ring-0' />
                            </div>
                        </div>
                    </div>
                    {/* furnished */}
                    <div className="mt-4">
                        <p className="text-md robot-semibold">Is the Listing furnished?</p>
                        <div className="flex gap-4 mt-2">
                            <button type='button' onClick={() => setFormData({ ...formData, furnished: true })} className={`rounded-lg px-4 py-2 shadow text-xs uppercase tracking-wide roboto-semibold ${furnished ? 'bg-green-600 text-white' : 'bg-white text-gray-800'}`}>Yes</button>
                            <button type='button' onClick={() => setFormData({ ...formData, furnished: false })} className={`rounded-lg px-4 py-2 shadow text-xs uppercase tracking-wide roboto-semibold ${!furnished ? 'bg-green-600 text-white' : 'bg-white text-gray-800'}`}>No</button>
                        </div>
                    </div>
                    {/* parking */}
                    <div className="mt-4">
                        <p className="text-md robot-semibold">Does Listing have parking?</p>
                        <div className="flex gap-4 mt-2">
                            <button type='button' onClick={() => setFormData({ ...formData, parking: true })} className={`rounded-lg px-4 py-2 shadow text-xs uppercase tracking-wide roboto-semibold ${parking ? 'bg-green-600 text-white' : 'bg-white text-gray-800'}`}>Yes</button>
                            <button type='button' onClick={() => setFormData({ ...formData, parking: false })} className={`rounded-lg px-4 py-2 shadow text-xs uppercase tracking-wide roboto-semibold ${!parking ? 'bg-green-600 text-white' : 'bg-white text-gray-800'}`}>No</button>
                        </div>
                    </div>
                    {/* offer */}
                    <div className="mt-4">
                        <p className="text-md robot-semibold">Does Listing have offers?</p>
                        <div className="flex gap-4 mt-2">
                            <button type='button' onClick={() => setFormData({ ...formData, offer: true })} className={`rounded-lg px-4 py-2 shadow text-xs uppercase tracking-wide roboto-semibold ${offer ? 'bg-green-600 text-white' : 'bg-white text-gray-800'}`}>Yes</button>
                            <button type='button' onClick={() => setFormData({ ...formData, offer: false })} className={`rounded-lg px-4 py-2 shadow text-xs uppercase tracking-wide roboto-semibold ${!offer ? 'bg-green-600 text-white' : 'bg-white text-gray-800'}`}>No</button>
                        </div>
                    </div>
                    {/* prices */}
                    <div className="mt-4">
                        <p className="w-full">Listing Prices  - <span className="roboto-extralight">This is rated in dollar</span></p>
                        <div className="mt-2 flex flex-wrap gap-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="regularPrice" >Regular {type == 'rent' && '($/Month)'}</Label>
                                <input type="number" name="regularPrice" id="regularPrice" value={regularPrice} onChange={handleChange} className='p-2 bg-white w-32 rounded-lg  border border-gray-300 ring-0 outline-none focus:border-gray-500 focus:ring-0' />
                            </div>
                            {
                                offer && <div className="flex flex-col gap-2">
                                    <Label htmlFor="discountedPrice" >Discounted</Label>
                                    <input type="number" name="discountedPrice" id="discountedPrice" value={discountedPrice} onChange={handleChange} className='p-2 bg-white w-32 rounded-lg  border border-gray-300 ring-0 outline-none focus:border-gray-500 focus:ring-0' />
                                </div>
                            }
                        </div>
                    </div>
                    {/* photos */}
                    <div className="mt-4">
                        <p className="w-full">Listing Photos</p>
                        <p className='mt-2 mb-2 text-sm roboto-semibold text-gray-600'>Upload betwee 3 - 5 images for this listing - front-view, rear-view, and indoor</p>
                        <input onChange={(evt) => {
                            if ((evt.target.files).length == 0) return;

                            const imgfiles = evt.target.files;
                            const validImages = [];
                            for (let i = 0; i < imgfiles.length; i++) {
                                const curFile = imgfiles[i];
                                if (allowImageTypes.includes(curFile.type) && allowImageSize >= curFile.size) {
                                    validImages.push(curFile)
                                }
                            }
                            const newImages = validImages.length > 5 ? validImages.filter((_, id) => id < 5) : validImages
                            setImages(prev => ([...prev, ...newImages]));
                        }}
                            type="file"
                            name="images"
                            id="images"
                            multiple
                            max={5}
                            accept='.png, .jpg, .jpeg'
                            className='hidden' />
                        <label htmlFor="images" className='bg-green-600 hover:bg-green-500 text-white text-xs roboto-semibold capitalize px-4 py-2 rounded-lg'>upload images</label>
                        {
                            (imagesToDisplay.length > 0) && <div className="mt-4 flex flex-wrap gap-4">
                                {
                                    imagesToDisplay.map((tempUrl, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-1">
                                            <img src={tempUrl} alt="Temp File prreview" className="w-52 h-40 rounded-lg" />
                                            <button
                                                onClick={() => {
                                                    URL.revokeObjectURL(tempUrl);
                                                    setImages(prev => prev.filter((_, id) => id != idx))
                                                }}
                                                type='button'
                                                className='rounded-full bg-red-100 hover:bg-red-200 size-10 inline-flex items-center justify-center'><MdClose className='text-red-600 size-6' /></button>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
                    <div className="flex justify-center mt-6">
                        <div className="w-full md:w-3/6 lg:w-2/6 xl-w-max-content mx-auto flex flex-col">
                            <SecondaryButton type="submit">Create listing</SecondaryButton>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ) : null
}


// validate listing form uploading images
export function validateForm(form, images) {
    const { name,
        type,
        bedrooms,
        bathrooms,
        offer,
        parking,
        furnished,
        location,
        regularPrice,
        discountedPrice,
        lat,
        lng,
    } = form

    if (isEmptyInput(name, type, location) || isInvalidNumber(bedrooms, bathrooms, regularPrice, discountedPrice, lat, lng)) {
        return {
            isInvalid: true,
            message: "Please fill out all required fields."
        };
    }

    if (bedrooms == 0 || bathrooms == 0 || regularPrice == 0) {
        return {
            isInvalid: true,
            message: "Please fill out all required fields."
        };
    }

    if (discountedPrice > regularPrice) {
        return {
            isInvalid: true,
            message: "Regular listing price must be larger than Discounted listing price."
        };
    }

    if (isInvalidBoolean(offer, parking, furnished)) {
        return {
            isInvalid: true,
            message: "Please fill out all required fields."
        };
    }

    if (images.length > 5 || images.length == 0) {
        return {
            isInvalid: true,
            message: "between 1 - 5 number of photos is allowed"
        };
    }

    return {
        isInvalid: false,
        message: "Form is valid"
    };
}