import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { RouteSignIn, RouteIndex } from '@/helper/RouteName';
import React from 'react';
import { FaReact } from 'react-icons/fa6';
import { FiLogIn } from "react-icons/fi";
import { Link } from 'react-router-dom';
import Logout from '../components/Logout';
import { useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdLogin } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaRegUser } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

export default function Header() {
  const { user } = useSelector((state) => state.auth);

  // Use user directly
  const userId = user?._id;
  const name = user?.name;
  const email = user?.email;

  const imageUrl = user?.image?.includes("cloudinary.com")
    ? user.image
    : "https://github.com/shadcn.png";

  return (
    <div className='z-20 flex justify-between border-b items-center h-16 bg-gray-100 w-full fixed px-10'>
      {/* Logo */}
      <div>
        <FaReact
          style={{ animation: "spin 7s linear infinite" }}
          className="text-5xl ml-5 hover:cursor-pointer"
        />
      </div>

      {/* Search Bar */}
      <div>
        <SearchBar />
      </div>

      {/* User Menu */}
      <div className='hover:cursor-pointer'>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className='hover:cursor-pointer'>
                <AvatarImage
                  src={imageUrl}
                  alt={name || "User"}
                  className="w-full h-full rounded-full object-cover"
                />
                <AvatarFallback>
                  {name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='hover:cursor-pointer'>
              <DropdownMenuLabel>
                <Link to={RouteIndex}>My Account</Link>
                <p className='text-xs font-normal'>{name}</p>
                <p className='text-xs font-normal text-gray-500'>{email}</p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className='hover:cursor-pointer'>
                <Link to={`/showuser/${userId}`} className="flex items-center gap-2">
                  <FaRegUser />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className='hover:cursor-pointer'>
                <Link to="/add-post" className="flex items-center gap-2">
                  <IoMdAdd />
                  Add Post
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className='hover:cursor-pointer'>
                <MdLogin />
                <Logout />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link to={RouteSignIn} className="flex items-center gap-2">
              <FiLogIn />
              Sign in
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}