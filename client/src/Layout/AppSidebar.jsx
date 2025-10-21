import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { GrBlog } from "react-icons/gr";
import { IoHomeOutline } from "react-icons/io5";
import { TbCategory2 } from "react-icons/tb";
import { FaRegComments } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { GoDot } from "react-icons/go";
import { FaReact } from "react-icons/fa";
import { RouteDashBoardCategory } from "@/helper/RouteName";
import { useDispatch, useSelector } from "react-redux";
import { showAllCatigory } from "@/feature/catigorySlice";
import { useEffect, useState } from "react";

function AppSidebar() {
  const { catigorys } = useSelector(state => state.catigory);
  const dispatch = useDispatch()

  const data = catigorys?.categories || [];

  useEffect(() => {
    dispatch(showAllCatigory())
  }, [dispatch])

  let arr = [{
    to: "", label: "Home", icons: <IoHomeOutline />
  }, { to: "", label: "Blogs", icons: <GrBlog /> }, {
    to: RouteDashBoardCategory, label: "Categories", icons: <TbCategory2 />
  }, {
    to: "", label: "Comments", icons: <FaRegComments />
  }, {
    to: "", label: "User", icons: <FaRegUser />
  }]


  return (
    <Sidebar>
      <SidebarHeader className="">
        <FaReact className="text-5xl ml-5" style={{ animation: "spin 3s linear infinite" }} />

      </SidebarHeader>
      <SidebarContent className="mt-10">
        <SidebarGroup >
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {arr.map((items) => (
                <SidebarMenuItem key={items.label} >
                  <SidebarMenuButton asChild>
                    <Link to={items.to}>{items.icons}{items.label}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}


            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        <SidebarGroup className="pt-15" >
          <SidebarGroupLabel>Catigories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((items) => (
                <SidebarMenuItem key={items._id} >
                  <SidebarMenuButton asChild>
                    <Link > {items.name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}


            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>

    </Sidebar >
  )
}

export default AppSidebar