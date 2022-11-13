import {ReactNode} from 'react'
import Navbar from './Navbar'


export interface LayoutProps{
    children: ReactNode
}
export default function Layout({children}: LayoutProps) {
  return (
    <div className=' flex flex-col '>
        <Navbar/>
        <main className="flex flex-row p-10">{children}</main>
        
    </div>
  )
}

