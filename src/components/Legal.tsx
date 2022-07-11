import Head from "next/head";
import { FC, VFC } from "react";
import LightHectorLogoLarge from "public/light-hec-logo.webp";
import DarkHectorLogoLarge from "public/dark-hec-logo.webp";
import { StaticImg } from "./StaticImg";

export const LegalPage: FC<{ title: string }> = ({ title, children }) => (
  <main className="mx-auto my-14 max-w-prose space-y-14">
    <Head>
      <title>{title}</title>
    </Head>
    <StaticImg
      className="mx-auto w-60 dark:hidden"
      src={LightHectorLogoLarge}
      alt="Hector Finance"
    />
    <StaticImg
      className="mx-auto w-60 hidden dark:block"
      src={DarkHectorLogoLarge}
      alt="Hector Finance"
    />
    <div className="space-y-5">{children}</div>
  </main>
);

export const LegalLink: VFC<{ href: string }> = ({ href }) => (
  <a href={href} className="underline">
    {href}
  </a>
);

export const Level2: FC = ({ children }) => <p className="ml-4">{children}</p>;
export const Level3: FC = ({ children }) => <p className="ml-8">{children}</p>;
