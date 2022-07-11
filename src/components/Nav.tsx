import Link from "next/link";
import DarkHectorLogoLarge from "public/dark-hec-logo.webp";
import LightHectorLogoLarge from "public/light-hec-logo.webp";
import { FC, useEffect, useRef, useState, VFC } from "react";
import { useTheme } from "src/hooks/theme";
import ArrowUpRightFromSquareRegular from "src/icons/arrow-up-right-from-square-regular.svgr";
import Bars from "src/icons/bars.svgr";
import BookLight from "src/icons/book-light.svgr";
import BoxBallotLight from "src/icons/box-ballot-light.svgr";
import BoxDollarLight from "src/icons/box-dollar-light.svgr";
import BridgeLight from "src/icons/bridge-light.svgr";
import BuildingColumnsLight from "src/icons/building-columns-light.svgr";
import Discord from "src/icons/discord-brands.svgr";
import Github from "src/icons/github-brands.svgr";
import LayersRegular from "src/icons/layers.svgr";
import Medium from "src/icons/medium-brands.svgr";
import ScaleBalancedLight from "src/icons/scale-balanced-light.svgr";
import SealLight from "src/icons/seal-light.svgr";
import SeedlingLight from "src/icons/seedling-light.svgr";
import SquarePollVerticalLight from "src/icons/square-poll-vertical-light.svgr";
import SunLight from "src/icons/sun-light.svgr";
import Telegram from "src/icons/telegram-brands.svgr";
import Tor from "src/icons/tor.svgr";
import Twitter from "src/icons/twitter-brands.svgr";
import WalletRegular from "src/icons/wallet-regular.svgr";
import WatermelonLight from "src/icons/watermelon-slice-light.svgr";
import { assertNever, classes, ellipsisBetween } from "src/util";
import { useWallet, WalletState } from "src/wallet";
import * as Eip1193 from "src/providerEip1193";
import * as WalletConnect from "src/providerWalletConnect";
import {
  ProviderProtocol,
  setPreferredProtocol,
  useProvider,
} from "./Provider";
import { StaticImg } from "./StaticImg";
import { WalletProtocolModal } from "./WalletProtocolModal";

export default function TopNav() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <>
      <div className="flex flex-row items-center justify-between px-8 py-6">
        <div className="hidden sm:block">
          <StaticImg
            src={LightHectorLogoLarge}
            alt="Hector Finance"
            className="h-10 w-auto object-contain dark:hidden"
          />
          <StaticImg
            src={DarkHectorLogoLarge}
            alt="Hector Finance"
            className="hidden h-10 w-auto object-contain dark:block"
          />
        </div>
        <Bars
          onClick={() => setIsNavOpen((prev) => !prev)}
          className="mr-3 h-6 w-6 cursor-pointer dark:text-gray-200 sm:hidden"
        />
        {isNavOpen && (
          <SideNav
            closeMenu={() => setIsNavOpen(false)}
            isNavOpen={isNavOpen}
          />
        )}
        <Wallet />
      </div>
      <hr />
    </>
  );
}

