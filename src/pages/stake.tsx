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
  const [view, setView] = useState<"stake" | "unstake">();
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
    <main className="w-full">
      <Head>
        <title>Stake — Hector Finance</title>
      </Head>
      <div className="mb-7">
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
      <div className="space-y-1">
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
      {hecBalance && (
        <Stake
          amount={hecInput}
          tokenImage={hectorImg}
          onChange={setHecInput}
          hecBalance={hecBalance}
        />
      )}
    </main>
  );
}

const Stake: VFC<{
  hecBalance: Decimal;
  tokenImage: StaticImageData;
  amount: DecimalInput;
  onChange: (input: string) => void;
}> = ({ hecBalance, tokenImage, amount, onChange }) => {
  return (
    <div className="block space-y-2">
      <div className="flex">
        <div>Stake</div>
        <div className="flex-grow" />
        <button
          className="-m-2 p-2"
          onClick={() => onChange(hecBalance.toString())}
        >
          MAX {hecBalance.toFixed(2)}
        </button>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 gap-2">
          <StaticImg src={tokenImage} alt={"Hec"} className="h-6 w-6" />
          <div>Hec</div>
        </div>
        <input
          className={classes(
            "w-full rounded px-3 py-3 pl-11 text-right",
            amount.isValid ? "bg-gray-100" : "bg-red-50 text-red-700",
          )}
          title={`Hec sell amount`}
          pattern="[0-9]*"
          inputMode="decimal"
          value={amount.input}
          onChange={(e) => onChange(validateEther(e.target.value))}
          placeholder="0.00"
        />
      </div>
    </div>
  );
};
