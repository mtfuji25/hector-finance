import Decimal from "decimal.js";
import Head from "next/head";
import React, { FC, useEffect, useState, VFC } from "react";
import {
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tab, Tabs } from "src/components/Tab";
import {
  ETH_GRAPH_URL,
  FANTOM_ADDRESS,
  FANTOM_DAI,
  FANTOM_HEC,
  FANTOM_USDC,
  GRAPH_DATA,
  ProtocolMetrics,
  SubgraphData,
  THE_GRAPH_URL,
} from "src/constants";
import { getTotalSupply } from "src/contracts/erc20";
import { getHecBurned } from "src/contracts/hecBurnContract";
import { getStakingIndex } from "src/contracts/stakingContract";
import { getMarketPrice } from "src/contracts/uniswapV2";
import { classes, ellipsisBetween, formatCurrency } from "src/util";
import treasury from "src/icons/treasury.svgr";
import buyback from "src/icons/buyback.svgr";
import Link from "src/icons/link.svgr";
import Info from "src/icons/circle-info.svgr";
import ftmLogo from "public/icons/ftm.svg";
import daiLogo from "public/icons/dai.svg";
import hectorLogo from "public/icons/hector.svg";
import usdcLogo from "public/icons/usdc.svg";
import curveLogo from "public/icons/curve.webp";
import ethLogo from "public/icons/eth.svg";
import binanceLogo from "public/icons/binance.svg";
import wftmLogo from "public/icons/wftm.svg";
import { StaticImg } from "src/components/StaticImg";
import { Chain, FANTOM } from "src/chain";
import BigSpinner from "src/icons/spinner-big.svgr";
import { DappPage } from "src/components/DappPage";

export interface DeBankData {
  treasuryVal: number;
  walletAssets: CoinInfo[];
  protocols: ProtocolList[];
}

export interface CoinInfo {
  name: string;
  ticker: string;
  amount: number;
  tokenAmount: Decimal;
  decimal: number;
  logo: string;
  chain: string;
}

export interface Transaction {
  type: "Buyback-Burn" | "Investment" | "Marketing";
  title: string;
  investments: Investment;
}

interface Investment {
  tokenDetails: TokenDetail[];
  transactionLinks: string[];
  transactionDate: string;
  investedAmount: string;
}
export interface TokenDetail {
  token: string;
  ticker: string;
  logo?: string | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  buyBack: string;
  price: string;
  burn: string;
}

export interface FTMScanTransaction {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  nonce: string;
  timeStamp: string;
  to: string;
  tokenDecimal: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
  value: string;
}

export interface ChainData {
  wallet?: DebankWallet[];
  protocols: ProtocolList[];
  source: string;
  chain: string;
}

export interface DebankWallet {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  display_symbol?: any;
  optimized_symbol: string;
  decimals: number;
  logo_url: string;
  protocol_id: string;
  price: number;
  is_verified?: boolean;
  is_core?: boolean;
  is_wallet?: boolean;
  time_at?: number;
  amount: number;
  raw_amount: number;
  raw_amount_hex_str?: string;
}

interface Stats {
  asset_usd_value: number;
  debt_usd_value: number;
  net_usd_value: number;
}

interface SupplyTokenList {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  display_symbol?: any;
  optimized_symbol: string;
  decimals: number;
  logo_url: string;
  protocol_id: string;
  price: number;
  is_verified: boolean;
  is_core: boolean;
  is_wallet: boolean;
  time_at: number;
  amount: number;
}

export interface RewardTokenList {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  display_symbol?: any;
  optimized_symbol: string;
  decimals: number;
  logo_url: string;
  protocol_id: string;
  price: number;
  is_verified: boolean;
  is_core: boolean;
  is_wallet: boolean;
  time_at?: any;
  amount: number;
}

export interface BorrowTokenList {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  display_symbol?: any;
  optimized_symbol: string;
  decimals: number;
  logo_url: string;
  protocol_id: string;
  price: number;
  is_verified: boolean;
  is_core: boolean;
  is_wallet: boolean;
  time_at: number;
  amount: number;
}

