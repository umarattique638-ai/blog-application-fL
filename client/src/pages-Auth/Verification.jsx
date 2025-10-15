import { Card } from '@/components/ui/card'
import React from 'react'

function Verification() {
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