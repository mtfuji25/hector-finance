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
  FANTOM_DAI,
  FANTOM_HECTOR,
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
import { formatCurrency } from "src/util";
import { useWallet, WalletState } from "src/wallet";
import treasury from "src/icons/treasury.svgr";
import buyback from "src/icons/buyback.svgr";
import Link from "src/icons/link.svgr";
import ftmLogo from "public/icons/ftm.svg";
import daiLogo from "public/icons/dai.svg";
import hectorLogo from "public/icons/hector.svg";
import usdcLogo from "public/icons/usdc.svg";
import curveLogo from "public/icons/curve.webp";
import ethLogo from "public/icons/eth.svg";
import wftmLogo from "public/icons/wftm.svg";
import { StaticImg } from "src/components/StaticImg";

const COINS = [
  {
    name: "Illuvium",
    ticker: "ILV",
    stopColor: ["#3E2D71", "#3E2D71"],
    marketValue: "treasuryIlluviumBalance",
    riskFree: "treasuryRFIlluviumBalance",
    tokenAmount: "illuviumTokenAmount",
  },
  {
    name: "CRV",
    ticker: "CRV",
    stopColor: ["#96ADC9", "#96ADC9"],
    marketValue: "treasuryCRVMarketValue",
    riskFree: "treasuryCRVRiskFreeValue",
    tokenAmount: "treasuryCRVTokenAmount",
  },
  {
    name: "Matic",
    ticker: "MATIC",
    stopColor: ["#8247e5", "#8247E5"],
    marketValue: "treasuryMaticBalance",
    riskFree: "treasuryRFMaticBalance",
    tokenAmount: "maticTokenAmount",
  },
  {
    name: "Tor LP",
    ticker: "TOR",
    stopColor: ["#BE7C40", "#BE7C40"],
    marketValue: "treasuryTORLPValue",
    tokenAmount: "treasuryTORLPValue",
  },
  {
    name: "FTM Validator",
    ticker: "FTM VAL",
    stopColor: ["#10b981", "#059669"],
    marketValue: "treasuryFantomValidatorValue",
  },
  {
    name: "FTM Delegator",
    ticker: "FTM DEL",
    stopColor: ["#10b981", "#059669"],
    marketValue: "treasuryFantomDelegatorValue",
  },
  {
    name: "wETH",
    ticker: "wETH",
    stopColor: ["#EC1E7A", "#EC1E7A"],
    marketValue: "treasuryWETHMarketValue",
    riskFree: "treasuryWETHRiskFreeValue",
    tokenAmount: "treasuryWETHTokenAmount",
  },
  {
    name: "BOO",
    ticker: "BOO",
    stopColor: ["#6665DD", "#6665DD"],
    marketValue: "treasuryBOOMarketValue",
    riskFree: "treasuryBOORiskFreeValue",
    tokenAmount: "treasuryBOOTokenAmount",
  },
  {
    name: "wFTM",
    stopColor: ["#3b82f6", "#2563eb"],
    marketValue: "treasuryWFTMMarketValue",
    riskFree: "treasuryWFTMRiskFreeValue",
    tokenAmount: "treasuryWFTMTokenAmount",
  },
  {
    name: "FRAX",
    ticker: "FRAX",
    stopColor: ["#78716c", "#57534e"],
    marketValue: "treasuryFRAXMarketValue",
    riskFree: "treasuryFRAXRiskFreeValue",
    tokenAmount: "treasuryFRAXTokenAmount",
  },
  {
    name: "DAI LP",
    ticker: "DAI LP",
    stopColor: ["#fef9c3", "#fef08a"],
    marketValue: "treasuryDaiLPMarketValue",
    tokenAmount: "hecDaiTokenAmount",
  },
  {
    name: "USDC LP",
    stopColor: ["#cffafe", "#a5f3fc"],
    marketValue: "treasuryUsdcLPMarketValue",
  },
  {
    name: "MIM",
    stopColor: ["#7573FA", "#7573FA"],
    marketValue: "treasuryMIMMarketValue",
    riskFree: "treasuryMIMRiskFreeValue",
  },
  {
    name: "USDC",
    ticker: "USDC",
    stopColor: ["#768299", "#98B3E9"],
    marketValue: "treasuryUsdcMarketValue",
    riskFree: "treasuryUsdcMarketValue",
    tokenAmount: "treasuryUsdcTokenAmount",
  },
  {
    name: "DAI",
    ticker: "DAI",
    stopColor: ["#ffd89b", "#fbbe5d"],
    marketValue: "treasuryDaiMarketValue",
    riskFree: "treasuryDaiMarketValue",
    tokenAmount: "treasuryDaiTokenAmount",
  },
  {
    stopColor: ["#FB9804", "#FB9804"],
    name: "Convex Gauge",
    ticker: "CONVEX",
    marketValue: "treasuryBaseRewardPool",
    riskFree: "treasuryBaseRewardPool",
  },
];

