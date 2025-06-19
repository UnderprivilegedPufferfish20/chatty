import Signout from '@/components/Signout'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const session = await getSession()
  if (!session) redirect('/')

  return (
    <div>
      <div>Welcome {session.user.name}!</div>
      <Signout />
    </div>
  )
}

export default page