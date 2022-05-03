import Decimal from "decimal.js";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  ETH_GRAPH_URL,
  FANTOM,
  GRAPH_DATA,
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
    treasuryEthMarketValue
  }
}`;

export default function Home() {
  const [marketCap, setMarketCap] = useState<Decimal>();
  const [marketPrice, setMarketPrice] = useState<Decimal>();
  const [circSupply, setCircSupply] = useState<Decimal>();
  const [totalSupply, setTotalSupply] = useState<Decimal>();
  const [hecBurned, setHecBurned] = useState<Decimal>();
  const [treasuryValue, setTreasuryValue] = useState<Decimal>();
  const [backingPerHec, setBackingPerHec] = useState<Decimal>();
  const [currentIndex, setCurrentIndex] = useState<Decimal>();
  const wallet = useWallet();

  useEffect(() => {
    const getGraphData = fetch(THE_GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GRAPH_DATA,
      }),
    }).then((res) => res.json());
    const getEthData = fetch(ETH_GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: ETH_QUERY,
      }),
    }).then((res) => res.json());

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
            graphData.data.protocolMetrics[0].hecCirculatingSupply,
          );
          const treasuryVal = new Decimal(
            graphData.data.protocolMetrics[0].treasuryMarketValue,
          ).plus(
            new Decimal(ethData.data.ethMetrics[0].treasuryEthMarketValue),
          );
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

  return (
    <main className="w-full">
      <Head>
        <title>DashBoard — Hector Finance</title>
      </Head>
      <div className=" text-center">
        <h2 className="text-xl">Dashboard</h2>
      </div>
      <div className="my-5 flex flex-wrap justify-between text-center">
        <div>
          <div>Market Cap</div>
          {marketCap && (
            <div className="text-xl font-semibold text-orange-500">
              {formatCurrency(marketCap.toNumber())}
            </div>
          )}
        </div>
        <div>
          <div>Hec Price</div>
          {marketPrice && (
            <div className="text-xl font-semibold text-orange-500">
              {formatCurrency(marketPrice.toNumber(), 2)}
            </div>
          )}
        </div>
        <div>
          <div>Hec Burned</div>
          {hecBurned && (
            <div className="text-xl font-semibold text-orange-500">
              {hecBurned?.toFixed(2)}
            </div>
          )}
        </div>
      </div>
      <div className="my-5 flex flex-wrap justify-between text-center">
        <div>
          <div>Circulating Supply</div>
          {circSupply && totalSupply && (
            <div className="text-xl font-semibold text-orange-500">
              {circSupply.toFixed(0) + " / " + totalSupply.toFixed(0)}
            </div>
          )}
        </div>
        <div>
          <div>RPH</div>
          {backingPerHec && (
            <div className="text-xl font-semibold text-orange-500">
              {formatCurrency(backingPerHec.toNumber(), 2)}
            </div>
          )}
        </div>
        <div>
          <div>Current Index</div>
          {currentIndex && (
            <div className="text-xl font-semibold text-orange-500">
              {currentIndex?.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
