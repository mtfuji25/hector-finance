import { NextApiRequest, NextApiResponse } from "next";
import {
  ChainData,
  CoinInfo,
  DeBankData,
  DebankWallet,
  ProtocolList,
} from "..";
import Cors from "cors";
import Decimal from "decimal.js";

interface Platforms {
  vechain: string;
}

interface Image {
  thumb: string;
  small: string;
  large: string;
}

interface CurrentPrice {
  usd: number;
}

interface MarketData {
  current_price: CurrentPrice;
  total_supply: number;
  max_supply: number;
  circulating_supply: number;
  last_updated: Date;
}

interface CoinGeckoInfo {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: string;
  platforms: Platforms;
  image: Image;
  market_cap_rank: number;
  coingecko_rank: number;
  market_data: MarketData;
  last_updated: Date;
}

interface ManualCoinInfo {
  data: CoinGeckoInfo;
  amount: number;
}

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD"],
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const ACCESS_KEY = "c0d8553d17ccd2c54ddf36e8fe863a0bca47a2b9";

const WALLET_1 = "0x4bfb33d65f4167ebe190145939479227e7bf2cb0";
const TREASURY_WALLET = "0xcb54ea94191b280c296e6ff0e37c7e76ad42dc6a";
const WALLET_2 = "0x677d6ec74fa352d4ef9b1886f6155384acd70d90";
const WALLET_3 = "0x3cdf52cc28d21c5b7b91d7065fd6dfe6d426fcc5";
const WALLET_4 = "0x8a43e670619973944cb573bb23688c24cc0b5131";
const WALLET_5 = "0x078E3977b30955f4Af9AA1D9DeC4ceB660c36e0c";
const FTM_VALIDATOR_1 = "0xBE4b73f5Caff476Ed0Cdb4C043236fce81f4dC6C";
const FTM_VALIDATOR_2 = "0x35796Ce4Ed757075D346c1bc374D67628fadcbB1";

async function getChainTotals(): Promise<ChainData[]> {
  const wallet1TokenAmounts = await fetch(
    `https://pro-openapi.debank.com/v1/user/token_list?id=${WALLET_1}&chain_id=eth&is_all=false&has_balance=true`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet1ProtocolList = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${WALLET_1}&chain_id=eth&`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const TreasuryTokenAmounts = await fetch(
    `https://pro-openapi.debank.com/v1/user/token_list?id=${TREASURY_WALLET}&chain_id=ftm&is_all=false&has_balance=true`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const TreasuryProtocolList = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${TREASURY_WALLET}&chain_id=ftm`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet2TokenAmounts = await fetch(
    `https://pro-openapi.debank.com/v1/user/token_list?id=${WALLET_2}&chain_id=ftm&is_all=false&has_balance=true`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet2ProtocolList = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${WALLET_2}&chain_id=ftm`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet3TokenAmounts = await fetch(
    `https://pro-openapi.debank.com/v1/user/token_list?id=${WALLET_3}&chain_id=bsc&is_all=false&has_balance=true`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet3ProtocolList = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${WALLET_3}&chain_id=bsc`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet4TokenAmounts = await fetch(
    `https://pro-openapi.debank.com/v1/user/token_list?id=${WALLET_4}&chain_id=ftm&is_all=false&has_balance=true`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet4ProtocolList = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${WALLET_4}&chain_id=ftm`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet5TokenAmounts = await fetch(
    `https://pro-openapi.debank.com/v1/user/token_list?id=${WALLET_5}&chain_id=avax&is_all=false&has_balance=true`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet5ProtocolList = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${WALLET_5}&chain_id=avax`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const ftmValidator1 = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${FTM_VALIDATOR_1}&chain_id=ftm`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const ftmValidator2 = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${FTM_VALIDATOR_2}&chain_id=ftm`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  return await Promise.all([
    {
      wallet: TreasuryTokenAmounts,
      protocols: TreasuryProtocolList,
      source: TREASURY_WALLET,
      chain: "ftm",
    },
    {
      wallet: wallet1TokenAmounts,
      protocols: wallet1ProtocolList,
      source: WALLET_1,
      chain: "eth",
    },
    {
      wallet: wallet2TokenAmounts,
      protocols: wallet2ProtocolList,
      source: WALLET_2,
      chain: "ftm",
    },
    {
      wallet: wallet3TokenAmounts,
      protocols: wallet3ProtocolList,
      source: WALLET_3,
      chain: "bsc",
    },
    {
      wallet: wallet4TokenAmounts,
      protocols: wallet4ProtocolList,
      source: WALLET_4,
      chain: "ftm",
    },
    {
      wallet: wallet5TokenAmounts,
      protocols: wallet5ProtocolList,
      source: WALLET_5,
      chain: "avax",
    },
    { protocols: ftmValidator1, source: FTM_VALIDATOR_1, chain: "ftm" },
    { protocols: ftmValidator2, source: FTM_VALIDATOR_2, chain: "ftm" },
  ]);
}

