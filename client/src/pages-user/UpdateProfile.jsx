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

import { updateUser, resetState } from '@/feature/userSlice'
import { resetUser, setUser } from '@/feature/authSlice'


function UpdateProfile() {


  const navigate = useNavigate()
  const { user, } = useSelector((state) => state.auth)
  const { success, error, message, loading, } = useSelector((state) => state.user)

  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false);


  const crUser = user // Handle nested structure
  const userImage = crUser?.image;
  const userId = crUser?._id;
  const name = crUser?.name;
  const email = crUser?.email;
  const age = crUser?.age;


  const imageUrl = user?.image?.includes("cloudinary.com")
    ? user.image
    : "https://github.com/shadcn.png";

  const [imagePreview, setImagePreview] = useState(imageUrl)


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
      name: crUser?.name || "",
      email: crUser?.email || "",
      age: crUser?.age || "",
      image: undefined

    },
  })


  async function onSubmit(values) {
    try {
      setIsSubmitting(true); // 🔁 start loader

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
      // dispatch(resetUser())
      // setTimeout(() => {
      //   navigate(RouteSignIn)
      // }, 1000)
      form.reset()
      dispatch(setUser(response.updatedUser))
      console.log(response.updatedUser)



    }
    catch (error) {
      toast.error(error)
    } finally {
      setIsSubmitting(false); // 🔁 start loader

    }


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
  if (loading || isSubmitting) {
    return <Spinner />;
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
                        <Input placeholder="Enter Your Email" {...field} readOnly />

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