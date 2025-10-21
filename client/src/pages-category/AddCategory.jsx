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

import Spinner from '@/components/Spinner'
import { toast } from 'react-toastify'
import { RouteDashBoardCategory } from '@/helper/RouteName'
import { useDispatch, useSelector } from 'react-redux'
import slugify from "slugify"
import { addCatigory, resetCategoryState } from '@/feature/catigorySlice'


function AddCategory() {

  const navigate = useNavigate()
  const { catigory, success, error, message, loading, } = useSelector((state) => state.catigory)
  const dispatch = useDispatch()



  const formSchema = z.object({
    name: z.string().min(3, {
      message: "name must be at least 3 characters.",
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

  const catName = form.watch('name')

  useEffect(() => {
    if (catName) {
      const slug = slugify(catName, { lower: true })
      form.setValue('slug', slug)
    }
  }, [catName])

  async function onSubmit(values) {
    try {
      const formData = {
        name: values.name,
        slug: values.slug
      }

      const response = await dispatch(addCatigory(formData)).unwrap()
      toast.success(response.message)
      form.reset()
      dispatch(resetCategoryState())
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
    <>
      <div className='pt-20'>
        <Card className="p-5 mx-auto w-200 hover:shadow-2xl">
          <h1 className='text-2xl font-bold text-center ' >Add Category</h1>
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
                  Back to <Link className='text-blue-500' to={RouteDashBoardCategory}> Dashboard ?</Link>
                </div>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default AddCategory