async function getManualCoinInfo(): Promise<ManualCoinInfo[]> {
  const getVechainInfo: CoinGeckoInfo = await fetch(
    "https://api.coingecko.com/api/v3/coins/vechain?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
  ).then((res) => res.json());
  const getBtcInfo: CoinGeckoInfo = await fetch(
    "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
  ).then((res) => res.json());
  const getElrondInfo: CoinGeckoInfo = await fetch(
    "https://api.coingecko.com/api/v3/coins/elrond-erd-2?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
  ).then((res) => res.json());
  const getNearInfo: CoinGeckoInfo = await fetch(
    "https://api.coingecko.com/api/v3/coins/near?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
  ).then((res) => res.json());
  const getHarmonyInfo: CoinGeckoInfo = await fetch(
    "https://api.coingecko.com/api/v3/coins/harmony?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
  ).then((res) => res.json());
  const getHederaInfo: CoinGeckoInfo = await fetch(
    "https://api.coingecko.com/api/v3/coins/hedera-hashgraph?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
  ).then((res) => res.json());
  const getAlgoInfo: CoinGeckoInfo = await fetch(
    "https://api.coingecko.com/api/v3/coins/algorand?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
  ).then((res) => res.json());
  const getStellarInfo: CoinGeckoInfo = await fetch(
    "https://api.coingecko.com/api/v3/coins/stellar?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
  ).then((res) => res.json());
  const getAVAInfo: CoinGeckoInfo = await fetch(
    "https://api.coingecko.com/api/v3/coins/concierge-io?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
  ).then((res) => res.json());
  const getLQDRInfo: CoinGeckoInfo = await fetch(
    "https://api.coingecko.com/api/v3/coins/liquiddriver?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
  ).then((res) => res.json());
  const getACHInfo: CoinGeckoInfo = await fetch(
    "https://api.coingecko.com/api/v3/coins/alchemy-pay?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
  ).then((res) => res.json());
  const getDOTInfo: CoinGeckoInfo = await fetch(
    "https://api.coingecko.com/api/v3/coins/polkadot?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
  ).then((res) => res.json());
  return Promise.all([
    { data: getVechainInfo, amount: 50729817 },
    { data: getBtcInfo, amount: 26 },
    { data: getElrondInfo, amount: 18881 },
    { data: getNearInfo, amount: 59566 },
    { data: getHarmonyInfo, amount: 4503992 },
    { data: getHederaInfo, amount: 2122976 },
    { data: getAlgoInfo, amount: 682032 },
    { data: getStellarInfo, amount: 1279540 },
    { data: getAVAInfo, amount: 140334 },
    { data: getLQDRInfo, amount: 35484 },
    { data: getACHInfo, amount: 8673963 },
    { data: getDOTInfo, amount: 9676 },
  ]);
}

let data: ChainData[];
let manualCoins: ManualCoinInfo[];
setInterval(async () => {
  manualCoins = await getManualCoinInfo();
  await getChainTotals().then((repsonse) => {
    data = [...repsonse, ...getFormattedCoins(manualCoins)];
  });
}, 43200000);

