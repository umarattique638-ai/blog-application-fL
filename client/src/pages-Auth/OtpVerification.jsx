import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from '@/components/ui/card'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@/components/Spinner'
import { toast } from 'react-toastify'
import { otpVerification, resetState, resetUser } from '@/feature/authSlice'
import { RouteResetPassword, RouteSignIn } from './../helper/RouteName';

function OtpVerification() {

  const navigate = useNavigate()
  const { user, success, error, message, loading, } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const formSchema = z.object({
    otp: z.coerce.number().min(4, 'Invalid OTP'),

  })



  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  })


  async function onSubmit(values) {
    try {
      const formData = {
        otp: values.otp,

      }


      const response = await dispatch(otpVerification(formData)).unwrap()

      toast.success(response.message)
      form.reset()
      dispatch(resetState())
      dispatch(resetUser())
      navigate(RouteResetPassword)


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
      <div className='flex justify-center items-center h-screen w-screen'>
        <Card className="p-5 w-120 hover:shadow-2xl">
          <h1 className='text-2xl font-bold text-center mb-10' >Otp Verification</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <FormField
                  control={form.control}
                  name="otp"
                  type="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Otp</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Your Otp" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>




              <div className='mt-10'>
                <Button className='w-full hover:bg-violet-700 hover:cursor-pointer' type="submit">Submit</Button>
                <div className='flex gap-2 justify-center items-center mt-3 text-sm'>
                  <p>Back to </p>
                  <Link className='text-blue-700 font-bold hover:cursor-pointer hover:underline ' to={RouteSignIn}>Sign In</Link>
                </div>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </>
  )
}


export default OtpVerification