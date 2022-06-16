import { VFC } from "react";
import { Modal, ModalCloseButton } from "./Modal";
import { StaticImageData } from "next/image";
import BitkeepSvg from "public/wallet/bitkeep.svg";
import Coin98Svg from "public/wallet/coin98.svg";
import CoinbaseSvg from "public/wallet/coinbase.svg";
import MetamaskSvg from "public/wallet/metamask.svg";
import TrustSvg from "public/wallet/trustwallet.svg";
import WalletConnectSvg from "public/wallet/walletconnect.svg";
import { StaticImg } from "./StaticImg";

type Wallet = {
  name: string;
  icon: StaticImageData;
  download: string;
};

const wallets: Wallet[] = [
  {
    name: "MetaMask",
    icon: MetamaskSvg,
    download: "https://metamask.io/download/",
  },
  {
    name: "Coinbase",
    icon: CoinbaseSvg,
    download: "https://www.coinbase.com/wallet",
  },
  {
    name: "Trust Wallet",
    icon: TrustSvg,
    download: "https://trustwallet.com/",
  },
  { name: "Bitkeep", icon: BitkeepSvg, download: "https://bitkeep.com/" },
  { name: "Coin98", icon: Coin98Svg, download: "https://coin98.com/" },
];

export const WalletModal: VFC<{
  onClose: () => void;
  onConnect: (wallet: Wallet) => void;
}> = ({ onClose, onConnect }) => (
  <Modal onClose={onClose} className="max-w-sm bg-white">
    <div className="space-y-5 p-5">
      <div className="text-lg">Connect a wallet</div>
      <div className="space-y-2.5">
        {wallets.map((wallet) => (
          <button
            onClick={() => onConnect(wallet)}
            className="flex w-full items-center rounded bg-gray-100 p-4 px-5 hover:bg-gray-200"
            key={wallet.name}
          >
            <div className="flex-shrink-0 flex-grow text-left">
              {wallet.name}
            </div>
            <StaticImg
              src={wallet.icon}
              alt=""
              className="object-fit h-6 w-6 flex-shrink"
            />
          </button>
        ))}
      </div>
    </div>
    <ModalCloseButton onClick={onClose} />
  </Modal>
);
