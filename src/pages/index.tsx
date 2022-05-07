import Decimal from "decimal.js";
import Head from "next/head";
import React, { FC, useEffect, useState, VFC } from "react";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  ETH_GRAPH_URL,
  GRAPH_DATA,
  ProtocolMetrics,
  SubgraphData,
  THE_GRAPH_URL,
} from "src/constants";
import { getTotalSupply } from "src/contracts/erc20";
import { getHecBurned } from "src/contracts/hecBurnContract";
import { getStakingIndex } from "src/contracts/stakingContract";
import { getMarketPrice } from "src/contracts/uniswapV2";
import { FANTOM_HECTOR, formatCurrency } from "src/util";
import { useWallet, WalletState } from "src/wallet";

const ETH_QUERY = `query {
  ethMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    treasuryBaseRewardPool
    treasuryIlluviumBalance
    treasuryEthMarketValue
    treasuryMaticBalance
  }
}`;

interface SubgraphEthData {
  id: string;
  timestamp: string;
  treasuryBaseRewardPool: string;
  treasuryIlluviumBalance: string;
  treasuryEthMarketValue: string;
  treasuryMaticBalance: string;
}

export default function Home() {
  const [marketCap, setMarketCap] = useState<Decimal>();
  const [marketPrice, setMarketPrice] = useState<Decimal>();
  const [circSupply, setCircSupply] = useState<Decimal>();
  const [totalSupply, setTotalSupply] = useState<Decimal>();
  const [hecBurned, setHecBurned] = useState<Decimal>();
  const [treasuryValue, setTreasuryValue] = useState<Decimal>();
  const [graphData, setGraphData] = useState<ProtocolMetrics[]>();
  const [backingPerHec, setBackingPerHec] = useState<Decimal>();
  const [currentIndex, setCurrentIndex] = useState<Decimal>();
  const wallet = useWallet();

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
        }
      }
    };
    loadDashboardInfo();
  }, [wallet]);

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
  return (
    <main className="w-full space-y-4">
      <Head>
        <title>DashBoard — Hector Finance</title>
      </Head>
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
    </main>
  );
}

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
