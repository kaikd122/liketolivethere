// pages/server-sitemap.xml/index.tsx

import { getServerSideSitemap, getServerSideSitemapIndex } from "next-sitemap";
import { GetServerSideProps } from "next";
import { getAllTownsRequest } from "../../lib/actions/search";
import { getTownUrl } from "../../lib/util/urls";
import prisma from "../../lib/prisma";

export const getServerSideProps = async (ctx: any) => {
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
