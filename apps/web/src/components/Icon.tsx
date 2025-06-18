import React from 'react'
import Image from 'next/image'

const GenericIcon = ({ name }: { name:string }) => {
  return (
    <Image 
      src={`/icons/${name}.png`}
      width={24}
      height={24}
      alt={name}
    />
  )
}

export default GenericIcon