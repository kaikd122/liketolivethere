
import "styles/globals.css"
import type { AppProps } from 'next/app'
import { ContextProvider } from "../context/Context"
import {SessionProvider} from "next-auth/react"
import { useEffect } from "react"

export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {

  useEffect(()=>{
    

  }, [])
  return (
    <SessionProvider session={session}>
  <ContextProvider>
    <Component {...pageProps} />
    </ContextProvider>
    </SessionProvider>
)}
