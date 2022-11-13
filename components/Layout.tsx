import {ReactNode} from 'react'
import Navbar from './Navbar'
import { useCtx } from '../context/Context'


export interface LayoutProps{
    children: ReactNode
}
export default function Layout({children}: LayoutProps) {
  const ctx = useCtx()
  return (
    <div className=' flex flex-col '>
        <Navbar/>
        <main className="flex flex-row p-10">{children}</main>
        {ctx.isLoading ? <p>Loading</p> : <p>Not loading</p>}
        
    </div>
  )
}

