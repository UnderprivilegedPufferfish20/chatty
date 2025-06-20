"use client"

import React, { useActionState } from 'react'
import { Input } from './ui/input'
import { addFriend } from '@/lib/actions'

const FriendCodeOTP = () => {
  const [state, action] = useActionState(addFriend,undefined)

  return (
    <form action={action}>
      <div className='flex flex-col gap-2'>
        <Input id='code' name='code' placeholder='6 digits, letters or numbers'/>
        {state?.error && <p className='text-red-400'>{state.error.code}</p>}
        {state?.message && <p className='text-green-400'>{state.message}</p>}
      </div>  
    </form>
  )
}

export default FriendCodeOTP

