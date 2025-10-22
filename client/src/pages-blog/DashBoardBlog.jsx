import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from '@/components/ui/button'
import { FaRegEdit } from 'react-icons/fa'
import { RiDeleteBin2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { FaRegEye } from 'react-icons/fa6'
import { RouteAddBlog } from '@/helper/RouteName'
function DashBoardBlog() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle ><Link to={RouteAddBlog}>
            <Button className="hover:cursor-pointer">Add Blog</Button></Link></CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction><Button>Delete All Blogs</Button></CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Auther</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Title</TableHead>
                <TableHead >Slug</TableHead>
                <TableHead >Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell >INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell >$250.00</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell >
                  <div className=' text-right flex justify-end gap-3 flex-wrap   '>
                    <Button
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-red-100 hover:cursor-pointer hover:text-blue-800 transition"
                    >
                      <FaRegEye />
                    </Button>
                    <Button
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-100 hover:cursor-pointer hover:text-green-800 transition"
                    >
                      <Link><FaRegEdit /></Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-100 hover:cursor-pointer hover:text-red-800 transition"
                    >
                      <RiDeleteBin2Line />
                    </Button>
                  </div>


                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>

      </Card>
    </>
  )
}

export default DashBoardBlog