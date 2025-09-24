import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import SingleListing from "./pages/SingleListing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Explore />
            },
            {
                path: 'categories/:category',
                element: <Category />
            },  
            {
                path: 'categories/:category/:listingId',
                element: <SingleListing />
            },            
            {
                path: 'offers',
                element: <Offers />
            },
            {
                path: 'create-listing',
                element: <CreateListing />
            },
            {
                path: 'edit-listing/:listingId',
                element: <EditListing />
            },
            {
                path: 'contact-landlord/:landLordId',
                element: <Contact />
            },
            {
                path: 'profile',
                element: <Profile />
            },
            {
                path: 'sign-in',
                element: <SignIn />
            },
            {
                path: 'sign-up',
                element: <SignUp />
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />
            },
        ]
    }
]);

export default router