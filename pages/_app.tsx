
import "styles/globals.css"
import type { AppProps } from 'next/app'
import { ContextProvider, useCtx } from "../context/Context"
import {SessionProvider} from "next-auth/react"


export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {


  
  return (
    <SessionProvider session={session}>
  <ContextProvider>
    <Component {...pageProps} />
    </ContextProvider>
    </SessionProvider>
)}
