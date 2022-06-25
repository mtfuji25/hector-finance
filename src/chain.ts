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
  rpc: [string, ...string[]];
  explorers: [string, ...string[]];
  logo: StaticImageData;
  /**
   * This is a rough estimate of the chain's block time in milliseconds.
   * You should use this when polling the blockchain for changes.
   */
  // TODO: Block times can vary based on chain and congestion.
  // Polling could be made more efficient if the `BLOCK_TIME` was
  // dynamically updated. There's no reason to poll more often than
  // the blocks are actually produced.
  millisPerBlock: number;

  token: {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    logo: string;
  };
};

export const AVALANCHE: Chain = {
  id: 0xa86a,
  shortName: "Avalanche",
  longName: "Avalanche C-Chain",
  color: "#E84142",
  rpc: ["https://api.avax.network/ext/bc/C/rpc"],
  explorers: ["https://snowtrace.io"],
  token: {
    name: "Avalanche",
    symbol: "AVAX",
    address: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
    logo: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
    decimals: 18,
  },
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
  explorers: ["https://bscscan.com"],
  token: {
    name: "BNB",
    symbol: "BNB",
    logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png?1644979850",
    address: "BNB",
    decimals: 18,
  },
  logo: BinanceLogo,
  millisPerBlock: 3_500,
};

export const ETHEREUM: Chain = {
  id: 0x1,
  shortName: "Ethereum",
  longName: "Ethereum",
  color: "#627EEA",
  rpc: ["https://cloudflare-eth.com", "https://main-rpc.linkpool.io"],
  explorers: ["https://etherscan.io"],
  token: {
    name: "Ethereum",
    symbol: "ETH",
    logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
  },
  logo: EthereumLogo,
  millisPerBlock: 15_000,
};

export const FANTOM: Chain = {
  id: 0xfa,
  shortName: "Fantom",
  longName: "Fantom Opera",
  color: "#1969FF",
  rpc: ["https://rpc.ftm.tools/"],
  explorers: ["https://ftmscan.com"],
  token: {
    name: "Fantom",
    symbol: "FTM",
    logo: "https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558015016",
    address: "0x4e15361fd6b4bb609fa63c81a2be19d873717870",
    decimals: 18,
  },
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
  explorers: ["https://moonriver.moonscan.io"],
  token: {
    name: "Moonriver",
    logo: "https://assets.coingecko.com/coins/images/17984/small/9285.png?1630028620",
    symbol: "MOVR",
    address: "0x98878b06940ae243284ca214f92bb71a2b032b8a",
    decimals: 18,
  },
  logo: MoonriverLogo,
  millisPerBlock: 15_000,
};

export const POLYGON: Chain = {
  id: 0x89,
  shortName: "Polygon",
  longName: "Polygon",
  color: "#8247E5",
  rpc: ["https://polygon-rpc.com/", "https://rpc-mainnet.matic.network"],
  explorers: ["https://polygonscan.com"],
  token: {
    name: "Polygon",
    logo: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
    symbol: "MATIC",
    address: "0x0000000000000000000000000000000000001010",
    decimals: 18,
  },
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

export async function request(
  chain: Chain,
  args: {
    method: string;
    params?: unknown[] | object;
  },
): Promise<unknown> {
  const response = await fetch(chain.rpc[0], {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 800000000085, // we don't use id, so it can be anything
      method: args.method,
      params: args.params,
    }),
  });
  const body = await response.json();
  if (body.error) {
    throw body.error;
  }
  return body.result;
}
