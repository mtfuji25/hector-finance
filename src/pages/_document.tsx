import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link href="/fonts/euclid-square.css" rel="stylesheet" />
        <link href="/fonts/glacial-indifference.css" rel="stylesheet" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon-apple-touch.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/favicon-mask.svg" color="#be7c40" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
