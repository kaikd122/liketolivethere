import React from 'react'
import { useCtx } from '../context/Context';

function AuthButton() {
  const ctx = useCtx();
  return (
    <button className='border border-stone-700 p-2 hover:bg-violet-100' onClick={()=>{ctx.setIsLoading(!ctx.isLoading)}}>Login</button>

  )
}

export default AuthButton