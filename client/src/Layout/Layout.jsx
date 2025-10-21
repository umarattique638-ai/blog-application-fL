import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import AppSidebar from './AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

function Layout() {
  return (

    <>


      <SidebarProvider >
        <Header />
        <AppSidebar />

        <main className='  w-full min-h-screen '>
          <div className='w-full min-h-[calc(100vh-35px)] pt-30 pl-10 pr-10'>

            <Outlet />

          </div>
          <Footer />
        </main>

      </SidebarProvider>
    </>
  )
}

export default Layout