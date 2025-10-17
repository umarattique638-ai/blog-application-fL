import React, { useEffect, useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import DeleteOneUser from '@/components/DeleteOneUser'
import { Button } from '@/components/ui/button'
function ShowProfile() {

  const navigate = useNavigate()
  const { user, success, error, message, loading, } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {

  }, [user])

  const userImage = user && user.user ? user.user.user.image : null
  const baseAuthURL = "http://localhost:8000/uploads/";
  const imageUrl = userImage ? `${baseAuthURL}${userImage}` : "https://github.com/shadcn.png";

  const crUser = user && user.user ? user.user.user : null;
  const [imagePreview, setImagePreview] = useState(imageUrl)
  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <Card className="w-200  p-10">
          <h1 className='text-center font-bold text-4xl'>User Profile</h1>
          <div className='flex justify-center items-center'>
            <img src={imagePreview} width={100} className='rounded-full' />
          </div>
          <h2 className='font-bold'>Name : {crUser.name.toUpperCase()} </h2>
          <h2 className='font-bold'>Email : {crUser.email} </h2>
          <h2 className='font-bold'>Age : {crUser.age} </h2>

          <div className='flex justify-between '>
            <Button className="hover:cursor-pointer">
              <Link to={`/updateuser/${crUser._id}`}>Update</Link>
            </Button>

            <DeleteOneUser className="hover:cursor-pointer" userId={crUser._id} />
          </div>

        </Card>
      </div>
    </>
  )
}

export default ShowProfile