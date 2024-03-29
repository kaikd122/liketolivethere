import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Contrail+One&family=Dela+Gothic+One&family=Outfit:wght@100;200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
        <meta name="color-scheme" content="light only" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
