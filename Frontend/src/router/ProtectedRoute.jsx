import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = () => {
  const { user, isloading } = useSelector((state) => state.auth)
  if(isloading)return <div className='h-screen w-full flex justify-center items-center bg-black text-white'><h1>Loading..</h1></div>
  
  if (!user?.isVerified) {
   return <Navigate to="/" />
  }
  
  return <Outlet/>
}

export default ProtectedRoute
