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
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@/components/Spinner'
import { toast } from 'react-toastify'
import { RouteDashBoardCategory } from '@/helper/RouteName'
import { showCatigory, updateCatigory } from '@/feature/catigorySlice'
import slugify from 'slugify'



function EditCatigory() {
  const navigate = useNavigate()
  const { catigory, success, error, message, loading, } = useSelector((state) => state.catigory)
  const dispatch = useDispatch()

  const catId = useParams()
  let catIdd = useParams()
  let catID = catIdd.id







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


  async function onSubmit(values) {
    try {
      const formData = {

        name: values.name,
        slug: values.slug
      }

      const response = await dispatch(updateCatigory({ id: catID, formData })).unwrap()
      toast.success(response.message)
      form.reset()
      dispatch(resetCategoryState())
      navigate(RouteDashBoardCategory)
    }
    catch (error) {
      toast.error(error)
    }
  }


  // First Use Effect to get Gata for database
  let res = null
  useEffect(() => {
    const getpost = async () => {
      res = await dispatch(showCatigory(catId.id))
    }
    getpost()

  }, [dispatch, catId.id])



  // 2nd Use Effect for making slug
  const catName = form.watch('name')
  useEffect(() => {
    if (catName) {
      const slug = slugify(catName, { lower: true })
      form.setValue('slug', slug)
    }
  }, [catName])




  // 3rd Use Effect to set Form Data
  useEffect(() => {
    if (catigory?.category) {
      form.reset({
        name: catigory.category.name,
        slug: catigory.category.slug,
      });
    }
  }, [catigory, form.reset]);


  if (loading) {
    return <Spinner />
  }
  return (
    <>
      <div className='pt-20'>
        <Card className="p-5 mx-auto w-200 hover:shadow-2xl">
          <h1 className='text-2xl font-bold text-center ' >Update Category</h1>
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

export default EditCatigory

