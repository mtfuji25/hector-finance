import "styles/globals.css";
import type { AppProps } from "next/app";
import { Decimal } from "decimal.js";

function MyApp({ Component, pageProps }: AppProps) {
  // The default precision of `Decimal` is too low.
  // We're setting the precision here to affect every page.
  Decimal.set({ precision: 38 });

  return <Component {...pageProps} />;
}

export default MyApp;
