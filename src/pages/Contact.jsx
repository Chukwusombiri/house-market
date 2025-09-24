import React from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { db } from '../firebase.config'
import { doc, getDoc } from 'firebase/firestore'
import { LiaSpinnerSolid } from "react-icons/lia";
import { toast } from 'react-toastify'
import Label from '../components/Label'
import { FaHome } from "react-icons/fa";
import PrimaryButton from '../components/PrimaryButton'

function Contact() {
    const navigate = useNavigate();
    const [message, setMessage] = React.useState('');
    const [fetching, setFetching] = React.useState(true);
    const [landlord, setLandLord] = React.useState(null);
    const { landLordId } = useParams();
    const [searchParams] = useSearchParams();
    const listingName = searchParams.get('listing')


    // create function for side effect
    const fetchlandLord = async () => {
        try {
            // prepare doc ref
            const landLordRef = doc(db, 'users', landLordId);
            const landLordSnap = await getDoc(landLordRef);

            if (!landLordSnap.exists()) {
                toast.info("Landlord records doesn't exist.")
                navigate('/');
            }

            setLandLord({ id: landLordId, ...(landLordSnap.data()) });
        } catch (error) {
            toast.error('Ooops! Something went wrong.')
            console.error(error);
        } finally {
            setFetching(false);
        }
    }


    //fetch landlord using side-effect
    React.useEffect(() => {
        if (!landLordId) {
            navigate('/');
            return;
        }

        fetchlandLord();

    }, [])

    // loading state
    if (fetching) return <div className='h-screen flex items-center justify-center'>
        <LiaSpinnerSolid size={24} className='animate-spin ' />
    </div>


    return (
        <div className='pt-8'>
            <PageHeader title={'Contact Landlord'} />
            <div className="mt-6 flex flex-col items-center h-screen">
                <div className="w-full max-w-2xl mx-auto rounded-xl bg-white p-6">
                    <h2 className='text-xl mb-4 flex items-center gap-3'><FaHome /> <span className='expletus-sans'>{listingName}</span></h2>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="message">Message</Label>
                        <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={message}
                        className='border border-gray-300 ring-0 focus:border-gray-500 rounded-xl p-3 text-sm placeholder:text-gray-600 text-gray-700'
                        onChange={(evt) => setMessage(evt.target.value)}
                        placeholder='Write your message here ...'
                        required
                        ></textarea>
                    </div>
                    <div className="flex flex-col mt-5">
                        <a target='_blank' href={`mailto:${landlord.email}?Subject=${listingName}&body=${message}`} className='w-full max-w-lg mx-auto flex flex-col'>
                            <PrimaryButton type="button">Send message</PrimaryButton>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