const Wallet: VFC = () => {
  const { setProvider } = useProvider();
  const wallet = useWallet();
  const [walletModal, showWalletModal] = useState(false);
  const [autoConnect, setAutoConnect] = useState(false);

  useEffect(() => {
    if (wallet.state === WalletState.Locked && autoConnect) {
      setAutoConnect(false);
      wallet.connect();
    }
  }, [wallet, autoConnect]);

  return (
    <>
      {walletModal && (
        <WalletProtocolModal
          onClose={() => showWalletModal(false)}
          onSelect={async (protocol) => {
            showWalletModal(false);

            let newProvider: Eip1193.WalletProvider | undefined;
            switch (protocol) {
              case ProviderProtocol.Eip1193:
                newProvider = await Eip1193.getProvider();
                break;
              case ProviderProtocol.WalletConnect:
                newProvider = await WalletConnect.getProvider();
                break;
              case ProviderProtocol.Disconnect:
                newProvider = undefined;
                break;
              default:
                assertNever(protocol);
            }

            setProvider(newProvider);
            setAutoConnect(true);
            setPreferredProtocol(protocol);
          }}
        />
      )}
      <div className="flex items-center gap-3">
        {wallet.state === WalletState.Missing && (
          <button
            className="rounded bg-orange-400 px-6 py-2 font-medium text-white"
            onClick={() => showWalletModal(true)}
          >
            Choose Wallet
          </button>
        )}
        {wallet.state === WalletState.Locked && (
          <button
            className="h-10 rounded bg-orange-400 px-6 font-medium text-white"
            onClick={() => wallet.connect()}
          >
            Connect
          </button>
        )}
        {wallet.connected && (
          <button
            className="flex h-10 items-center gap-2 rounded bg-gray-100 px-4 text-gray-500 dark:bg-gray-700 dark:text-gray-200  dark:hover:text-gray-100"
            onClick={() => wallet.changeAccounts()}
            title="Change account"
          >
            <WalletRegular className="h-4 w-4" />
            {ellipsisBetween(4, 4, wallet.address.slice(2))}
          </button>
        )}
        {wallet.state !== WalletState.Missing && (
          <button
            onClick={() => showWalletModal(true)}
            className="flex h-10 items-center gap-2 rounded bg-gray-100 px-4 text-gray-500 dark:bg-gray-700 dark:text-gray-200  dark:hover:text-gray-100"
            title="Change wallet"
          >
            <LayersRegular className="h-4 w-4" />
          </button>
        )}
      </div>
    </>
  );
};

export const SideNav: VFC<{ isNavOpen?: boolean; closeMenu?: () => void }> = ({
  isNavOpen,
  closeMenu,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [theme, toggleTheme] = useTheme();

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
        "  h-fit flex-shrink-0 flex-grow-0 space-y-4 sm:block",
        isNavOpen
          ? " fixed top-0 left-0 z-10 h-full w-3/5 border-r-4 border-r-gray-400 bg-white px-4 py-8 drop-shadow-xl dark:border-r-gray-200 dark:bg-gray-900"
          : "hidden",
      )}
    >
      {isNavOpen && (
        <StaticImg
          src={theme === "dark" ? DarkHectorLogoLarge : LightHectorLogoLarge}
          alt="Hector Finance"
          className=" h-8 w-auto object-contain sm:block"
        />
      )}
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
        <InternalNav href="/exchange">
          <ScaleBalancedLight width={16} height={16} />
          DEX
        </InternalNav>
        <InternalNav href="/bridge">
          <BridgeLight width={16} height={16} />
          Bridge
        </InternalNav>
        <InternalNav href="/farm">
          <SeedlingLight width={16} height={16} />
          Farm
        </InternalNav>
        <InternalNav href="/mint">
          <Tor width={16} height={16} />
          Mint
        </InternalNav>

        {/* <InternalNav href="/calculator">
          <AbacusLight width={16} height={16} />
          Calculator
        </InternalNav> */}
      </div>
      <Divider />
      <div>
        <ExternalNav href="https://hectorinstitute.com">
          <BuildingColumnsLight width={16} height={16} />
          Hector Institute
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
      <div>
        <button
          onClick={() => toggleTheme()}
          className="group -mx-3 box-content flex w-full items-center gap-2 rounded px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
        >
          <SunLight height={16} width={16} />
          Toggle theme
        </button>
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
      <div className="-mx-3 flex cursor-not-allowed items-center gap-2 rounded px-3 py-2 text-gray-600 opacity-40 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100">
        {children}
      </div>
    ) : (
      <Link href={href}>
        <a className="-mx-3 flex items-center gap-2 rounded px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100">
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
    className="group -mx-3 flex items-center gap-2 rounded px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
  >
    {children}
    <ArrowUpRightFromSquareRegular
      width={12}
      height={12}
      className="text-gray-300 group-hover:text-gray-500"
    />
  </a>
);

const SocialNav: FC<{ href: string; title: string }> = ({
  children,
  title,
  href,
}) => (
  <a
    target={"_blank"}
    rel={"noreferrer"}
    href={href}
    title={title}
    className="rounded p-3 text-gray-400 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100"
  >
    {children}
  </a>
);

const Divider: VFC = () => <hr className="border-t border-gray-300" />;
