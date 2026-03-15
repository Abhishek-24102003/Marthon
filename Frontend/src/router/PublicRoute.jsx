import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'

const PublicRoute = () => {
  const { user } = useSelector((state) => state.auth)
  
 if(user?.isVerified)return <Navigate to="/homelayout" />
  return <Outlet/>
}

export default PublicRoute
