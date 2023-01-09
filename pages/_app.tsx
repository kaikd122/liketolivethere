import "styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "styles/map-overrides.css";
import { DefaultSeo } from "next-seo";
import { Analytics } from "@vercel/analytics/react";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      <DefaultSeo
        title="Like To Live There"
        description="An open look into the world's neighbourhoods"
        canonical="https://www.liketolivethere.com/"
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: "https://www.liketolivethere.com/",
          siteName: "Like To Live There",
          description: "An open look into the world's neighbourhoods",

          images: [
            {
              url: "https://www.liketolivethere.com/opengraph.png",
              width: 1200,
              height: 630,
              alt: "Like To Live There",
              type: "image/png",
            },
          ],
        }}
      />
      <Component {...pageProps} key={router.asPath} />
      <Analytics />
    </SessionProvider>
  );
}
