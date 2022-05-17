import { StaticImageData } from "next/image";
import AvalancheLogo from "/public/chains/avalanche.svg";
import BinanceLogo from "/public/chains/binance.svg";
import EthereumLogo from "/public/chains/ethereum.svg";
import FantomLogo from "/public/chains/fantom.svg";
import MoonriverLogo from "/public/chains/moonriver.svg";
import PolygonLogo from "/public/chains/polygon.svg";

export type Chain = {
  id: number;
  shortName: string;
  longName: string;
  color: string;
  rpc: string[];
  explorers: string[];
  token: string;
  logo: StaticImageData;
  millisPerBlock: number;
};

export const AVALANCHE: Chain = {
  id: 0xa86a,
  shortName: "Avalanche",
  longName: "Avalanche C-Chain",
  color: "#E84142",
  rpc: ["https://api.avax.network/ext/bc/C/rpc"],
  explorers: ["https://snowtrace.io/"],
  token: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
  logo: AvalancheLogo,
  millisPerBlock: 3_500,
};

export const BINANCE: Chain = {
  id: 0x38,
  shortName: "Binance",
  longName: "Binance Smart Chain",
  color: "#F0B90B",
  rpc: [
    "https://bsc-dataseed1.binance.org",
    "https://bsc-dataseed1.defibit.io/",
  ],
  explorers: ["https://bscscan.com/"],
  token: "BNB",
  logo: BinanceLogo,
  millisPerBlock: 3_500,
};

export const ETHEREUM: Chain = {
  id: 0x1,
  shortName: "Ethereum",
  longName: "Ethereum",
  color: "#627EEA",
  rpc: ["https://cloudflare-eth.com", "https://main-rpc.linkpool.io"],
  explorers: ["https://etherscan.io/"],
  token: "0x0000000000000000000000000000000000000000",
  logo: EthereumLogo,
  millisPerBlock: 15_000,
};

export const FANTOM: Chain = {
  id: 0xfa,
  shortName: "Fantom",
  longName: "Fantom Opera",
  color: "#1969FF",
  rpc: ["https://rpc.ftm.tools"],
  explorers: ["https://ftmscan.com/"],
  token: "0x4e15361fd6b4bb609fa63c81a2be19d873717870",
  logo: FantomLogo,
  millisPerBlock: 2_500,
};

export const MOONRIVER: Chain = {
  id: 0x505,
  shortName: "Moonriver",
  longName: "Moonriver",
  color: "#53CBC9",
  rpc: [
    "https://rpc.moonriver.moonbeam.network",
    "https://moonriver.api.onfinality.io/public",
  ],
  explorers: ["https://moonriver.moonscan.io/"],
  token: "0x98878b06940ae243284ca214f92bb71a2b032b8a",
  logo: MoonriverLogo,
  millisPerBlock: 15_000,
};

export const POLYGON: Chain = {
  id: 0x89,
  shortName: "Polygon",
  longName: "Polygon",
  color: "#8247E5",
  rpc: ["https://polygon-rpc.com/", "https://rpc-mainnet.matic.network"],
  explorers: ["https://polygonscan.com/"],
  token: "0x0000000000000000000000000000000000001010",
  logo: PolygonLogo,
  millisPerBlock: 3_000,
};

export const CHAINS: Chain[] = [
  AVALANCHE,
  BINANCE,
  ETHEREUM,
  FANTOM,
  MOONRIVER,
  POLYGON,
];
