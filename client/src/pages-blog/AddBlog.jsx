import React, { useEffect, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Spinner from '@/components/Spinner'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import slugify from "slugify"
import { addBlog, resetBlogState } from '@/feature/blogSlice'
import { RouteIndex } from '@/helper/RouteName'
function AddBlog() {

  const navigate = useNavigate()
  const { blog, success, error, message, loading, } = useSelector((state) => state.blog)
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth)
  const catigory = useSelector((state) => state.catigory)

  let allCatigories = catigory.catigorys.categories
  let auther = user.user.name


  const formSchema = z.object({
    title: z.string().min(3, {
      message: "title must be at least 3 characters.",
    }),
    slug: z.string().min(3, {
      message: "slug must be at least 3 characters.",
    }),
  })



  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })


  async function onSubmit(values) {

    console.log(values)

    try {
      const formData = {
        title: values.title,
        slug: values.slug
      }

      const response = await dispatch(addBlog(formData)).unwrap()
      toast.success(response.message)
      form.reset()
      dispatch(resetBlogState())


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
      <>
        <div className='pt-20'>
          <Card className="p-5 mx-auto w-200 hover:shadow-2xl">
            <h1 className='text-2xl font-bold text-center ' >Add Blog</h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Your title" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Your title" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


                <div>
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex justify-between'>
                          <FormLabel className="text-xs">Slug</FormLabel>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter your slug"
                              className="pr-10"
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
                  <div className='text-center pt-5 hover:cursor-pointer'>
                    Back to <Link className='text-blue-500' to={RouteIndex}> Dashboard ?</Link>
                  </div>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </>
    </>
  )
}

export default AddBlog