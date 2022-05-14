import "styles/globals.css";
import type { AppProps } from "next/app";
import { Decimal } from "decimal.js";
import TopNav, { SideNav } from "src/components/Nav";

function MyApp({ Component, pageProps }: AppProps) {
  // The default precision of `Decimal` is too low.
  // We're setting the precision here to affect every page.
  Decimal.set({ precision: 38 });

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <TopNav />
        <div className="flex gap-8 p-8">
          <SideNav />
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}

export default MyApp;
