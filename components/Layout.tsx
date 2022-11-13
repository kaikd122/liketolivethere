import {ReactNode} from 'react'
import Navbar from './Navbar'


export interface LayoutProps{
    children: ReactNode
}
export default function Layout({children}: LayoutProps) {
  return (
    <div className='bg-slate-100 flex flex-col font-sans'>
        <Navbar/>
        <main className="flex flex-row p-10">{children}</main>
        
    </div>
  )
}

