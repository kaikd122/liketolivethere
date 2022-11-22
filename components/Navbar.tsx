import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { useCtx } from '../context/Context'
import AuthButton from './AuthButton'

export default function Navbar() {
  const {data: session} = useSession()
  return (
    <div className='flex flex-row items-center justify-evenly p-4 border-b border-stone-700'>
        <div/>
        <p className='font-medium text-2xl'>LikeToLiveThere</p>
        <div className='flex gap-4'>
          {session?.user?.name && <button className='border border-stone-700 p-2 hover:bg-violet-100'>
            <Link href={`/profile/${encodeURIComponent(session?.user?.id)}`}>{session?.user?.name}</Link>
            </button>}
          <AuthButton/>
        </div>
        </div>
  )
}

