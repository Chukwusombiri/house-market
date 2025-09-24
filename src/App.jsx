import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { AuthContextProvider } from "./contexts/AuthContext"
import { ToastContainer } from "react-toastify"
import { useEffect } from "react"
import { MdAddHomeWork } from "react-icons/md";

function App() {
  const {pathname} = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, [pathname])
  return (
    <AuthContextProvider>
      <ToastContainer />
      <div className="min-h-screen pb-16 flex flex-col bg-gray-100 roboto-regular">
        {/* navigation */}
        <Navbar />
        <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex items-center justify-center gap-2 pt-4">
            <MdAddHomeWork size={26} color="gray"/>
            <span className="text-green-700 expletus-sans text-xl tracking-wider">HouseMarket</span>
          </div>
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthContextProvider>
  )
}

export default App
