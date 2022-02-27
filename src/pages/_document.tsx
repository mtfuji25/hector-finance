import Document, { Head, Html, Main, NextScript } from "next/document";

class GlobalDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link href="/fonts/euclid-square.css" rel="stylesheet" />
          <link href="/fonts/glacial-indifference.css" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default GlobalDocument;
