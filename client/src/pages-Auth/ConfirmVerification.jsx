import { Card } from '@/components/ui/card'
import React from 'react'

function ConfirmVerification() {
  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <Card className="p-25 h-50 flex justify-center items-center border border-green-400">
          <div>
            <h1 className='font-bold'>Email Verified Successfully</h1>
          </div>
        </Card>
      </div>
      <div className='flex justify-center items-center h-screen'>
        <Card className="p-25 h-50 flex justify-center items-center border border-red-400">
          <div>
            <h1 className='font-bold'>Email Verification Failed</h1>
          </div>
        </Card>
      </div>
    </>
  )
}

export default ConfirmVerification