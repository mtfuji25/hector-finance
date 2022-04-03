import Decimal from "decimal.js";
import Head from "next/head";
import { useEffect, useState } from "react";
import RebaseTimer from "src/components/RebaseTimer";
import { FANTOM, THE_GRAPH_URL } from "src/constants";
import { balanceOf } from "src/contracts/erc20";
import {
  getEpochInfo,
  getHecCircSupply,
  getStakingIndex,
  HEC_DECIMAL,
} from "src/contracts/stakingContract";
import { FANTOM_HECTOR, FANTOM_sHEC, formatCurrency } from "src/util";
import { useWallet, WalletState } from "src/wallet";

export default function StakePage() {
  const [stakingAPY, setStakingAPY] = useState<Decimal>();
  const [stakingTVL, setStakingTVL] = useState<string>();
  const [currentIndex, setCurrentIndex] = useState<Decimal>();
  const [hecBalance, setHecBalance] = useState<Decimal>();
  const [sHecBalance, setsHecBalance] = useState<Decimal>();
  const [nextRewardAmount, setNextRewardAmount] = useState<Decimal>();
  const [nextRewardYield, setNextRewardYield] = useState<Decimal>();
  const [ROI, setROI] = useState<Decimal>();
  const wallet = useWallet();

  useEffect(() => {
    const getStakingData = async () => {
      if (wallet.state === WalletState.Connected) {
        Promise.all([
          getEpochInfo(wallet.provider),
          getHecCircSupply(wallet.provider),
          balanceOf(wallet.provider, FANTOM_HECTOR, wallet.address),
          balanceOf(wallet.provider, FANTOM_sHEC, wallet.address),
        ]).then(([epoch, circ, hecBalance, sHecBalance]) => {
          if (hecBalance.isOk) {
            setHecBalance(hecBalance.value);
          }
          if (circ.isOk && epoch.isOk && sHecBalance.isOk) {
            setsHecBalance(sHecBalance.value);
            const stakingRebase = epoch.value.distribute.div(
              new Decimal(circ.value),
            );
            const stakingRebasePercentage = stakingRebase.times(100);
            const trimmedBalance = Number(
              [sHecBalance]
                .filter(Boolean)
                .map((balance) => Number(balance))
                .reduce((a, b) => a + b, 0),
            );
            setROI(Decimal.pow(stakingRebase.plus(1), 5 * 3).minus(1));
            setNextRewardYield(stakingRebasePercentage);
            setNextRewardAmount(
              stakingRebasePercentage.div(100).times(trimmedBalance),
            );
            setStakingAPY(
              Decimal.pow(stakingRebase.plus(1), 365 * 3)
                .minus(1)
                .times(100),
            );
          }
        });
        const index = await getStakingIndex(wallet.provider);
        if (index.isOk) {
          setCurrentIndex(new Decimal(index.value).div(FANTOM_HECTOR.wei));
        }
      }
    };
    getStakingData();
  }, [wallet]);

  useEffect(() => {
    fetch(THE_GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query{protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
        totalValueLocked
      }}
    `,
      }),
    })
      .then((res) => res.json())
      .then(({ data }) =>
        setStakingTVL(
          formatCurrency(+data.protocolMetrics[0].totalValueLocked, 2),
        ),
      );
  }, []);

  return (
    <main>
      <Head>
        <title>Stake — Hector Finance</title>
      </Head>
      <div>
        <h1 className="text-2xl font-semibold">Stake v2 (3,3)</h1>
        <h2>Buy and sell Tor — Hector&apos;s stablecoin</h2>
      </div>
      <RebaseTimer />
      <div>{stakingAPY?.toFixed(0)}%</div>
      <div>{stakingTVL}</div>
      <div>{currentIndex?.toFixed(2)}</div>
    </main>
  );
}
