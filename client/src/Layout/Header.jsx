import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { RouteSignIn } from '@/helper/RouteName';
import React from 'react'
import { FaReact } from 'react-icons/fa6'
import { FiLogIn } from "react-icons/fi";
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <>
      <div className='z-20 flex justify-between border-b items-center h-16 bg-gray-100 w-full fixed px-10'>
        <div> <FaReact style={{ animation: "spin 7s linear infinite" }} className="text-5xl ml-5 hover:cursor-pointer animate-spin" /></div>
        <div>
          <SearchBar />
        </div>
        <div>

          <Button className="hover:cursor" asChild >
            <Link to={RouteSignIn}> <FiLogIn /> Sign in</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
