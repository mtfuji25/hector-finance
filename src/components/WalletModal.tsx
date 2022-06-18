import { FC, VFC } from "react";
import { Modal, ModalCloseButton } from "./Modal";
import { StaticImageData } from "next/image";
import BitkeepLogo from "public/wallet/bitkeep.svg";
import Coin98Logo from "public/wallet/coin98.svg";
import CoinbaseLogo from "public/wallet/coinbase.svg";
import MetamaskLogo from "public/wallet/metamask.svg";
import TrustWalletLogo from "public/wallet/trustwallet.svg";
import WalletConnectLogo from "public/wallet/walletconnect.svg";
import { StaticImg } from "./StaticImg";
import { ProviderProtocol } from "./Provider";
import SteakLogo from "public/wallet/steak.png";
import RainbowLogo from "public/wallet/rainbow.png";
import GnosisLogo from "public/wallet/gnosis.svg";

export type WalletInfo = {
  name: string;
  icon: StaticImageData;
  download: string;
};

export const EIP1193_WALLETS: WalletInfo[] = [
  {
    name: "MetaMask",
    icon: MetamaskLogo,
    download: "https://metamask.io/download/",
  },
  {
    name: "Coinbase",
    icon: CoinbaseLogo,
    download: "https://www.coinbase.com/wallet",
  },
  {
    name: "Trust Wallet",
    icon: TrustWalletLogo,
    download: "https://trustwallet.com/",
  },
  {
    name: "Bitkeep",
    icon: BitkeepLogo,
    download: "https://bitkeep.com/",
  },
  {
    name: "Coin98",
    icon: Coin98Logo,
    download: "https://coin98.com/",
  },
];

export const WC_WALLETS: WalletInfo[] = [
  {
    name: "WalletConnect",
    icon: WalletConnectLogo,
    download: "https://walletconnect.com/",
  },
  {
    name: "Steak Wallet",
    icon: SteakLogo,
    download: "https://steakwallet.fi/",
  },
  {
    name: "Rainbow Wallet",
    icon: RainbowLogo,
    download: "https://rainbow.me/",
  },
  {
    name: "Gnosis Wallet",
    icon: GnosisLogo,
    download: "https://gnosis-safe.io/",
  },
];

export const WalletProtocolModal: VFC<{
  onClose: () => void;
  onSelect: (protocol: ProviderProtocol) => void;
}> = ({ onClose, onSelect }) => (
  <Modal onClose={onClose} className="max-w-md bg-white">
    <div className="space-y-5 p-6">
      <div className="text-lg">Connect a wallet</div>
      <div className="space-y-6">
        <ProtocolOption onClick={() => onSelect(ProviderProtocol.Eip1193)}>
          <div>
            <span className="text-t font-bold">Ethereum Wallet</span>{" "}
            <span className="opacity-50">(recommended)</span>
          </div>
          <div>
            Connect to your wallet directly, using the Ethereum wallet protocol.
            Supported by most browser extensions and mobile apps.
          </div>
          <div className="flex gap-3">
            {EIP1193_WALLETS.map((wallet) => (
              <StaticImg
                key={wallet.name}
                src={wallet.icon}
                alt={wallet.name}
                className="h-6 w-auto object-contain"
              />
            ))}
          </div>
        </ProtocolOption>
        <ProtocolOption
          onClick={() => onSelect(ProviderProtocol.WalletConnect)}
        >
          <div className="text-t font-bold">WalletConnect Wallet</div>
          <div>
            Connect to your wallet over the internet. WalletConnect offers
            limited functionality. Use only when necessary.
          </div>
          <div className="flex gap-3">
            {WC_WALLETS.map((wallet) => (
              <StaticImg
                key={wallet.name}
                src={wallet.icon}
                alt={wallet.name}
                className="h-6 w-auto object-contain"
              />
            ))}
          </div>
        </ProtocolOption>
      </div>
    </div>
    <ModalCloseButton onClick={onClose} />
  </Modal>
);

const ProtocolOption: FC<{ onClick: () => void }> = ({ children, onClick }) => (
  <button
    className="block w-full space-y-4 rounded bg-gray-100 p-6 text-left hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500"
    onClick={onClick}
  >
    {children}
  </button>
);
