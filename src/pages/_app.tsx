import "styles/globals.css";
import type { AppProps } from "next/app";
import { ProviderProvider } from "src/components/Provider";
import Decimal from "decimal.js";
import { useTheme } from "src/hooks/theme";

export default function App({ Component, pageProps }: AppProps) {
  // The default precision of `Decimal` is too low.
  // We're setting the precision here to affect every page.
  Decimal.set({ precision: 38 });
  useTheme();
  return (
    <ProviderProvider>
      <Component {...pageProps} />
    </ProviderProvider>
  );
}