function getTreasuryInfo(data: ChainData[]): DeBankData {
  let treasuryVal = 0;
  let walletAssets: CoinInfo[] = [];
  let protocols: ProtocolList[] = [];
  data.forEach((deBank) => {
    if (deBank.wallet) {
      const coins: CoinInfo[] = deBank.wallet
        .filter((asset) => asset.amount > 1)
        .map((asset) => {
          const coinAmount = asset.amount * asset.price;
          const tokenAmount = new Decimal(asset.raw_amount).div(
            10 ** asset.decimals,
          );
          treasuryVal += coinAmount;
          const existingCoinIndex = walletAssets.findIndex(
            (coin) => asset.symbol === coin.ticker,
          );
          if (existingCoinIndex >= 0) {
            walletAssets[existingCoinIndex]!.amount += asset.amount;
            walletAssets[existingCoinIndex]!.tokenAmount =
              walletAssets[existingCoinIndex]!.tokenAmount.plus(tokenAmount);
            return {} as CoinInfo;
          }
          return {
            amount: coinAmount,
            tokenAmount,
            decimal: asset.decimals,
            name: asset.name,
            ticker: asset.symbol,
            logo: asset.logo_url,
            chain: asset.chain,
          };
        });
      walletAssets.push(...coins.filter((coin) => coin.amount));
    }
    if (deBank.protocols) {
      protocols.push(
        ...deBank.protocols.map((protocol) => {
          // if (protocol.id === "ftm_beefy") {
          //   const tempData = protocol.portfolio_item_list.find(
          //     (item) => item.pool_id === "temp",
          //   );
          //   if (!tempData) {
          //     protocol.portfolio_item_list.push({
          //       detail: { supply_token_list: [] },
          //       detail_types: [""],
          //       name: "yield",
          //       pool_id: "temp",
          //       proxy_detail: {},
          //       stats: {
          //         asset_usd_value: 18240000,
          //         debt_usd_value: 0,
          //         net_usd_value: 18240000,
          //       },
          //       update_at: 0,
          //     });
          //   }
          // }
          return {
            ...protocol,
            source: deBank.source,
          };
        }),
      );
      deBank.protocols.forEach((protocol) => {
        const totalVal = protocol.portfolio_item_list.reduce(
          (partialSum, a) =>
            a.stats.asset_usd_value > 1
              ? partialSum + a.stats.asset_usd_value
              : partialSum,
          0,
        );
        treasuryVal += totalVal;
      });
    }
  });

  return { treasuryVal, walletAssets, protocols };
}

function getFormattedCoins(manualCoins: ManualCoinInfo[]): ChainData[] {
  return manualCoins.map(
    (coin) =>
      ({
        protocols: [],
        source: "",
        chain: "",
        wallet: [
          {
            id: coin.data.id,
            chain: "ftm",
            name: coin.data.name,
            symbol: coin.data.symbol,
            display_symbol: coin.data.symbol,
            optimized_symbol: coin.data.symbol,
            decimals: 0,
            logo_url: coin.data.image.small,
            protocol_id: coin.data.id,
            price: coin.data.market_data.current_price.usd,
            amount: coin.amount,
            raw_amount: coin.amount,
          },
        ],
      } as ChainData),
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Run the middleware
  await runMiddleware(req, res, cors);
  if (!data) {
    await getManualCoinInfo()
      .then((repsonse) => (manualCoins = repsonse))
      .catch(() =>
        res.status(500).json({ error: "Failed to get coin gecko info" }),
      );

    await getChainTotals()
      .then((repsonse) => {
        data = [...repsonse, ...getFormattedCoins(manualCoins)];
      })
      .catch(() =>
        res.status(500).json({ error: "Failed to get Debank data" }),
      );
  }
  if (data && manualCoins) {
    res.send(getTreasuryInfo(data));
  }
}
