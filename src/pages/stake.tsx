import Decimal from "decimal.js";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FANTOM } from "src/chain";
import { CoinInput } from "src/components/CoinInput";
import { PageHeader } from "src/components/Header";
import { Notice } from "src/components/Notice";
import RebaseTimer from "src/components/RebaseTimer";
import { Submit } from "src/components/Submit";
import { Tab, Tabs } from "src/components/Tab";
import { Transaction, TransactionModal } from "src/components/Transaction";
import {
  FANTOM_ADDRESS,
  FANTOM_HEC,
  FANTOM_sHEC,
  THE_GRAPH_URL,
} from "src/constants";
import * as Staking from "src/contracts/stakingContract";
import { useBalance } from "src/hooks/balance";
import { formatCurrency, useDecimalInput } from "src/util";
import { useWallet } from "src/wallet";

export default function StakePage() {
  const wallet = useWallet(FANTOM);
  const [hec, hecInput, setHecInput] = useDecimalInput();
  const [sHec, sHecInput, setsHecInput] = useDecimalInput();
  const [stakingAPY, setStakingAPY] = useState<Decimal>();
  const [tx, setTx] = useState<Transaction>();
  const [stakingTVL, setStakingTVL] = useState<string>();
  const [currentIndex, setCurrentIndex] = useState<Decimal>();
  const [hecBalance, refreshHecBalance] = useBalance(
    FANTOM,
    FANTOM_HEC,
    wallet,
  );
  const [sHecBalance, refreshsHecBalance] = useBalance(
    FANTOM,
    FANTOM_sHEC,
    wallet,
  );
  const [nextRewardAmount, setNextRewardAmount] = useState<Decimal>();
  const [nextRewardYield, setNextRewardYield] = useState<Decimal>();
  const [ROI, setROI] = useState<Decimal>();
  const [view, setView] = useState<"stake" | "unstake">("stake");

  useEffect(() => {
    const getStakingData = async () => {
      Promise.all([
        Staking.getEpochInfo(FANTOM),
        Staking.getHecCircSupply(FANTOM),
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
      const index = await Staking.getStakingIndex(FANTOM);
      if (index.isOk) {
        setCurrentIndex(new Decimal(index.value).div(FANTOM_HEC.wei));
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
          <div className="dark:text-gray-200">APY</div>
          {stakingAPY && (
            <div className="text-xl font-medium text-orange-400 sm:text-2xl">
              {stakingAPY?.toFixed(0)}%
            </div>
          )}
        </div>
        <div>
          <div className="dark:text-gray-200">Total Deposited</div>
          <div className="text-xl font-medium text-orange-400 sm:text-2xl">
            {stakingTVL}
          </div>
        </div>
        <div>
          <div className="dark:text-gray-200">Current Index</div>
          {currentIndex && (
            <div className="text-xl font-medium text-orange-400 sm:text-2xl">
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
            token={FANTOM_HEC}
            amount={hecInput}
            onChange={setHecInput}
            balance={hecBalance}
          />
        )}
        {sHecBalance && view === "unstake" && (
          <CoinInput
            token={FANTOM_sHEC}
            amount={sHecInput}
            onChange={setsHecInput}
            balance={sHecBalance}
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex">
          <div className="flex-1 text-base dark:text-gray-200">
            Your Staked Balance
          </div>
          <div className="dark:text-gray-200">{sHecBalance?.toFixed(4)}</div>
        </div>
        <div className="flex">
          <div className="flex-1 text-base dark:text-gray-200">
            Next Reward Amount
          </div>
          <div className="dark:text-gray-200">
            {nextRewardAmount?.toFixed(4)}
          </div>
        </div>
        <div className="flex">
          <div className="flex-1 text-base dark:text-gray-200">
            Next Reward Yield
          </div>
          <div className="dark:text-gray-200">
            {nextRewardYield?.toFixed(4)} %
          </div>
        </div>
        <div className="flex">
          <div className="flex-1 text-base dark:text-gray-200">
            ROI (5-Day Rate)
          </div>
          <div className="dark:text-gray-200">{ROI?.toFixed(4)} %</div>
        </div>
      </div>

      {wallet.connected && (
        <>
          {view === "stake" && (
            <Submit
              label="Stake"
              onClick={() => {
                setTx({
                  title: "Stake",
                  chain: FANTOM,
                  allowance: {
                    amount: hec,
                    spender: FANTOM_ADDRESS.STAKING_HELPER,
                    token: FANTOM_HEC,
                  },
                  send: (wallet) =>
                    Staking.stake(wallet.provider, wallet.address, hec),
                });
              }}
              disabled={hec.isZero() || hec.gt(hecBalance)}
            />
          )}
          {view === "unstake" && (
            <Submit
              label="Unstake"
              onClick={() => {
                setTx({
                  title: "Unstake",
                  chain: FANTOM,
                  allowance: {
                    amount: sHec,
                    spender: FANTOM_ADDRESS.STAKING,
                    token: FANTOM_sHEC,
                  },
                  send: (wallet) =>
                    Staking.unstake(wallet.provider, wallet.address, sHec),
                });
              }}
              disabled={sHec.isZero() || sHec.gt(sHecBalance)}
            />
          )}
        </>
      )}
      {!wallet.connected && <Submit label="Connect wallet" disabled />}

      <Notice>
        Wrapping is only available on Fantom. If you have HEC on another chain,
        you can{" "}
        <Link href="/bridge">
          <a className="underline">bridge</a>
        </Link>{" "}
        it to Fantom.
      </Notice>

      <Notice>
        Planning to sell more than 15k $HEC? Making an OTC deal with the team
        could save you a huge amount of losses! Please open a ticket on our
        Discord Server if you want to talk about an OTC deal with the team:{" "}
        <a className="text-blue-500 underline" href="https://discord.gg/hector">
          https://discord.gg/hector
        </a>
      </Notice>

      {tx && wallet.connected && (
        <TransactionModal
          wallet={wallet}
          tx={tx}
          onClose={(success) => {
            setTx(undefined);
            if (success) {
              setHecInput("");
              setsHecInput("");
            }
          }}
        />
      )}
    </main>
  );
}
