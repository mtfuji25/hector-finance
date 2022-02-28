import Link from "next/link";
import { FC, VFC } from "react";
import { StaticImg } from "./StaticImg";
import HectorLogo from "public/icons/hector.svg";
import WatermelonLight from "src/icons/watermelon-slice-light.svgr";
import AbacusLight from "src/icons/abacus-light.svgr";
import BookLight from "src/icons/book-light.svgr";
import BoxBallotLight from "src/icons/box-ballot-light.svgr";
import BoxDollarLight from "src/icons/box-dollar-light.svgr";
import BuildingColumnsLight from "src/icons/building-columns-light.svgr";
import ChartMixedLight from "src/icons/chart-mixed-light.svgr";
import ScaleBalancedLight from "src/icons/scale-balanced-light.svgr";
import SealLight from "src/icons/seal-light.svgr";
import SeedlingLight from "src/icons/seedling-light.svgr";
import SquarePollVerticalLight from "src/icons/square-poll-vertical-light.svgr";
import Discord from "src/icons/discord-brands.svgr";
import Github from "src/icons/github-brands.svgr";
import Medium from "src/icons/medium-brands.svgr";
import Telegram from "src/icons/telegram-brands.svgr";
import Twitter from "src/icons/twitter-brands.svgr";
import Tor from "src/icons/tor.svgr";
import ArrowUpRightFromSquareRegular from "src/icons/arrow-up-right-from-square-regular.svgr";

export const Nav: VFC = () => (
  <nav className="w-64 flex-shrink-0 flex-grow-0 space-y-6 bg-slate-50 p-6">
    <div className="space-y-2">
      <StaticImg
        src={HectorLogo}
        className="mx-auto h-24 w-24"
        alt="Hector Finance "
      />
      <div className="text-center font-logo text-3xl">
        <span className="font-bold text-amber-800/80">Hector</span>{" "}
        <span className="text-gray-500">Finance</span>
      </div>
    </div>
    <div>
      <InternalNav href="/">
        <SquarePollVerticalLight width={16} height={16} />
        Dashboard
      </InternalNav>
      <InternalNav href="/stake">
        <WatermelonLight width={16} height={16} />
        Stake
      </InternalNav>
      <InternalNav href="/wrap">
        <BoxDollarLight width={16} height={16} />
        Wrap
      </InternalNav>
      <InternalNav href="/bond">
        <SealLight width={16} height={16} />
        Bond
      </InternalNav>
      <InternalNav href="/exchange">
        <ScaleBalancedLight width={16} height={16} />
        Exchange
      </InternalNav>
      <InternalNav href="/farm">
        <SeedlingLight width={16} height={16} />
        Farm
      </InternalNav>
      <InternalNav href="/mint">
        <Tor width={16} height={16} />
        Mint
      </InternalNav>
      <InternalNav href="/investments">
        <ChartMixedLight width={16} height={16} />
        Investments
      </InternalNav>
      <InternalNav href="/calculator">
        <AbacusLight width={16} height={16} />
        Calculator
      </InternalNav>
    </div>
    <hr className="border-t-2" />
    <div>
      <ExternalNav href="https://hectorbank.com/">
        <BuildingColumnsLight width={16} height={16} />
        Hector Bank
      </ExternalNav>
      <ExternalNav href="https://snapshot.org/#/hectordao.eth">
        <BoxBallotLight width={16} height={16} />
        Governance
      </ExternalNav>
      <ExternalNav href="https://docs.hector.finance">
        <BookLight width={16} height={16} />
        Docs
      </ExternalNav>
    </div>
    <hr className="border-t-2" />
    <div className="flex items-center justify-center">
      <SocialNav href="https://discord.gg/hector" title="Discord">
        <Discord width={16} height={16} />
      </SocialNav>
      <SocialNav href="https://t.me/hectorDAO" title="Telegram">
        <Telegram width={16} height={16} />
      </SocialNav>
      <SocialNav href="https://medium.com/@HectorDAO" title="Medium">
        <Medium width={16} height={16} />
      </SocialNav>
      <SocialNav href="https://twitter.com/HectorDAO_HEC" title="Twitter">
        <Twitter width={16} height={16} />
      </SocialNav>
      <SocialNav href="https://github.com/Hector-DAO" title="GitHub">
        <Github width={16} height={16} />
      </SocialNav>
    </div>
  </nav>
);

const InternalNav: FC<{ href: string }> = ({ children, href }) => (
  <Link href={href}>
    <a className="-mx-3 flex items-center gap-2 rounded px-3 py-2 text-gray-600 hover:bg-gray-200/80 hover:text-gray-800">
      {children}
    </a>
  </Link>
);

const ExternalNav: FC<{ href: string }> = ({ children, href }) => (
  <a
    href={href}
    className="group -mx-3 flex items-center gap-2 rounded px-3 py-2 text-gray-600 hover:bg-gray-200/80 hover:text-gray-800"
  >
    {children}
    <ArrowUpRightFromSquareRegular
      width={12}
      height={12}
      className="text-gray-400 group-hover:text-gray-500"
    />
  </a>
);

const SocialNav: FC<{ href: string; title: string }> = ({
  children,
  title,
  href,
}) => (
  <a
    href={href}
    title={title}
    className="rounded px-3 py-3 text-gray-400 hover:bg-gray-200/80 hover:text-gray-900"
  >
    {children}
  </a>
);
