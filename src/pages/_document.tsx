import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <body className="overflow-y-scroll font-body text-gray-800 dark:bg-gray-700">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
