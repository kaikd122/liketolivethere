import "styles/globals.css";
import type { AppProps } from "next/app";
import { ContextProvider, useCtx } from "../context/Context";
import { SessionProvider } from "next-auth/react";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ContextProvider>
        <Component {...pageProps} />
      </ContextProvider>
    </SessionProvider>
  );
}
