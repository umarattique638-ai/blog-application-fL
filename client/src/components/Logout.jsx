import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { logoutUser, resetAuthState, resetUser } from '@/feature/authSlice'
import { useNavigate } from 'react-router-dom'
import { RouteSignIn } from '@/helper/RouteName'
import { resetUserState } from '@/feature/userSlice';

function Logout() {

  const navigate = useNavigate()
  const { user, success, error, message, loading, } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const handlelogout = async () => {
    try {
      const res = await dispatch(logoutUser()).unwrap()
      toast.success(res.message)
      dispatch(resetAuthState())
      dispatch(resetUserState())
      dispatch(resetUser())
      navigate(RouteSignIn)

    }
    catch (err) {
      toast.error(err)
    }
  }


  return (
    <button onClick={handlelogout}> Logout </button  >
  )
}

export default Logout