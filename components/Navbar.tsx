import React from 'react'
import AuthButton from './AuthButton'

export default function Navbar() {
  return (
    <div className='flex flex-row items-center justify-evenly p-4 border-b border-stone-700'>
        <div/>
        <p className='font-medium text-2xl font-display'>LikeToLiveThere.com</p>
        <AuthButton/>
        </div>
  )
}