interface Detail {
  supply_token_list?: SupplyTokenList[];
  reward_token_list?: RewardTokenList[];
  borrow_token_list?: BorrowTokenList[];
}

interface ProxyDetail {}

interface PortfolioItemList {
  stats: Stats;
  update_at: number;
  name: string;
  detail_types: string[];
  detail: Detail;
  proxy_detail: ProxyDetail;
  pool_id: string;
}

export interface ProtocolList {
  id: string;
  chain: string;
  name: string;
  site_url: string;
  logo_url: string;
  has_supported_portfolio: boolean;
  tvl: number;
  portfolio_item_list: PortfolioItemList[];
  source: string;
}

export default function DashBoard() {
  const [view, setView] = useState<string>("graph");
  const [marketCap, setMarketCap] = useState<Decimal>();
  const [marketPrice, setMarketPrice] = useState<Decimal>();
  const [circSupply, setCircSupply] = useState<Decimal>();
  const [totalSupply, setTotalSupply] = useState<Decimal>();
  const [hecBurned, setHecBurned] = useState<Decimal>();
  const [treasuryValue, setTreasuryValue] = useState<Decimal>();
  const [graphData, setGraphData] = useState<ProtocolMetrics[]>();
  const [currentIndex, setCurrentIndex] = useState<Decimal>();
  const [investmentsData, setInvestmentsData] = useState<CoinInfo[]>();
  const [protocolData, setProtocolData] = useState<ProtocolList[]>();
  const [deBankData, setDeBankData] = useState<DeBankData>();
  const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>(
    [],
  );
  const [hasTransactionsData, setHasTransactionData] = useState<boolean>(false);

  const getRunway = (sHec: number, rfv: number, rebase: number) => {
    let runwayCurrent: string = "";

    if (sHec > 0 && rfv > 0 && rebase > 0) {
      let treasury_runway = parseFloat((rfv / sHec).toString());

      let nextEpochRebase_number = parseFloat(rebase.toString()) / 100;
      let runwayCurrent_num =
        Math.log(treasury_runway) / Math.log(1 + nextEpochRebase_number) / 3;

      runwayCurrent = runwayCurrent_num.toString();
    }

    return runwayCurrent;
  };

  useEffect(() => {
    if (!deBankData) {
      (async () => {
        const res = await fetch("https://app.hector.finance/api/debank");
        if (res.status === 500) {
          console.error(res.statusText);
        }
        const results: DeBankData = await res.json();
        setDeBankData(results);
        setProtocolData(results.protocols);
        setTreasuryValue(new Decimal(results.treasuryVal));
        setInvestmentsData(
          results.walletAssets.sort((a, b) => b.amount - a.amount),
        );
      })();
    }
  }, [deBankData]);

  useEffect(() => {
    const getGraphData: Promise<SubgraphData> = fetch(THE_GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GRAPH_DATA,
      }),
    })
      .then((res) => res.json())
      .then((grph) => grph.data);
    const getEthData: Promise<SubgraphEthData[]> = fetch(ETH_GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: ETH_QUERY,
      }),
    })
      .then((res) => res.json())
      .then((grph) => grph.data.ethMetrics);

    const loadDashboardInfo = async () => {
      const [
        graphData,
        marketPrice,
        hecBurnedAmount,
        totalSupply,
        ethData,
        index,
      ] = await Promise.all([
        getGraphData,
        getMarketPrice(FANTOM),
        getHecBurned(FANTOM),
        getTotalSupply(FANTOM, FANTOM_HEC),
        getEthData,
        getStakingIndex(FANTOM),
      ]);
      if (index.isOk) {
        setCurrentIndex(new Decimal(index.value).div(FANTOM_HEC.wei));
      }

      if (totalSupply.isOk) {
        setTotalSupply(totalSupply.value);
      }
      if (hecBurnedAmount.isOk) {
        setHecBurned(hecBurnedAmount.value);
      }
      if (marketPrice.isOk && graphData && ethData) {
        // we might not need graph for this and can use contract
        const circSupply = new Decimal(
          graphData.protocolMetrics[0]!.hecCirculatingSupply,
        );

        const joinedGraphData = graphData.protocolMetrics.map((entry, i) => {
          const bankTotal = (
            +entry.bankBorrowed + +entry.bankSupplied
          ).toString();
          const torTimeStamp = 1642857253;
          let data: ProtocolMetrics = {
            ...entry,
            bankTotal,
            torTVL: (+entry.timestamp > torTimeStamp
              ? graphData.tors[i]!?.torTVL
              : 0
            ).toString(),
            treasuryBaseRewardPool: "0",
            staked: (
              (parseFloat(entry.sHecCirculatingSupply) /
                parseFloat(entry.hecCirculatingSupply)) *
              100
            ).toString(),
          };
          if (i < ethData?.length) {
            const riskFreeValue =
              +entry.treasuryRiskFreeValue +
              +ethData[i]!.treasuryBaseRewardPool;
            data = {
              ...data,
              treasuryBaseRewardPool: (
                +ethData[i]!.treasuryBaseRewardPool + +entry.treasuryInvestments
              ).toString(),
              runwayCurrent: getRunway(
                +entry.sHecCirculatingSupply,
                +riskFreeValue,
                +entry.nextEpochRebase,
              ),
              treasuryMaticBalance: ethData[i]!.treasuryMaticBalance,
              treasuryIlluviumBalance: ethData[i]!.treasuryIlluviumBalance,
              treasuryRFMaticBalance: (
                +ethData[i]!.treasuryMaticBalance * 0.5
              ).toString(),
              treasuryRFIlluviumBalance: (
                +ethData[i]!.treasuryIlluviumBalance * 0.5
              ).toString(),
              illuviumTokenAmount: ethData[i]!.illuviumTokenAmount,
            };
          }
          return data as ProtocolMetrics;
        });
        setGraphData(joinedGraphData);
        setCircSupply(circSupply);
        setMarketCap(marketPrice.value.times(circSupply).div(FANTOM_HEC.wei));
        setMarketPrice(marketPrice.value.div(FANTOM_HEC.wei));
      }
    };
    loadDashboardInfo();
  }, []);

  useEffect(() => {
    const getHecBurnTransactions = fetch(
      `https://api.ftmscan.com/api?module=account&action=tokentx&address=${FANTOM_ADDRESS.HEC_BURN_ALLOCATOR}&startblock=0&endblock=99999999&sort=desc&apikey=HEB98UTKTRQYD7R4UG383BNGJZ82B4M1E8`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => res.json());
    const getOldHecBurnTransactions = fetch(
      `https://api.ftmscan.com/api?module=account&action=tokentx&address=${FANTOM_ADDRESS.OLD_HEC_BURN_ALLOCATOR}&startblock=0&endblock=99999999&sort=desc&apikey=HEB98UTKTRQYD7R4UG383BNGJZ82B4M1E8`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => res.json());
    const getDaoBuybackTxs = fetch(
      `https://api.ftmscan.com/api?module=account&action=tokentx&address=${FANTOM_ADDRESS.DAO_WALLET}&startblock=40511244&endblock=99999999&sort=desc&apikey=HEB98UTKTRQYD7R4UG383BNGJZ82B4M1E8`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => res.json());
    const getManualBuybackTxs = fetch(
      `https://api.ftmscan.com/api?module=account&action=tokentx&address=0xa3529B2168771aF08d1F74f907F1aA9eb367A134&startblock=42616573&endblock=99999999&sort=desc&apikey=HEB98UTKTRQYD7R4UG383BNGJZ82B4M1E8`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => res.json());
    const getManualBuybackTxs2 = fetch(
      `https://api.ftmscan.com/api?module=account&action=tokentx&address=0x8a43e670619973944cb573bb23688c24cc0b5131&startblock=42523557&endblock=99999999&sort=desc&apikey=HEB98UTKTRQYD7R4UG383BNGJZ82B4M1E8`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => res.json());
    async function getTransactionData() {
      const [
        transactions,
        oldTransactions,
        buyBackTransactions,
        manualBuybackTxs,
        manualBuybackTxs2,
      ] = await Promise.all([
        getHecBurnTransactions,
        getOldHecBurnTransactions,
        getDaoBuybackTxs,
        getManualBuybackTxs,
        getManualBuybackTxs2,
      ]);
      const hecburnData: FTMScanTransaction[] = transactions.result;
      const oldHecburnData: FTMScanTransaction[] = oldTransactions.result;
      const daoBuybackData: FTMScanTransaction[] = buyBackTransactions.result;
      const manualBuybackData: FTMScanTransaction[] = manualBuybackTxs.result;
      const manualBuybacksData2: FTMScanTransaction[] =
        manualBuybackTxs2.result;

      const uniqueBlocks = Array.from(
        new Set(hecburnData.map((transactions) => transactions.blockNumber)),
      );
      const oldUniqueBlocks = Array.from(
        new Set(oldHecburnData.map((transactions) => transactions.blockNumber)),
      );
      const daoUniqueBlocks = Array.from(
        new Set(daoBuybackData.map((transactions) => transactions.blockNumber)),
      );
      const manualUniqueBlocks = Array.from(
        new Set(
          manualBuybackData.map((transactions) => transactions.blockNumber),
        ),
      );
      const manualUniqueBlocks2 = Array.from(
        new Set(
          manualBuybacksData2.map((transactions) => transactions.blockNumber),
        ),
      );
      const groupedData = uniqueBlocks.map((blockNumber) =>
        hecburnData.filter(
          (transaction) => transaction.blockNumber === blockNumber,
        ),
      );
      const oldGroupedData = oldUniqueBlocks.map((blockNumber) =>
        oldHecburnData.filter(
          (transaction) => transaction.blockNumber === blockNumber,
        ),
      );
      const daoGroupedData = getGroupedData(daoUniqueBlocks, daoBuybackData);
      const manualData = getGroupedData(manualUniqueBlocks, manualBuybackData);
      const manual2Data = getGroupedData(
        manualUniqueBlocks2,
        manualBuybacksData2,
      );
      formatFTMScanData([
        ...groupedData,
        ...oldGroupedData,
        ...daoGroupedData,
        ...manualData,
        ...manual2Data,
      ]);
    }

    const getGroupedData = (
      uniqueBlocks: string[],
      buyBackData: FTMScanTransaction[],
    ) => {
      return uniqueBlocks
        .map((blockNumber) => {
          const hasMoreTransactions = buyBackData.some(
            (data) =>
              data.blockNumber === blockNumber && data.tokenSymbol === "TOR",
          );
          if (hasMoreTransactions) {
            return [];
          }
          return buyBackData.filter(
            (transaction) =>
              transaction.blockNumber === blockNumber &&
              (transaction?.tokenSymbol === "HEC" ||
                transaction?.tokenSymbol === "DAI"),
          );
        })
        .filter((group) => group.length === 2);
    };

    const getTokens = (data: FTMScanTransaction[]): TokenDetail[] => {
      return data
        .filter(
          (transaction, i, arr) =>
            arr.findIndex(
              (item) => item.tokenSymbol === transaction.tokenSymbol,
            ) === i,
        )
        .map(
          (transaction) =>
            ({
              token: transaction.tokenName,
              ticker: transaction.tokenSymbol,
              price: transaction.value,
            } as TokenDetail),
        );
    };

    const getInvestedAmount = (transGroup: FTMScanTransaction[]): string => {
      const daiVal = transGroup.find(
        (item) => item.tokenSymbol === "DAI",
      )?.value;
      const usdcVal = transGroup.find(
        (item) => item.tokenSymbol === "USDC",
      )?.value;
      if (!daiVal && !usdcVal) {
        return "0";
      }
      if (transGroup.length > 4 && daiVal) {
        return new Decimal(daiVal).div(FANTOM_DAI.wei).times(2).toString();
      }
      if (transGroup.length > 4 && usdcVal) {
        return new Decimal(usdcVal).div(FANTOM_USDC.wei).times(2).toString();
      }
      if (daiVal) {
        return new Decimal(daiVal).div(FANTOM_DAI.wei).toString();
      }
      if (usdcVal) {
        return new Decimal(usdcVal).div(FANTOM_USDC.wei).toString();
      } else {
        return "0";
      }
    };

    const formatFTMScanData = (groupedData: FTMScanTransaction[][]) => {
      const ftmScantransactions: Transaction[] = groupedData.map((trans, i) => {
        return {
          title: trans.length > 2 ? "Buyback and Burn" : "Buyback",
          type: "Buyback-Burn",
          investments: {
            tokenDetails: getTokens(groupedData[i]!),
            transactionLinks: [`https://ftmscan.com/tx/${trans[0]!.hash}`],
            transactionDate: new Date(
              +trans[0]!?.timeStamp * 1000,
            ).toLocaleString("en-US"),
            investedAmount: getInvestedAmount(trans),
          },
        };
      });

      const sortedData = [...ftmScantransactions].sort((a, b) => {
        return (
          new Date(b.investments.transactionDate).getTime() -
          new Date(a.investments.transactionDate).getTime()
        );
      });
      setSortedTransactions(sortedData);
      setHasTransactionData(true);
    };
    getTransactionData();

    setView(localStorage.getItem("dash") ?? "graph");
  }, []);
  useEffect(() => localStorage.setItem("dash", view), [view]);

  return (
    <DappPage>
      <main className="w-full space-y-6">
        <Head>
          <title>Dashboard — Hector Finance</title>
        </Head>
        <Tabs>
          <Tab
            label="Graphs"
            selected={view === "graph"}
            onSelect={() => {
              setView("graph");
            }}
          />
          <Tab
            label="Investments"
            selected={view === "investments"}
            onSelect={() => {
              setView("investments");
            }}
          />
        </Tabs>
        {view === "graph" && (
          <>
            <div className="flex flex-wrap items-center justify-between text-center">
              <div className="mb-2 basis-1/3">
                <div className="dark:text-gray-200">Market Cap</div>
                {marketCap && (
                  <div className="text-xl font-medium text-orange-400">
                    {formatCurrency(marketCap.toNumber())}
                  </div>
                )}
              </div>
              <div className="mb-2 basis-1/3">
                <div className="dark:text-gray-200">Hec Price</div>
                {marketPrice && (
                  <div className="text-xl font-medium text-orange-400">
                    {formatCurrency(marketPrice.toNumber(), 2)}
                  </div>
                )}
              </div>
              <div className="mb-2 basis-1/3">
                <div className="dark:text-gray-200">Hec Burned</div>
                {hecBurned && (
                  <div className="text-xl font-medium text-orange-400">
                    {hecBurned?.toFixed(2)}
                  </div>
                )}
              </div>
              <div className="basis-1/3">
                <div className="dark:text-gray-200">Circulating Supply</div>
                {circSupply && totalSupply && (
                  <div className="text-xl font-medium text-orange-400">
                    {circSupply.toFixed(0) + " / " + totalSupply.toFixed(0)}
                  </div>
                )}
              </div>
              <div className="basis-1/3">
                <div className="dark:text-gray-200">Treasury</div>
                {treasuryValue && (
                  <div className="text-xl font-medium text-orange-400">
                    {formatCurrency(treasuryValue.toNumber(), 2)}
                  </div>
                )}
              </div>
              <div className="basis-1/3">
                <div className="dark:text-gray-200">Current Index</div>
                {currentIndex && (
                  <div className="text-xl font-medium text-orange-400">
                    {currentIndex?.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            <Graphs graphData={graphData}></Graphs>
          </>
        )}
        {!deBankData && view === "investments" && (
          <BigSpinner
            className={classes(
              "pointer-events-none text-blue-500 transition-opacity delay-75 duration-500",
            )}
          />
        )}

        {view === "investments" &&
          treasuryValue &&
          deBankData &&
          investmentsData &&
          protocolData && (
            <>
              <GlobalInfo
                transactions={sortedTransactions}
                treasuryValue={treasuryValue}
              ></GlobalInfo>
              <Investments metrics={investmentsData}></Investments>
              <Protocols protocols={protocolData}></Protocols>
              {sortedTransactions && (
                <LatestTransactions
                  ftmScanTransactionData={sortedTransactions}
                />
              )}
            </>
          )}
      </main>
    </DappPage>
  );
}

const LatestTransactions: VFC<{ ftmScanTransactionData: Transaction[] }> = ({
  ftmScanTransactionData,
}) => {
  return (
    <div className="grid h-[500px] ">
      <SectionTitle>Latest Transactions</SectionTitle>

      <div className="transactions overflow-auto dark:text-gray-200">
        <>
          {ftmScanTransactionData &&
            ftmScanTransactionData.map((transaction, i) => (
              <React.Fragment key={i}>
                <div className="center flex items-center justify-between py-3">
                  <div className="basis-1/3 font-bold">
                    {transaction.investments.transactionDate}
                  </div>
                  <div className="title basis-1/3 text-center">
                    {transaction.title}
                  </div>

                  <div className="basis-1/3 text-center font-bold text-orange-400">
                    {formatCurrency(+transaction.investments.investedAmount, 2)}
                  </div>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={transaction.investments.transactionLinks[0]}
                  >
                    <Link className="h-4 cursor-pointer" />
                  </a>
                </div>
                <hr />
              </React.Fragment>
            ))}
        </>
      </div>
    </div>
  );
};

const Investments: VFC<{ metrics: CoinInfo[] }> = ({ metrics }) => {
  return (
    <>
      <div className="grid space-y-2">
        <SectionTitle>Investments</SectionTitle>

        {metrics && (
          <>
            {" "}
            <div className="grid h-[400px] space-y-2 overflow-auto ">
              {metrics.map((token, i) => (
                <React.Fragment key={token.name}>
                  <div className="flex items-center rounded bg-gray-100 p-2 dark:bg-gray-700 dark:text-gray-200">
                    <div className="flex items-center">
                      <img
                        className="mr-2 h-8 w-auto"
                        alt={token.name}
                        src={token.logo}
                      />
                      <div>
                        <div className="name">{token.name}</div>
                        <div className="balance">
                          {token.tokenAmount
                            ? (+token.tokenAmount).toFixed(2)
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      {formatCurrency(token.amount, 2)}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

const Protocols: VFC<{ protocols: ProtocolList[] }> = ({ protocols }) => {
  return (
    <div className="grid h-[400px]  space-y-2">
      <SectionTitle>Protocols</SectionTitle>
      <div className="space-y-2 overflow-auto">
        {protocols.map((protocol, i) => (
          <React.Fragment key={protocol.source + i}>
            <div className="space-y-2 rounded bg-gray-100 p-2 dark:bg-gray-700 dark:text-gray-200">
              <div className="mb-2 flex items-center">
                <div className="flex items-center">
                  <img
                    className="mr-2 h-8 w-auto"
                    src={protocol.logo_url}
                    alt={protocol.name}
                  />
                  <div className="mr-2">{protocol.name}</div>
                </div>
                <a
                  href={"https://debank.com/profile/" + protocol.source}
                  rel="noreferrer"
                  target={"_blank"}
                  className="flex-1 cursor-pointer  items-center  text-gray-500 dark:text-gray-200"
                >
                  <Link className="h-4 cursor-pointer" />
                </a>
                <div>
                  <div>
                    {formatCurrency(
                      protocol.portfolio_item_list.reduce(
                        (sum, a) => sum + a.stats.asset_usd_value,
                        0,
                      ),
                      2,
                    )}
                  </div>
                  {/* <Info onMouseOver={} className="h-4 cursor-pointer"/> */}
                </div>
              </div>
              <hr className="w-full justify-self-center bg-gray-900 dark:bg-gray-600 "></hr>
              {protocol.portfolio_item_list.map((item, i) => (
                <div className=" space-y-2" key={item.name + i}>
                  {item.detail.supply_token_list?.map((token) => (
                    <div
                      className="grid grid-cols-3 items-center"
                      key={token.id}
                    >
                      <div className="flex ">
                        <img
                          className="mr-2 h-8 w-auto"
                          src={token.logo_url}
                          alt={token.name}
                        />
                        <div>{token.optimized_symbol}</div>
                      </div>
                      <div className="justify-self-center">
                        {token.amount.toFixed(2)}
                      </div>
                      <div className="justify-self-end">
                        {formatCurrency(token.price * token.amount, 2)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

interface Info {
  amount: string;
  text: string;
  logo: any;
}
const GlobalInfo: VFC<{
  transactions: Transaction[];
  treasuryValue: Decimal;
}> = ({ transactions, treasuryValue }) => {
  const [totalBuyBack, setBuyBack] = useState(0);
  const [data, setData] = useState<Info[]>();
  useEffect(() => {
    if (treasuryValue) {
      const amounts = [
        {
          amount: formatter.format(treasuryValue.toNumber()),
          text: "Assets",
          logo: treasury,
        },
        {
          amount: formatter.format(totalBuyBack),
          text: "Buyback",
          logo: buyback,
        },
      ];
      setData(amounts);
    }
  }, [treasuryValue, totalBuyBack]);
  useEffect(() => {
    const buyBackTotal = transactions.reduce(
      (partialSum, tx) => partialSum + +tx.investments.investedAmount,
      0,
    );
    setBuyBack(buyBackTotal);
  }, [transactions]);
  return (
    <div className="flex justify-evenly">
      {data &&
        data.map((info, i) => (
          <React.Fragment key={info.text}>
            <div className="grid justify-items-center space-y-2">
              <div className="text-xl dark:text-gray-200">{info.text}</div>
              <div className="text-xl text-orange-400 dark:text-orange-400 sm:text-2xl">
                {info.amount}
              </div>
              <info.logo className="w-9 dark:text-gray-200" />
            </div>
          </React.Fragment>
        ))}
    </div>
  );
};

const ETH_QUERY = `query {
  ethMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    treasuryBaseRewardPool
    treasuryIlluviumBalance
    treasuryEthMarketValue
    treasuryMaticBalance
    maticTokenAmount
    illuviumTokenAmount
  }
}`;

interface SubgraphEthData {
  id: string;
  timestamp: string;
  treasuryBaseRewardPool: string;
  treasuryIlluviumBalance: string;
  treasuryEthMarketValue: string;
  treasuryMaticBalance: string;
  illuviumTokenAmount: string;
}

const Graphs: VFC<{
  graphData: ProtocolMetrics[] | undefined;
}> = ({ graphData }) => {
  return (
    <>
      <hr className="h-px flex-grow bg-gray-300 "></hr>
      {graphData && (
        <>
          <HecGraphs
            title="Total Value Deposited"
            graphData={graphData}
            areaLines={[
              {
                dataKey: "totalValueLocked",
                tooltipLabel: "sHEC",
                fill: "#768299",
                stroke: "#98B3E9",
              },
              {
                dataKey: "bankTotal",
                tooltipLabel: "Institute",
                fill: "#2563eb",
                stroke: "#60a5fa",
              },
              {
                dataKey: "torTVL",
                tooltipLabel: "TOR Curve LP",
                fill: "#be7c40",
                stroke: "#e89e5a",
              },
            ]}
            unitType={"currency"}
          ></HecGraphs>
          <HecGraphs
            title="HEC Circulating Supply"
            graphData={graphData}
            areaLines={[
              {
                dataKey: "hecCirculatingSupply",
                tooltipLabel: "HEC",
                fill: "#77431E",
                stroke: "#ED994C",
              },
            ]}
            unitType={"none"}
          ></HecGraphs>
          <HecGraphs
            title="HEC Staked"
            graphData={graphData}
            areaLines={[
              {
                dataKey: "staked",
                tooltipLabel: "HEC Staked",
                fill: "#55EBC7",
                stroke: "#ED994C",
              },
            ]}
            unitType={"percentage"}
          ></HecGraphs>
          <HecGraphs
            title="Runway"
            graphData={graphData}
            areaLines={[
              {
                dataKey: "runwayCurrent",
                tooltipLabel: "Days",
                fill: "#333333",
                stroke: "#767676",
              },
            ]}
            unitType={"none"}
          ></HecGraphs>
          <HecGraphs
            title="Protocol Owned Liquidity HEC-DAI"
            graphData={graphData}
            areaLines={[
              {
                dataKey: "treasuryHecDaiPOL",
                tooltipLabel: "SLP Treasury",
                fill: "#8AFF8A",
                stroke: "#767676",
              },
            ]}
            unitType={"percentage"}
          ></HecGraphs>
        </>
      )}
    </>
  );
};

interface AreaLine {
  dataKey: string;
  stroke: string;
  tooltipLabel: string;
  fill: string;
}
const HecGraphs: FC<{
  title: string;
  areaLines: AreaLine[];
  graphData: ProtocolMetrics[];
  unitType: "currency" | "percentage" | "none";
}> = ({ title, areaLines, graphData, unitType }) => {
  const totalAmount = areaLines
    .map((line) => +(graphData[0] as any)[line.dataKey])
    .reduce((accumulator, curr) => accumulator + curr);
  return (
    <>
      <div className="flex">
        <div className="mr-2 text-xl font-medium dark:text-gray-200">
          {title}
        </div>
        <div className="text-xl font-medium text-orange-400">
          {
            {
              currency: formatCurrency(totalAmount),
              percentage: `${totalAmount.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}%`,
              none: totalAmount.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              }),
            }[unitType]
          }
        </div>
      </div>
      <ResponsiveContainer
        className="border-r-gray-100"
        width="100%"
        height={300}
      >
        <AreaChart data={graphData}>
          <XAxis
            dataKey="timestamp"
            interval={"preserveStartEnd"}
            axisLine={false}
            tickLine={false}
            tickFormatter={(str) =>
              new Date(str * 1000).toLocaleString("en-us", {
                month: "short",
                year: "2-digit",
              })
            }
            reversed={true}
            padding={{ right: 20 }}
          />
          <Tooltip
            formatter={(value: string) => (+value).toFixed(2)}
            content={
              <CustomTooltip
                itemNames={areaLines.map((line) => line.tooltipLabel)}
                unitType={unitType}
              />
            }
          />
          {areaLines.map((line, index) => (
            <React.Fragment key={line.dataKey + index}>
              <Area
                type="monotone"
                dataKey={line.dataKey}
                stackId="1"
                stroke={line.stroke}
                fill={line.fill}
              ></Area>
            </React.Fragment>
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

const CustomTooltip = ({
  itemNames,
  unitType,
  active,
  payload,
  label,
}: any) => {
  if (active) {
    return (
      <div className="rounded bg-white p-4 dark:bg-gray-700 dark:text-gray-200">
        {itemNames.map((name: string, index: number) => (
          <React.Fragment key={name + index}>
            <div className="flex ">
              <div
                style={{
                  backgroundColor: payload?.[index].fill,
                }}
                className=" mr-3 h-2 w-2 self-center rounded-full shadow-sm "
              ></div>
              <div className="flex ">
                <div className="mr-2">{name}:</div>
                <div>
                  {" "}
                  {
                    {
                      currency: formatCurrency(+payload?.[index].value, 2),
                      percentage: `${(+payload?.[index].value).toFixed(2)}%`,
                      none: payload?.[index].value.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      }),
                    }[unitType as string]
                  }
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  return null;
};

const SectionTitle: FC = ({ children }) => (
  <div className="my-1 flex items-center">
    <div className="h-px flex-grow bg-gray-300" />
    <h3 className="mx-4 text-sm font-medium uppercase text-gray-400">
      {children}
    </h3>
    <div className="h-px flex-grow bg-gray-300" />
  </div>
);
