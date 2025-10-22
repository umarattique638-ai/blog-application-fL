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
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch()
  console.log(user)

  const crUser = user // Handle nested structure
  const userId = crUser?._id;
  const name = crUser?.name;
  const email = crUser?.email;
  const age = crUser?.age;


  const imageUrl = user?.image?.includes("cloudinary.com")
    ? user.image
    : "https://github.com/shadcn.png";

  const [imagePreview, setImagePreview] = useState(imageUrl)
  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <Card className="w-200  p-10">
          <h1 className='text-center font-bold text-4xl'>User Profile</h1>
          <div className='flex justify-center items-center'>
            <img src={imagePreview} width={100} className='rounded-full' />
          </div>
          <h2 className='font-bold'>Name : {name} </h2>
          <h2 className='font-bold'>Email : {email} </h2>
          <h2 className='font-bold'>Age : {age} </h2>

          <div className='flex justify-between '>
            <Button className="hover:cursor-pointer">
              <Link to={`/updateuser/${userId}`}>Update</Link>
            </Button>

            <DeleteOneUser className="hover:cursor-pointer" userId={userId} />
          </div>

        </Card>
      </div>
    </>
  )
}

export default ShowProfile