import { Card } from '@/components/ui/card'
import { RouteSignIn } from '@/helper/RouteName';
import React from 'react'
import { useNavigate } from 'react-router-dom';

function Verification() {
  const naviagte = useNavigate()
  setTimeout(() => {
    naviagte(RouteSignIn)
  }, 2000);
  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <Card className="p-25 h-50 flex justify-center items-center border border-green-400">
          <div>
            <h1 className='font-bold'>Verification Link Send to your <></>Email account.....</h1>
          </div>
        </Card>
      </div>
    </>
  )
}

export default Verification