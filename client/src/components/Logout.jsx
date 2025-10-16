import React from 'react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@/components/Spinner'
import { toast } from 'react-toastify'
import { logoutUser, resetState, resetUser } from '@/feature/authSlice'
import { useNavigate } from 'react-router-dom'
import { RouteSignIn } from '@/helper/RouteName'

function Logout() {

  const navigate = useNavigate()
  const { user, success, error, message, loading, } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const handlelogout = async () => {
    try {
      const res = await dispatch(logoutUser()).unwrap()
      toast.success(res.message)
      dispatch(resetState())
      dispatch(resetUser())
      navigate(RouteSignIn)

    }
    catch (err) {
      toast.error(err)
    }
  }
  if (loading) {
    return <Spinner />
  }

  return (
    <Button onClick={handlelogout}> Logout </Button>
  )
}

export default Logout