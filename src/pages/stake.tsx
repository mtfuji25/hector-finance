import Decimal from "decimal.js";
import Head from "next/head";
import { StaticImageData } from "next/image";
import { FC, useEffect, useState, VFC } from "react";
import RebaseTimer from "src/components/RebaseTimer";
import { StaticImg } from "src/components/StaticImg";
import hectorImg from "public/icons/hector.svg";
import { FANTOM, THE_GRAPH_URL } from "src/constants";
import { balanceOf } from "src/contracts/erc20";
import {
  getEpochInfo,
  getHecCircSupply,
  getStakingIndex,
  HEC_DECIMAL,
  stake,
} from "src/contracts/stakingContract";
import {
  classes,
  DecimalInput,
  FANTOM_HECTOR,
  FANTOM_sHEC,
  formatCurrency,
  useDecimalInput,
  validateEther,
} from "src/util";
import { useWallet, WalletState } from "src/wallet";
import Radio from "src/components/Radio";
import CoinInput from "src/components/CoinInput";
import Submit from "src/components/Submit";

export default function StakePage() {
  const [hec, hecInput, setHecInput] = useDecimalInput();
  const [stakingAPY, setStakingAPY] = useState<Decimal>();
  const [stakingTVL, setStakingTVL] = useState<string>();
  const [currentIndex, setCurrentIndex] = useState<Decimal>();
  const [hecBalance, setHecBalance] = useState<Decimal>();
  const [sHecBalance, setsHecBalance] = useState<Decimal>();
  const [nextRewardAmount, setNextRewardAmount] = useState<Decimal>();
  const [nextRewardYield, setNextRewardYield] = useState<Decimal>();
  const [ROI, setROI] = useState<Decimal>();
  const [view, setView] = useState<"stake" | "unstake">("stake");
  const wallet = useWallet();

  const unStake = () => {};

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
    <main className="w-full">
      <Head>
        <title>Stake — Hector Finance</title>
      </Head>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Stake v2 (3,3)</h1>
        <RebaseTimer />
      </div>
      <div className="mb-10 flex justify-between text-center">
        <div>
          <div>APY</div>
          {stakingAPY && (
            <div className="text-xl font-semibold text-orange-500">
              {stakingAPY?.toFixed(0)}%
            </div>
          )}
        </div>
        <div>
          <div>Total Deposited</div>
          <div className="text-xl font-semibold text-orange-500">
            {stakingTVL}
          </div>
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
      <div className="mb-5 space-y-1">
        <Radio
          checked={view === "stake"}
          onCheck={() => {
            setView("stake");
          }}
        >
          Stake
        </Radio>
        <Radio
          checked={view === "unstake"}
          onCheck={() => {
            setView("unstake");
          }}
        >
          Unstake
        </Radio>
      </div>
      {hecBalance && view === "stake" && (
        <CoinInput
          amount={hecInput}
          tokenImage={hectorImg}
          tokenName="Hec"
          onChange={setHecInput}
          balance={hecBalance}
          label={"Stake"}
        />
      )}
      {sHecBalance && view === "unstake" && (
        <CoinInput
          amount={hecInput}
          tokenImage={hectorImg}
          tokenName="Hec"
          onChange={setHecInput}
          balance={sHecBalance}
          label={"Unstake"}
        />
      )}
      {wallet.state === WalletState.Connected && hecBalance && (
        <div className="mt-5">
          <Submit
            onClick={() =>
              view === "stake"
                ? stake(wallet.provider, wallet.address, hecBalance)
                : unStake()
            }
            label={view === "stake" ? "Stake" : "Unstake"}
          ></Submit>
        </div>
      )}
    </main>
  );
}
