// pages/server-sitemap.xml/index.tsx

import { getServerSideSitemap, getServerSideSitemapIndex } from "next-sitemap";
import { GetServerSideProps } from "next";
import { getAllTownsRequest } from "../../lib/actions/search";
import { getTownUrl } from "../../lib/util/urls";
import prisma from "../../lib/prisma";

export const getServerSideProps = async (ctx: any) => {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')

  // let fields: any = [];
  // console.log("GETTIG SERVER SIDE PROPS");

  // try {
  //   let towns: { id: number; name: string | null }[] = [];

  //   let isAllLoaded = false;

  //   while (!isAllLoaded) {
  //     console.log("CURRENT", towns.length);
  //     const resTowns = await prisma.towns.findMany({
  //       select: {
  //         id: true,
  //         name: true,
  //       },
  //       take: 10000,
  //       skip: towns.length,
  //     });

  //     if (resTowns.length < 10000) {
  //       isAllLoaded = true;
  //     }
  //     towns = [...towns, ...resTowns];
  //   }

  //   console.log("RES", towns.length);

  //   fields = towns.map((town) => ({
  //     loc: `https://liketolivethere.com${getTownUrl(town)}`,
  //     lastmod: new Date().toISOString(),
  //     priority: 0.8,
  //   }));
  // } catch (error) {
  //   console.log(error);
  // }
  // console.log("HI");

  return getServerSideSitemapIndex(ctx, [
    `${process.env.SITE_URL}/server-sitemap-0.xml`,
    `${process.env.SITE_URL}/server-sitemap-1.xml`,
    `${process.env.SITE_URL}/server-sitemap-2.xml`,
    `${process.env.SITE_URL}/server-sitemap-3.xml`,
    `${process.env.SITE_URL}/server-sitemap-4.xml`,
  ]);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
