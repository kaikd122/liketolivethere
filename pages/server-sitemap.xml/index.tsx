// pages/server-sitemap.xml/index.tsx

import { getServerSideSitemap } from "next-sitemap";
import { GetServerSideProps } from "next";
import { getAllTownsRequest } from "../../lib/actions/search";
import { getTownUrl } from "../../lib/util/urls";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')

  let fields: any = [];

  try {
    const res = await getAllTownsRequest({ blank: true });
    console.log("RES", res);
    if (res.ok) {
      const towns: { id: number; name: string }[] = await res.json();
      fields = towns.map((town) => ({
        loc: `https://liketolivethere.com${getTownUrl(town)}`,
        lastmod: new Date().toISOString(),
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.log(error);
  }

  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
