"use client"

import Link from 'next/link'
import React from 'react'

const Signout = () => {
  return (
    <Link href={'http://localhost:3000/api/auth/signout'}>Sign Out</Link>
  )
}

export default Signout