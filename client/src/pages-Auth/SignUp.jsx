import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
import { RouteSignIn, RouteSignUp, RouteVerification } from './../helper/RouteName';
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@/components/Spinner'
import { toast } from 'react-toastify'
import { registerUser, resetAuthState } from '@/feature/authSlice'
import GoogleLogin from '@/components/GoogleLogin'


function SignUp() {

  const [showPassword, setPassword] = useState(false)
  const [showPassword1, setPassword1] = useState(false)
  const [imagePreview, setImagePreview] = useState(false)

  const navigate = useNavigate()
  const { user, success, error, message, loading, } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const formSchema = z
    .object({
      name: z.string().min(3, 'Name must be at least 3 characters'),
      email: z.string().email(),
      age: z.coerce.number().min(2, 'Age must be at least 2'),
      password: z.string().min(4, 'Password must be at least 4 characters'),
      confirmPassword: z.string(),
      image: z
        .custom()
        .refine((files) => files?.length > 0, "Image is required")
        .refine(
          (files) => files?.[0]?.size <= 5_000_000,
          "Max file size is 5MB"
        )
        .refine(
          (files) =>
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
              files?.[0]?.type
            ),
          "Only .jpg, .jpeg, .png and .webp formats are supported"
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    });




  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      age: "",
      password: "",
      confirmPassword: "",
    },
  })


  async function onSubmit(values) {
    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("email", values.email)
      formData.append("age", values.age)
      formData.append("password", values.password)
      if (values.image && values.image[0]) {
        formData.append("image", values.image[0]);
      }

      const response = await dispatch(registerUser(formData)).unwrap()

      toast.success(response.message)
      form.reset()
      dispatch(resetAuthState())
      setTimeout(() => {
        navigate(RouteVerification)
      }, 2000)


    }
    catch (error) {
      toast.error(error)
    }
  }
  if (loading) {
    return <Spinner />
  }

  const handleImage = (e, field) => {
    const file = e.target.files?.[0]
    if (file) {
      field.onChange(e.target.files) // ✅ correct
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }


  return (
    <>
      <div className='flex justify-center items-center h-screen w-screen'>
        <Card className="p-5 w-140 hover:shadow-2xl">
          <h1 className='text-2xl font-bold text-center ' >Create Your  Account</h1>
          <GoogleLogin />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Your name" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                  name="age"
                  type="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Age</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Your age" {...field} />
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
                      <FormLabel className="text-xs">Password</FormLabel>
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

              <div>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword1 ? "text" : "password"}
                            placeholder="Again Enter Your Password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setPassword1((prev) => !prev)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword1 ? <IoMdEyeOff /> : <IoMdEye />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Upload Your image</FormLabel>
                      <FormControl>
                        <div className="relative">
                          {imagePreview && (<img src={imagePreview} width={100}
                            className="mt-2 border rounded"
                            alt="Preview"

                          />)}
                          <Input

                            type="file"
                            className="pr-10"
                            accept="image/*"
                            onChange={(e) => handleImage(e, { onChange })}
                            {...field}
                          />

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
                  <p>Already have an Account ?</p>
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

export default SignUp