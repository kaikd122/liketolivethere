/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://liketolivethere.com",
  generateRobotsTxt: true,
  sitemapSize: 50000,
  exclude: ["/server-sitemap.xml"], // <= exclude here

  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.SITE_URL}/server-sitemap.xml`, // <==== Add here
    ],
  },

  transform: async (config, path) => {
    // custom function to ignore the path
    if (
      path === "/signin" ||
      path === "/signout" ||
      path === "/verify-request"
    ) {
      return null;
    }

    // only create changefreq along with path
    // returning partial properties will result in generation of XML field with only returned values.
    if (path === "/towns" || path === "/") {
      // This returns `path` & `changefreq`. Hence it will result in the generation of XML field with `path` and  `changefreq` properties only.
      return {
        loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
        changefreq: config.changefreq,
        priority: 1,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        alternateRefs: config.alternateRefs ?? [],
      };
    }

    // Use default transformation for all other cases
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
