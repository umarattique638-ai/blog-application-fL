import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { RouteSignIn, RouteUpdateUserProfile, RouteIndex } from '@/helper/RouteName';
import React from 'react'
import { FaReact } from 'react-icons/fa6'
import { FiLogIn } from "react-icons/fi";
import { Link } from 'react-router-dom';
import Logout from './../components/Logout';
import { useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MdLogin } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegUser } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";


export default function Header() {
  const { user, success, error, message, loading, } = useSelector((state) => state.auth)

  const currentUser = user && user.user ? user.user.accessToken : null;
  const userId = user && user.user ? user.user.user._id : null;
  const userImage = user?.user?.user?.image;
  const baseAuthURL = "http://localhost:8000/uploads/";
  const imageUrl = userImage ? `${baseAuthURL}${userImage}` : "https://github.com/shadcn.png";
  // const imageUrl = userImage ? "https://github.com/shadcn.png" : "https://github.com/shadcn.png";



  return (
    <>
      <div className='z-20 flex justify-between border-b items-center h-16 bg-gray-100 w-full fixed px-10'>
        <div> <FaReact style={{ animation: "spin 7s linear infinite" }} className="text-5xl ml-5 hover:cursor-pointer animate-spin" /></div>
        <div>
          <SearchBar />
        </div>
        <div>
          {currentUser ? (<DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar >
                <AvatarImage src={imageUrl} className="w-full h-full rounded-full object-contain" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <Link to={RouteIndex}>My Account</Link>
                <p className='text-xs'>{user?.user?.user?.name}</p>
                <p className='text-xs'>{user?.user?.user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />


              <DropdownMenuItem>
                <FaRegUser />
                <Link to={`/showuser/${userId}`}>Profile</Link>
              </DropdownMenuItem>



              <DropdownMenuItem className="mb-6">

                <IoMdAdd />
                Add Post
              </DropdownMenuItem>
              <DropdownMenuItem className="border-t-2 "><MdLogin /><Logout />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>)

            : (
              <Button className="hover:cursor" asChild >
                <Link to={RouteSignIn}> <FiLogIn /> Sign in</Link>
              </Button>)}


        </div>
      </div >
    </>
  )
}