const tokenImage = (ticker: string) => {
  switch (ticker) {
    case "HEC":
      <StaticImg className="h-5" alt={"HEC_Logo"} src={hectorLogo}></StaticImg>;
      return;
    case "CRV":
      return (
        <StaticImg
          className="h-5"
          alt={"Curve_Logo"}
          src={curveLogo}
        ></StaticImg>
      );
    case "DAI":
      return (
        <StaticImg className="h-5" alt={"DAI_Logo"} src={daiLogo}></StaticImg>
      );
    case "DAI LP":
      return (
        <StaticImg className="h-5" alt={"DAI_Logo"} src={daiLogo}></StaticImg>
      );
    case "wFTM":
      return (
        <StaticImg className="h-5" alt={"wFTM_Logo"} src={wftmLogo}></StaticImg>
      );
    case "FTM VAL":
      return (
        <StaticImg className="h-5" alt={"wFTM_Logo"} src={wftmLogo}></StaticImg>
      );
    case "FTM DEL":
      return (
        <StaticImg className="h-5" alt={"wFTM_Logo"} src={wftmLogo}></StaticImg>
      );
    case "USDC":
      return (
        <StaticImg className="h-5" alt={"USDC_Logo"} src={usdcLogo}></StaticImg>
      );
    case "USDC LP":
      return (
        <StaticImg className="h-5" alt={"USDC_Logo"} src={usdcLogo}></StaticImg>
      );
  }
};

