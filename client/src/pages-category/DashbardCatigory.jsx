import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"

import { Card } from '@/components/ui/card'
import { Link, useNavigate } from 'react-router-dom'


import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@/components/Spinner'
import { toast } from 'react-toastify'
import { loginUser, setUser } from '@/feature/authSlice'
function DashbardCatigory() {

  const navigate = useNavigate()
  const { user, success, error, message, loading, } = useSelector((state) => state.auth)
  const dispatch = useDispatch()



  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4, {
      message: "Password must be at least 4 characters.",
    }),
  })



  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })


  async function onSubmit(values) {
    try {
      const formData = {
        email: values.email,
        password: values.password
      }


      const response = await dispatch(loginUser(formData)).unwrap()

      toast.success(response.message)
      form.reset()
      dispatch(setUser(response.user.user))
      navigate(RouteIndex)


    }
    catch (error) {
      toast.error(error)
    }
  }
  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <div>
        <Card className="px-10">
          <div>
            <Button>Add Catrgory</Button>
          </div>
          <table className="min-w-full divide-y  divide-gray-200 border border-gray-300 shadow-sm rounded-md overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Category Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">item 1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">item-1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

        </Card>
      </div>
    </>

  )
}

export default DashbardCatigory