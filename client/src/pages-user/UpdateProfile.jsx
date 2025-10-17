import React, { useEffect, useState } from 'react'
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
import { RouteSignIn, RouteSignUp, RouteVerification } from '../helper/RouteName';
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@/components/Spinner'
import { toast } from 'react-toastify'
import { registerUser, resetState } from '@/feature/authSlice'
import { resetUser, updateUser } from '@/feature/userSlice'
import DeleteOneUser from '@/components/DeleteOneUser'


function UpdateProfile() {


  const navigate = useNavigate()
  const { user, success, error, message, loading, } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const userImage = user && user.user ? user.user.user.image : null
  const baseAuthURL = "http://localhost:8000/uploads/";
  const imageUrl = userImage ? `${baseAuthURL}${userImage}` : "https://github.com/shadcn.png";

  const crUser = user && user.user ? user.user.user : null;
  const [imagePreview, setImagePreview] = useState(imageUrl)

  let crUserId = crUser._id

  const formSchema = z
    .object({
      name: z.string().min(3, 'Name must be at least 3 characters'),
      email: z.string().email(),
      age: z.coerce.number().min(2, 'Age must be at least 2'),

      image: z
        .any()
        .refine(
          (fileList) =>
            !fileList || fileList.length === 0 || fileList[0] instanceof File,
          "Invalid file"
        )
        .refine(
          (files) =>
            !files || files.length === 0 || files[0].size <= 5_000_000,
          "Max file size is 5MB"
        )
        .refine(
          (files) =>
            !files || files.length === 0 ||
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
              files[0].type
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
      name: crUser.name || "",
      email: crUser.email || "",
      age: crUser.age || "",
      image: undefined

    },
  })


  async function onSubmit(values) {
    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("email", values.email)
      formData.append("age", values.age)
      if (values.image && values.image[0]) {
        formData.append("image", values.image[0]);
      }

      const response = await dispatch(updateUser({ id: crUser._id, formData })).unwrap()

      toast.success(response.message)
      dispatch(resetState())
      dispatch(resetUser())
      setTimeout(() => {
        navigate(RouteSignIn)
      }, 1000)
      form.reset()




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
      <div className='flex justify-center items-center h-screen '>
        <Card className="p-5 w-140 hover:shadow-2xl">
          <h1 className='text-2xl font-bold text-center ' >User Profile</h1>

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
                <Button className='w-full hover:bg-violet-700 hover:cursor-pointer' type="submit">Update</Button>


              </div>

            </form>



          </Form>
        </Card>
      </div>
    </>
  )
}

export default UpdateProfile