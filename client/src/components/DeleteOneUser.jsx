import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { resetAuthState, resetUser } from '@/feature/authSlice'
import { RouteSignIn } from '@/helper/RouteName'
import Spinner from './Spinner'
import { deleteUser, resetUserState } from '@/feature/userSlice'


function DeleteOneUser({ userId }) {
  const navigate = useNavigate()
  // Make sure you select from the correct slice here:
  const { user, success, error, message, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleDeleteUser = async () => {
    try {
      const response = await dispatch(deleteUser(userId)).unwrap()

      toast.success(response.message)
      dispatch(resetAuthState())
      dispatch(resetUserState())
      dispatch(resetUser())

      navigate(RouteSignIn)
    } catch (error) {
      toast.error(error)
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <Button
      onClick={handleDeleteUser}
      className="bg-red-500 hover:bg-red-700 hover:cursor-pointer"
    >
      Delete
    </Button>
  )
}

export default DeleteOneUser
