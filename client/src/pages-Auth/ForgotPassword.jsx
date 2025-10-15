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
import { Link } from 'react-router-dom'

import { RouteSignIn } from './../helper/RouteName';

function ForgotPassword() {

  const formSchema = z.object({
    email: z.string().email(),

  })



  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })


  function onSubmit() {

    console.log(values)
  }


  return (
    <>
      <div className='flex justify-center items-center h-screen w-screen'>
        <Card className="p-5 w-120 hover:shadow-2xl">
          <h1 className='text-2xl font-bold text-center mb-10' >Forgot Password</h1>
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



export default ForgotPassword