// pages/server-sitemap.xml/index.tsx

import { getServerSideSitemap, getServerSideSitemapIndex } from "next-sitemap";
import { GetServerSideProps } from "next";
import { getAllTownsRequest } from "../../lib/actions/search";
import { getTownUrl } from "../../lib/util/urls";
import prisma from "../../lib/prisma";

export const getServerSideProps = async (ctx: any) => {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')

  let fields: any = [];

  try {
    let towns: { id: number; name: string | null }[] = [];

    let isAllLoaded = false;

    // while (!isAllLoaded) {
    const resTowns = await prisma.towns.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: "asc",
      },
      take: 10000,
      skip: 10000,
    });

    towns = [...towns, ...resTowns];
    // }

    fields = towns.map((town) => ({
      loc: `${process.env.SITE_URL}/${getTownUrl(town)}`,
      lastmod: new Date().toISOString(),
      priority: 0.8,
    }));
  } catch (error) {
    console.log(error);
  }

  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
