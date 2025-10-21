import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { deleteCatigory, resetCategoryState } from '@/feature/catigorySlice'
import { RouteDashBoardCategory } from '@/helper/RouteName'
import React, { useEffect, useState } from 'react'
import { RiDeleteBin2Line } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function DeleteSingleCategory({ delId, onSuccessDelete }) {

  const navigate = useNavigate()
  const { catigory, success, error, message, loading, } = useSelector((state) => state.catigory)
  const dispatch = useDispatch()





  const handleDel = async () => {
    try {

      const isConfirmed = window.confirm("Are you sure you want to delete this category?");

      if (!isConfirmed) return;
      const response = await dispatch(deleteCatigory(delId)).unwrap()
      toast.success(response.message)
      dispatch(resetCategoryState())
      onSuccessDelete()
      navigate(RouteDashBoardCategory)

    }
    catch (error) {
      toast.error(error)
    }
  }


  if (loading) {
    return <Spinner />
  }

  return (
    <Button onClick={handleDel}
      variant="outline"
      className="text-red-600 border-red-600 hover:bg-red-100 hover:cursor-pointer hover:text-red-800 transition"
    >
      <RiDeleteBin2Line />
    </Button>
  )
}

export default DeleteSingleCategory