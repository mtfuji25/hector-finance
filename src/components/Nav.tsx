import Link from "next/link";
import { FC, useEffect, useRef, useState, VFC } from "react";
import { StaticImg } from "./StaticImg";
import HectorLogoLarge from "public/hector-wordmark.svg";
import WatermelonLight from "src/icons/watermelon-slice-light.svgr";
import AbacusLight from "src/icons/abacus-light.svgr";
import BookLight from "src/icons/book-light.svgr";
import BoxBallotLight from "src/icons/box-ballot-light.svgr";
import BoxDollarLight from "src/icons/box-dollar-light.svgr";
import BuildingColumnsLight from "src/icons/building-columns-light.svgr";
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
import WalletRegular from "src/icons/wallet-regular.svgr";
import Bars from "src/icons/bars.svgr";
import { useWallet, WalletState } from "src/wallet";
import { classes, ellipsisBetween } from "src/util";

export default function TopNav() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-row items-center justify-between px-8 py-6">
        {/* Logo */}
        <StaticImg
          src={HectorLogoLarge}
          alt="Hector Finance"
          className="hidden h-6 w-auto object-contain sm:block"
        />
        <Bars
          onClick={() => setIsNavOpen((prev) => !prev)}
          className="h-6 w-6 cursor-pointer sm:hidden"
        />
        {isNavOpen && (
          <SideNav
            closeMenu={() => setIsNavOpen(false)}
            isNavOpen={isNavOpen}
          />
        )}

        {/* Controls */}
        <Wallet />
      </div>
      <hr />
    </>
  );
}

const Wallet: VFC = () => {
  const wallet = useWallet();
  return (
    <>
      {wallet.state === WalletState.NoWallet && (
        <a
          target="_blank"
          rel="noreferrer"
          href="https://metamask.io/download/"
          title="MetaMask download"
          className="flex items-center gap-1 rounded bg-orange-400 px-4 py-2 text-white"
        >
          Install MetaMask
          <ArrowUpRightFromSquareRegular className="h-3 w-3 opacity-50" />
        </a>
      )}
      {wallet.state === WalletState.Disconnected && (
        <button
          className="rounded bg-orange-400 px-6 py-2 font-medium text-white"
          onClick={() => wallet.connect()}
        >
          Connect
        </button>
      )}
      {wallet.state === WalletState.Connected && (
        <div className="flex items-center gap-2 rounded bg-gray-100 px-4 py-2 text-gray-500">
          <WalletRegular className="h-4 w-4" />
          {ellipsisBetween(4, 4, wallet.address.slice(2))}
        </div>
      )}
    </>
  );
};

export const SideNav: VFC<{ isNavOpen?: boolean; closeMenu?: () => void }> = ({
  isNavOpen,
  closeMenu,
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (
        closeMenu &&
        isNavOpen &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isNavOpen, closeMenu]);

  return (
    <nav
      ref={ref}
      className={classes(
        "h-fit flex-shrink-0 flex-grow-0 space-y-4 sm:block",
        isNavOpen
          ? "absolute top-0 left-0 z-10 h-full w-3/5 border-r-4 border-r-gray-400 bg-white px-2 py-8"
          : "hidden",
      )}
    >
      <div onClick={closeMenu}>
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
        <InternalNav href="/bond" disabled>
          <SealLight width={16} height={16} />
          Bond
        </InternalNav>
        <InternalNav href="/exchange" disabled>
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

        <InternalNav href="/calculator">
          <AbacusLight width={16} height={16} />
          Calculator
        </InternalNav>
      </div>
      <Divider />
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
      <Divider />
      <div className="-mx-3 flex items-center justify-center">
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
};

const InternalNav: FC<{ href: string; disabled?: boolean }> = ({
  children,
  href,
  disabled = false,
}) => (
  <>
    {disabled ? (
      <div className="-mx-3 flex cursor-not-allowed items-center gap-2 rounded px-3 py-2 text-gray-600 opacity-40 hover:bg-gray-100 hover:text-gray-800">
        {children}
      </div>
    ) : (
      <Link href={href}>
        <a className="-mx-3 flex items-center gap-2 rounded px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
          {children}
        </a>
      </Link>
    )}
  </>
);

const ExternalNav: FC<{ href: string }> = ({ children, href }) => (
  <a
    target={"_blank"}
    rel={"noreferrer"}
    href={href}
    className="group -mx-3 flex items-center gap-2 rounded px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
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
    className="rounded p-3 text-gray-400 hover:bg-gray-100 hover:text-gray-800"
  >
    {children}
  </a>
);

const Divider: VFC = () => <hr className="border-t border-gray-300" />;
