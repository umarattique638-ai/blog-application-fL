import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"

import { Card } from '@/components/ui/card'
import { Link, useNavigate } from 'react-router-dom'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Spinner from '@/components/Spinner'
import { toast } from 'react-toastify'
import { loginUser, setUser } from '@/feature/authSlice'
import { RiDeleteBin2Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { RouteAddCategory, RouteEditCategory } from '@/helper/RouteName'
import { useDispatch, useSelector } from 'react-redux'
import { showAllCatigory } from '@/feature/catigorySlice'
import DeleteSingleCategory from './DeleteSingleCategory'


function DashbardCatigory() {

  const navigate = useNavigate()
  const { catigorys, loading, error } = useSelector(state => state.catigory);
  const dispatch = useDispatch()



  const showFreshData = () => {
    dispatch(showAllCatigory());
  }

  useEffect(() => {
    showFreshData()
  }, [dispatch]);

  const allCatigoys = catigorys?.categories || []




  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <div className='pt-20'>
        <Card className="px-10 w-450">
          <div>
            <Button className="hover:cursor-pointer"><Link to={RouteAddCategory}>Add Catrgory</Link></Button>
          </div>

          <Table className="w-full text-sm text-left text-gray-700">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="px-4 py-2 uppercase tracking-wide font-semibold text-gray-600">Name</TableHead>
                <TableHead className="px-4 py-2 uppercase tracking-wide font-semibold text-gray-600">Slug</TableHead>
                <TableHead className="px-4 py-2 uppercase tracking-wide font-semibold text-gray-600">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCatigoys.map((cat) => (
                <TableRow key={cat._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                  <TableCell className="px-4 py-2 font-medium text-gray-800">
                    {cat.name}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-gray-600">
                    {cat.slug}
                  </TableCell>
                  <TableCell className="px-4 py-2 flex gap-2">
                    <Button
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-100 hover:cursor-pointer hover:text-green-800 transition"
                    >
                      <Link to={RouteEditCategory(cat._id)}><FaRegEdit /></Link>
                    </Button>
                    <DeleteSingleCategory delId={cat._id} onSuccessDelete={showFreshData} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>



        </Card>
      </div>
    </>

  )
}

export default DashbardCatigory