interface CoinInfo {
  name: string;
  ticker: string;
  marketValue: string;
  riskFree: string;
  amount: number;
  percent: number;
  tokenAmount: string;
  stopColor: string[];
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

export default function DashBoard() {
  const wallet = useWallet();

  const [view, setView] = useState<string>("graph");
  const [marketCap, setMarketCap] = useState<Decimal>();
  const [marketPrice, setMarketPrice] = useState<Decimal>();
  const [circSupply, setCircSupply] = useState<Decimal>();
  const [totalSupply, setTotalSupply] = useState<Decimal>();
  const [hecBurned, setHecBurned] = useState<Decimal>();
  const [treasuryValue, setTreasuryValue] = useState<Decimal>();
  const [graphData, setGraphData] = useState<ProtocolMetrics[]>();
  const [backingPerHec, setBackingPerHec] = useState<Decimal>();
  const [currentIndex, setCurrentIndex] = useState<Decimal>();
  const [investmentsData, setInvestmentsData] = useState<CoinInfo[]>();
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
      if (wallet.state === WalletState.Connected) {
        const [
          graphData,
          marketPrice,
          hecBurnedAmount,
          totalSupply,
          ethData,
          index,
        ] = await Promise.all([
          getGraphData,
          getMarketPrice(wallet.provider),
          getHecBurned(wallet.provider),
          getTotalSupply(wallet.provider, FANTOM_HECTOR),
          getEthData,
          getStakingIndex(wallet.provider),
        ]);
        if (index.isOk) {
          setCurrentIndex(new Decimal(index.value).div(FANTOM_HECTOR.wei));
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
            graphData.protocolMetrics[0].hecCirculatingSupply,
          );
          const treasuryVal = new Decimal(
            graphData.protocolMetrics[0].treasuryMarketValue,
          ).plus(new Decimal(ethData[0].treasuryEthMarketValue));

          const joinedGraphData = graphData.protocolMetrics.map((entry, i) => {
            const bankTotal = (
              +entry.bankBorrowed + +entry.bankSupplied
            ).toString();
            const torTimeStamp = 1642857253;
            let data: ProtocolMetrics = {
              ...entry,
              bankTotal,
              torTVL: (+entry.timestamp > torTimeStamp
                ? graphData.tors[i]?.torTVL
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
                +ethData[i].treasuryBaseRewardPool;
              data = {
                ...data,
                treasuryBaseRewardPool: (
                  +ethData[i].treasuryBaseRewardPool +
                  +entry.treasuryInvestments
                ).toString(),
                runwayCurrent: getRunway(
                  +entry.sHecCirculatingSupply,
                  +riskFreeValue,
                  +entry.nextEpochRebase,
                ),
                treasuryMaticBalance: ethData[i].treasuryMaticBalance,
                treasuryIlluviumBalance: ethData[i].treasuryIlluviumBalance,
                treasuryRFMaticBalance: (
                  +ethData[i].treasuryMaticBalance * 0.5
                ).toString(),
                treasuryRFIlluviumBalance: (
                  +ethData[i].treasuryIlluviumBalance * 0.5
                ).toString(),
                illuviumTokenAmount: ethData[i].illuviumTokenAmount,
              };
            }
            return data as ProtocolMetrics;
          });
          setGraphData(joinedGraphData);
          setTreasuryValue(treasuryVal);
          setBackingPerHec(treasuryVal.div(circSupply));
          setCircSupply(circSupply);
          setMarketCap(
            marketPrice.value.times(circSupply).div(FANTOM_HECTOR.wei),
          );
          setMarketPrice(marketPrice.value.div(FANTOM_HECTOR.wei));
          const data = COINS.map((token) => {
            const coin = {
              ...token,
              amount: +(joinedGraphData[0] as any)[token.marketValue],
              percent: treasuryVal
                ? new Decimal((joinedGraphData[0] as any)[token.marketValue])
                    .div(treasuryVal)
                    .times(100)
                : 0,
              tokenAmount: token.tokenAmount
                ? (joinedGraphData[0] as any)[token.tokenAmount]
                : "N/A",
            };
            return coin;
          }) as CoinInfo[];
          setInvestmentsData(data.sort((a, b) => b.amount - a.amount));
        }
      }
    };
    loadDashboardInfo();
  }, [wallet]);

  useEffect(() => {
    const getHecBurnTransactions = fetch(
      "https://api.ftmscan.com/api?module=account&action=tokentx&address=0xD3Ea3b2313d24e0f2302b21f04D0F784CDb6389B&startblock=0&endblock=99999999&sort=desc&apikey=HEB98UTKTRQYD7R4UG383BNGJZ82B4M1E8",
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => res.json());
    const getOldHecBurnTransactions = fetch(
      "https://api.ftmscan.com/api?module=account&action=tokentx&address=0x3fF53A304d3672693e90bb880653925db6e63C51&startblock=0&endblock=99999999&sort=desc&apikey=HEB98UTKTRQYD7R4UG383BNGJZ82B4M1E8",
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => res.json());
    async function getTransactionData() {
      const [transactions, oldTransactions] = await Promise.all([
        getHecBurnTransactions,
        getOldHecBurnTransactions,
      ]);
      const hecburnData: FTMScanTransaction[] = transactions.result;
      const oldHecburnData: FTMScanTransaction[] = oldTransactions.result;

      const uniqueBlocks = Array.from(
        new Set(hecburnData.map((transactions) => transactions.blockNumber)),
      );
      const oldUniqueBlocks = Array.from(
        new Set(oldHecburnData.map((transactions) => transactions.blockNumber)),
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
      formatFTMScanData([...groupedData, ...oldGroupedData]);
    }

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
          title: "Buyback and Burn",
          type: "Buyback-Burn",
          investments: {
            tokenDetails: getTokens(groupedData[i]),
            transactionLinks: [`https://ftmscan.com/tx/${trans[0].hash}`],
            transactionDate: new Date(
              +trans[0]?.timeStamp * 1000,
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
    <main className="w-full space-y-6">
      <Head>
        <title>DashBoard — Hector Finance</title>
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
        <Graphs
          marketCap={marketCap}
          marketPrice={marketPrice}
          hecBurned={hecBurned}
          circSupply={circSupply}
          backingPerHec={backingPerHec}
          totalSupply={totalSupply}
          graphData={graphData}
          currentIndex={currentIndex}
        ></Graphs>
      )}
      {view === "investments" && treasuryValue && investmentsData && (
        <>
          <GlobalInfo
            transactions={sortedTransactions}
            treasuryValue={treasuryValue}
          ></GlobalInfo>
          <Chains
            treasuryValue={treasuryValue}
            metrics={investmentsData}
          ></Chains>
          <Investments metrics={investmentsData}></Investments>
          {sortedTransactions && (
            <LatestTransactions ftmScanTransactionData={sortedTransactions} />
          )}
        </>
      )}
    </main>
  );
}

const LatestTransactions: VFC<{ ftmScanTransactionData: Transaction[] }> = ({
  ftmScanTransactionData,
}) => {
  return (
    <div className="grid h-[500px] ">
      <hr className="w-5/6 justify-self-center border-t-2 bg-gray-300"></hr>
      <div className="mt-3 justify-self-center text-xl">
        Latest Transactions
      </div>

      <div className="transactions overflow-auto ">
        <>
          {ftmScanTransactionData &&
            ftmScanTransactionData.map((transaction, i) => (
              <React.Fragment key={i}>
                <div className="center flex items-center justify-between py-3">
                  <div className="font-bold">
                    {transaction.investments.transactionDate}
                  </div>
                  <div className="title">{transaction.title}</div>

                  <div className="font-bold text-orange-400">
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
  console.log(metrics);
  return (
    <>
      <div className="grid space-y-2">
        <hr className="w-5/6 justify-self-center border-t-2 bg-gray-300"></hr>
        <div className="flex items-center justify-center">
          <div className="text-xl">Investments</div>
        </div>
        {metrics && (
          <>
            {" "}
            <Chart metrics={metrics} />
            <div className="grid h-[500px] space-y-2 overflow-auto ">
              {metrics
                .filter((token) => token.ticker)
                .map((token, i) => (
                  <React.Fragment key={token.name}>
                    <div
                      style={{ borderLeftColor: token.stopColor[0] }}
                      className="flex items-center rounded border-l-2 bg-gray-100 p-2"
                    >
                      <div>
                        <div className="name">{token.name}</div>
                        <div className="balance">
                          {token.tokenAmount
                            ? (+token.tokenAmount).toFixed(2)
                            : "N/A"}
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

const Chart: VFC<{ metrics: CoinInfo[] }> = ({ metrics }) => {
  const data = metrics.map((token) => ({
    name: token.name,
    value: token.amount,
    color: token.stopColor[0],
    tokenAmount: token.tokenAmount,
  }));
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="80%"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<PieChartToolTip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const PieChartToolTip: VFC<any> = ({ payload }) => {
  return (
    <div className="MuiPaper-root hec-card chart-tooltip">
      <div>
        {payload?.[0]?.name} : {formatCurrency(payload?.[0]?.value, 2)}
      </div>
      <div>
        Token amount: {payload?.[0]?.payload?.tokenAmount.toFixed(2) ?? "N/A"}
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
              <div className="text-xl">{info.text}</div>
              <div className="text-2xl text-orange-400">{info.amount}</div>
              <info.logo className="w-9" />
            </div>
            {i !== data.length - 1 && (
              <div className=" border-l-2 border-gray-300"></div>
            )}
          </React.Fragment>
        ))}
    </div>
  );
};

const Chains: VFC<{ metrics: CoinInfo[]; treasuryValue: Decimal }> = ({
  metrics,
  treasuryValue,
}) => {
  const [ethPercent, setEthPercent] = useState<Decimal>();
  const [fantomPercent, setFantomPercent] = useState<Decimal>();

  useEffect(() => {
    if (metrics && treasuryValue) {
      const baseRewardPoolAmount =
        metrics.find((asset) => asset.marketValue === "treasuryBaseRewardPool")
          ?.amount ?? 0;
      const maticAmount =
        metrics.find((asset) => asset.marketValue === "treasuryMaticBalance")
          ?.amount ?? 0;
      const illuviumTokenAmount =
        metrics.find((asset) => asset.marketValue === "treasuryIlluviumBalance")
          ?.amount ?? 0;
      const ethTotal = baseRewardPoolAmount + maticAmount + illuviumTokenAmount;
      const ethPercent = new Decimal(ethTotal).div(treasuryValue);
      setEthPercent(ethPercent.times(100));
      setFantomPercent(new Decimal(1).minus(ethPercent).times(100));
    }
  }, [metrics, treasuryValue]);
  return (
    <div className="grid space-y-2">
      <hr className="w-5/6 justify-self-center border-t-2 bg-gray-300"></hr>
      <div className="justify-self-center text-xl">Allocations</div>
      <div className="flex justify-evenly">
        <div className="grid justify-items-center">
          <StaticImg src={ftmLogo} alt={"fantom_logo"} className="h-8 w-auto" />
          <div className="text-xl">Fantom</div>
          <div className="text-2xl text-orange-400">
            {fantomPercent?.toFixed(2)}%
          </div>
        </div>
        <div className=""></div>
        <div className="grid justify-items-center">
          <StaticImg src={ethLogo} alt={"eth_logo"} className="h-8 w-auto" />
          <div className="text-xl">Ethereum</div>
          <div className=" text-2xl text-orange-400">
            {ethPercent?.toFixed(2)}%
          </div>
        </div>
      </div>
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
  marketCap: Decimal | undefined;
  marketPrice: Decimal | undefined;
  hecBurned: Decimal | undefined;
  circSupply: Decimal | undefined;
  backingPerHec: Decimal | undefined;
  totalSupply: Decimal | undefined;
  graphData: ProtocolMetrics[] | undefined;
  currentIndex: Decimal | undefined;
}> = ({
  marketCap,
  marketPrice,
  hecBurned,
  circSupply,
  backingPerHec,
  totalSupply,
  graphData,
  currentIndex,
}) => {
  return (
    <>
      <div className=" flex flex-wrap justify-between text-center">
        <div>
          <div>Market Cap</div>
          {marketCap && (
            <div className="text-xl font-medium text-orange-400">
              {formatCurrency(marketCap.toNumber())}
            </div>
          )}
        </div>
        <div>
          <div>Hec Price</div>
          {marketPrice && (
            <div className="text-xl font-medium text-orange-400">
              {formatCurrency(marketPrice.toNumber(), 2)}
            </div>
          )}
        </div>
        <div>
          <div>Hec Burned</div>
          {hecBurned && (
            <div className="text-xl font-medium text-orange-400">
              {hecBurned?.toFixed(2)}
            </div>
          )}
        </div>
      </div>
      <div className=" flex flex-wrap justify-between text-center">
        <div>
          <div>Circulating Supply</div>
          {circSupply && totalSupply && (
            <div className="text-xl font-medium text-orange-400">
              {circSupply.toFixed(0) + " / " + totalSupply.toFixed(0)}
            </div>
          )}
        </div>
        <div>
          <div>RPH</div>
          {backingPerHec && (
            <div className="text-xl font-medium text-orange-400">
              {formatCurrency(backingPerHec.toNumber(), 2)}
            </div>
          )}
        </div>
        <div>
          <div>Current Index</div>
          {currentIndex && (
            <div className="text-xl font-medium text-orange-400">
              {currentIndex?.toFixed(2)}
            </div>
          )}
        </div>
      </div>
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
                tooltipLabel: "Bank",
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
        <div className="mr-2 text-xl font-medium">{title}</div>
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
            interval={150}
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
      <div className="bg-white p-4">
        {itemNames.map((name: string, index: number) => (
          <React.Fragment key={name + index}>
            <div className="flex">
              <div
                style={{
                  backgroundColor: payload?.[index].fill,
                }}
                className=" mr-3 h-2 w-2 self-center rounded-full shadow-sm"
              ></div>
              <div className="flex">
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
