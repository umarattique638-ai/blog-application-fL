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
import { IoMdEyeOff } from "react-icons/io";

import { IoMdEye } from "react-icons/io";
import { RouteForgotPassword, RouteIndex, RouteSignUp } from './../helper/RouteName';
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@/components/Spinner'
import { toast } from 'react-toastify'
import { loginUser } from '@/feature/authSlice'


function SignIn() {

  const [showPassword, setPassword] = useState(false)
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
      <div className='flex justify-center items-center h-screen w-screen'>
        <Card className="p-5 w-120 hover:shadow-2xl">
          <h1 className='text-2xl font-bold text-center mb-10' >Login  Account</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Your Email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              <div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex justify-between'>
                        <FormLabel className="text-xs">Password</FormLabel>
                        <Link className="text-xs font-bold text-blue-700" to={RouteForgotPassword}>Forgot Password ?</Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <div className='mt-10'>
                <Button className='w-full hover:bg-violet-700 hover:cursor-pointer' type="submit">Submit</Button>
                <div className='flex gap-2 justify-center items-center mt-3 text-sm'>
                  <p>Dont't have an Account ?</p>
                  <Link className='text-blue-700 font-bold hover:cursor-pointer hover:underline ' to={RouteSignUp}>Sign Up</Link>
                </div>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default SignIn