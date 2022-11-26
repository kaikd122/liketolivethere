import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { useCtx } from '../context/Context'
import AuthButton from './AuthButton'

export default function Navbar() {
  const ctx = useCtx();
  return (
    <div className='grid grid-cols-3 items-center justify-evenly p-4 border-b border-stone-700'>
<div/>
        <div className='col-span-1 flex justify-center'>
        <button className='font-medium text-2xl'><Link href={`/`}>LikeToLiveThere</Link></button>
        </div>
        <div className='flex gap-4 col-span-1 justify-end'>
          {ctx?.user?.name && <button className='border border-stone-700 p-2 hover:bg-violet-100'>
            <Link href={`/profile/${encodeURIComponent(ctx?.user?.id)}`}>{ctx?.user?.name}</Link>
            </button>}
          <AuthButton/>
        </div>
        </div>
  )
}

