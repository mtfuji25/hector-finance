import Decimal from "decimal.js";
import Head from "next/head";
import { useEffect, useState } from "react";
import RebaseTimer from "src/components/RebaseTimer";
import hectorImg from "public/icons/hector.svg";
import {
  FANTOM,
  FANTOM_HECTOR,
  FANTOM_sHEC,
  THE_GRAPH_URL,
} from "src/constants";
import {
  getEpochInfo,
  getHecCircSupply,
  getStakingIndex,
  stake,
  unStake,
} from "src/contracts/stakingContract";
import { formatCurrency, useDecimalInput } from "src/util";
import { useWallet, WalletState } from "src/wallet";
import { CoinInput } from "src/components/CoinInput";
import { Submit } from "src/components/Submit";
import { useAllowance } from "src/hooks/allowance";
import { useBalance } from "src/hooks/balance";
import { PageHeader } from "src/components/Header";
import { Tab, Tabs } from "src/components/Tab";

export default function StakePage() {
  const wallet = useWallet();
  const [hec, hecInput, setHecInput] = useDecimalInput();
  const [sHec, sHecInput, setsHecInput] = useDecimalInput();
  const [stakingAPY, setStakingAPY] = useState<Decimal>();
  const stakeAllowance = useAllowance(
    FANTOM_HECTOR,
    wallet,
    FANTOM.STAKING_HELPER_ADDRESS,
  );
  const unStakeAllowance = useAllowance(
    FANTOM_sHEC,
    wallet,
    FANTOM.STAKING_ADDRESS,
  );
  const [stakingTVL, setStakingTVL] = useState<string>();
  const [currentIndex, setCurrentIndex] = useState<Decimal>();
  const [hecBalance, refreshHecBalance] = useBalance(FANTOM_HECTOR, wallet);
  const [sHecBalance, refreshsHecBalance] = useBalance(FANTOM_sHEC, wallet);
  const [nextRewardAmount, setNextRewardAmount] = useState<Decimal>();
  const [nextRewardYield, setNextRewardYield] = useState<Decimal>();
  const [ROI, setROI] = useState<Decimal>();
  const [view, setView] = useState<"stake" | "unstake">("stake");

  useEffect(() => {
    const getStakingData = async () => {
      if (wallet.state === WalletState.Connected) {
        Promise.all([
          getEpochInfo(wallet.provider),
          getHecCircSupply(wallet.provider),
        ]).then(([epoch, circ]) => {
          if (circ.isOk && epoch.isOk) {
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
            setROI(
              Decimal.pow(stakingRebase.plus(1), 5 * 3)
                .minus(1)
                .times(100),
            );
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
  }, [wallet, sHecBalance]);

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
    <main className="w-full space-y-4">
      <Head>
        <title>Stake — Hector Finance</title>
      </Head>
      <div>
        <PageHeader>Stake (3,3)</PageHeader>
        <RebaseTimer />
      </div>
      <div className="flex flex-wrap justify-between text-center">
        <div>
          <div>APY</div>
          {stakingAPY && (
            <div className="text-xl font-medium text-orange-400">
              {stakingAPY?.toFixed(0)}%
            </div>
          )}
        </div>
        <div>
          <div>Total Deposited</div>
          <div className="text-xl font-medium text-orange-400">
            {stakingTVL}
          </div>
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

      <Tabs>
        <Tab
          label="Stake"
          selected={view === "stake"}
          onSelect={() => {
            setHecInput("");
            setsHecInput("");
            refreshHecBalance();
            setView("stake");
          }}
        />
        <Tab
          label="Unstake"
          selected={view === "unstake"}
          onSelect={() => {
            setsHecInput("");
            setHecInput("");
            refreshsHecBalance();
            setView("unstake");
          }}
        />
      </Tabs>
      <div>
        {hecBalance && view === "stake" && (
          <CoinInput
            amount={hecInput}
            tokenImage={hectorImg}
            tokenName="Hec"
            onChange={setHecInput}
            balance={hecBalance}
            decimalAmount={FANTOM_HECTOR.decimals}
          />
        )}
        {sHecBalance && view === "unstake" && (
          <CoinInput
            amount={sHecInput}
            tokenImage={hectorImg}
            tokenName="Hec"
            onChange={setsHecInput}
            balance={sHecBalance}
            decimalAmount={FANTOM_sHEC.decimals}
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex">
          <div className="flex-1 text-base">Next Reward Amount</div>
          <div>{nextRewardAmount?.toFixed(4)}</div>
        </div>
        <div className="flex">
          <div className="flex-1 text-base">Next Reward Yield</div>
          <div>{nextRewardYield?.toFixed(4)} %</div>
        </div>
        <div className="flex">
          <div className="flex-1 text-base">ROI (5-Day Rate)</div>
          <div>{ROI?.toFixed(4)} %</div>
        </div>
      </div>

      {wallet.state === WalletState.Connected && (
        <>
          {view === "stake" && (
            <>
              {stakeAllowance.type === "NoAllowance" && (
                <Submit onClick={stakeAllowance.approve} label={"Approve"} />
              )}
              {stakeAllowance.type === "Updating" && (
                <Submit label={"Updating..."} disabled></Submit>
              )}
              {stakeAllowance.type === "HasAllowance" && (
                <Submit
                  onClick={() => stake(wallet.provider, wallet.address, hec)}
                  label={"Stake"}
                />
              )}
            </>
          )}
          {view === "unstake" && (
            <>
              {unStakeAllowance.type === "NoAllowance" && (
                <Submit onClick={unStakeAllowance.approve} label={"Approve"} />
              )}
              {unStakeAllowance.type === "Updating" && (
                <Submit label={"Updating..."} disabled></Submit>
              )}
              {unStakeAllowance.type === "HasAllowance" && (
                <Submit
                  onClick={() => unStake(wallet.provider, wallet.address, sHec)}
                  label={"Unstake"}
                ></Submit>
              )}
            </>
          )}
        </>
      )}
      {wallet.state === WalletState.Disconnected && (
        <Submit label="Connect wallet" disabled />
      )}
    </main>
  );
}
