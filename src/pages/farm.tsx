import { NextPage } from "next";
import Head from "next/head";
import CheckIcon from "src/icons/circle-check-solid.svgr";
import CloseIcon from "src/icons/xmark-solid.svgr";
import * as Curve from "src/contracts/curve";
import * as Staking from "src/contracts/staking";
import * as FarmAggregator from "src/contracts/farmAggregator";
import React, { FC, useEffect, useState, VFC } from "react";
import { CoinInput } from "src/components/CoinInput";
import { Radio, RadioGroup } from "src/components/Radio";
import { Submit } from "src/components/Submit";
import { Allowance, useAllowance } from "src/hooks/allowance";
import { useBalance } from "src/hooks/balance";
import { classes, formatCurrency, sleep, useDecimalInput } from "src/util";
import { useWallet, Wallet, WalletState } from "src/wallet";
import { Tab, Tabs } from "src/components/Tab";
import { PageHeader, PageSubheader } from "src/components/Header";
import { StaticImg } from "src/components/StaticImg";
import {
  FANTOM_DAI,
  FANTOM_TOR,
  FANTOM_USDC,
  FANTOM_CURVE,
  FANTOM_STAKED_CURVE,
  LP_FARM,
} from "src/constants";
import Decimal from "decimal.js";
import { FANTOM } from "src/chain";
import { TorStats } from "src/contracts/farmAggregator";
import { Transaction, TransactionModal } from "src/components/Transaction";

const FarmPage: NextPage = () => {
  const wallet = useWallet(FANTOM);
  const [tx, setTx] = useState<Transaction>();
  return (
    <main className="w-full space-y-5">
      <Head>
        <title>Farm — Hector Finance</title>
      </Head>
      <div className="">
        <PageHeader>Farm</PageHeader>
        <PageSubheader>Earn passive income by lending to Hector</PageSubheader>
      </div>
      <FarmStats></FarmStats>
      <Pool onTx={setTx} />
      <Farm onTx={setTx} />
      <Claim onTx={setTx} />
      <div>
        {wallet.connected && tx && (
          <TransactionModal
            tx={tx}
            wallet={wallet}
            onClose={() => {
              setTx(undefined);
            }}
          />
        )}
      </div>
    </main>
  );
};

const SectionTitle: FC = ({ children }) => (
  <div className="flex items-center">
    <div className="h-px flex-grow bg-gray-300" />
    <h3 className="mx-4 text-sm font-medium uppercase text-gray-400">
      {children}
    </h3>
    <div className="h-px flex-grow bg-gray-300" />
  </div>
);

const FarmStats: VFC = () => {
  const [farmStats, setFarmStats] = useState<TorStats>();

  useEffect(() => {
    (async () => {
      const getTorStats = await FarmAggregator.getTorStats(FANTOM);
      if (getTorStats.isOk) {
        setFarmStats(getTorStats.value);
      }
    })();
  }, []);
  return (
    <div className="flex flex-wrap justify-around text-center">
      <div>
        <div className="dark:text-gray-200">APR</div>
        {farmStats && (
          <div className="text-2xl font-medium text-orange-400">
            {farmStats.apr?.toFixed(2)}%
          </div>
        )}
      </div>
      <div>
        <div className="dark:text-gray-200">Total Deposited</div>
        {farmStats && (
          <div className="text-2xl font-medium text-orange-400">
            {formatCurrency(farmStats.tvl.toNumber(), 2)}
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// --------------------------------  POOL  ------------------------------------
// ----------------------------------------------------------------------------

const Pool: VFC<{ onTx: (tx: Transaction) => void }> = ({ onTx }) => {
  const [view, setView] = useState<"deposit" | "withdraw">("deposit");
  return (
    <div className="space-y-4">
      <SectionTitle>Step 1: Pool</SectionTitle>
      <div>
        <Tabs>
          <Tab
            selected={view === "deposit"}
            label="Deposit"
            onSelect={() => {
              setView("deposit");
            }}
          />
          <Tab
            selected={view === "withdraw"}
            label="Withdraw"
            onSelect={() => {
              setView("withdraw");
            }}
          />
        </Tabs>
      </div>

      {view === "deposit" && <PoolDeposit />}
      {view === "withdraw" && <PoolWithdraw onTx={onTx} />}
    </div>
  );
};

const DAI_TOR_USDC_FARM = "0x61B71689684800f73eBb67378fc2e1527fbDC3b3";
const DAI_TOR_USDC_POOL = "0x24699312CB27C26Cfc669459D670559E5E44EE60";

const PoolDeposit: VFC<{}> = ({}) => {
  const wallet = useWallet(FANTOM);
  const [tor, torInput, setTorInput] = useDecimalInput();
  const [dai, daiInput, setDaiInput] = useDecimalInput();
  const [usdc, usdcInput, setUsdcInput] = useDecimalInput();

  const [daiBalance] = useBalance(FANTOM, FANTOM_DAI, wallet);
  const [torBalance] = useBalance(FANTOM, FANTOM_TOR, wallet);
  const [usdcBalance] = useBalance(FANTOM, FANTOM_USDC, wallet);

  const daiAllowance = useAllowance(
    FANTOM,
    FANTOM_DAI,
    wallet,
    DAI_TOR_USDC_FARM,
  );
  const torAllowance = useAllowance(
    FANTOM,
    FANTOM_TOR,
    wallet,
    DAI_TOR_USDC_FARM,
  );
  const usdcAllowance = useAllowance(
    FANTOM,
    FANTOM_USDC,
    wallet,
    DAI_TOR_USDC_FARM,
  );

  const [allowanceModal, showAllowanceModal] = useState(false);

  const deposit = async () => {
    if (
      daiAllowance.type === "NoAllowance" ||
      torAllowance.type === "NoAllowance" ||
      usdcAllowance.type === "NoAllowance"
    ) {
      showAllowanceModal(true);
      return;
    }

    if (wallet.state !== WalletState.CanWrite) {
      return;
    }

    const response = await Curve.addLiquidity(
      wallet.provider,
      wallet.address,
      DAI_TOR_USDC_POOL,
      tor,
      dai,
      usdc,
    );
    if (response.isOk) {
      setTorInput("");
      setUsdcInput("");
      setDaiInput("");
      // TODO: Add success toast
    } else {
      // TODO: Add error toast
    }
  };

  return (
    <>
      <CoinInput
        amount={torInput}
        onChange={setTorInput}
        balance={torBalance}
        token={FANTOM_TOR}
      />
      <CoinInput
        amount={daiInput}
        onChange={setDaiInput}
        balance={daiBalance}
        token={FANTOM_DAI}
      />
      <CoinInput
        amount={usdcInput}
        onChange={setUsdcInput}
        balance={usdcBalance}
        token={FANTOM_USDC}
      />
      <Submit
        label="Deposit"
        disabled={tor.lte(0) && dai.lte(0) && usdc.lte(0)}
        onClick={deposit}
      />
      {allowanceModal && (
        <AllowanceModal
          allowances={[torAllowance, daiAllowance, usdcAllowance]}
          onCancel={() => showAllowanceModal(false)}
          onComplete={() => {
            showAllowanceModal(false);
            deposit();
          }}
        />
      )}
    </>
  );
};

const AllowanceModal: VFC<{
  allowances: Allowance[];
  onCancel: () => void;
  onComplete: () => void;
}> = ({ allowances, onCancel, onComplete }) => {
  const isComplete = allowances.every(
    (allowance) => allowance.type === "HasAllowance",
  );
  return (
    <Modal className="space-y-5 p-6">
      <div className="flex items-center text-xl font-medium">
        <div>Token allowance</div>
        <div className="flex-grow" />
        <button
          title="Close token allowance"
          className="-m-4 p-4"
          onClick={onCancel}
        >
          <CloseIcon className="h-2.5 w-2.5" />
        </button>
      </div>
      <div>
        An allowance is required for Hector to create transactions. Granting
        allowances will cost you a small fee and only needs to be done once per
        token-contract pair.
      </div>
      <div className="space-y-3 rounded bg-gray-100 p-3 pl-4">
        {allowances.map((allowance) => (
          <GrantButton key={allowance.token.address} allowance={allowance} />
        ))}
      </div>
      <div className="flex items-end">
        <Submit label="Continue" disabled={!isComplete} onClick={onComplete} />
      </div>
    </Modal>
  );
};

export const GrantButton: FC<{
  allowance: Allowance;
}> = ({ allowance }) => (
  <div className="flex items-center rounded">
    <div className="flex items-center gap-2">
      <StaticImg
        src={allowance.token.logo}
        className="h-6 w-6"
        alt={allowance.token.symbol}
      />
      {allowance.token.symbol}
    </div>
    <div className="flex-grow" />
    <button
      className={classes(
        "flex items-center justify-center gap-2 rounded-sm py-2 font-medium",
        allowance.type === "HasAllowance"
          ? "cursor-not-allowed bg-gray-300 px-5 text-white"
          : "cursor-pointer bg-orange-500 px-7 text-white",
      )}
      onClick={() => {
        if (allowance.type === "NoAllowance") {
          allowance.approve();
        }
      }}
      disabled={allowance.type === "HasAllowance"}
    >
      {allowance.type === "HasAllowance" ? (
        <>
          <CheckIcon className="h-4 w-4 object-contain" />
          Granted
        </>
      ) : (
        <>Allow</>
      )}
    </button>
  </div>
);

const Modal: FC<{ className?: string }> = ({ children, className }) => (
  <div>
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 m-0 bg-gray-900/50 p-4 backdrop-blur-sm">
      <div className="relative left-1/2 top-1/2 max-w-md -translate-x-1/2 -translate-y-1/2 rounded bg-white">
        <div className={className}>{children}</div>
      </div>
    </div>
  </div>
);

const PoolWithdraw: VFC<{ onTx: (tx: Transaction) => void }> = ({ onTx }) => {
  const wallet = useWallet(FANTOM);
  const [output, setOutput] = useState<Curve.WithdrawAs>(Curve.WithdrawAs.Tor);
  const [curve, curveInput, setCurveInput] = useDecimalInput();
  const [curveBalance] = useBalance(FANTOM, FANTOM_CURVE, wallet);

  const canWithdraw =
    curve.gt(0) && curve.lte(curveBalance) && wallet.connected;

  return (
    <>
      <CoinInput
        amount={curveInput}
        onChange={setCurveInput}
        balance={curveBalance}
        token={FANTOM_CURVE}
      />
      <RadioGroup label="Withdraw as">
        <Radio
          checked={output === Curve.WithdrawAs.Tor}
          onCheck={() => setOutput(Curve.WithdrawAs.Tor)}
        >
          <div className="flex justify-between">
            <div>{FANTOM_TOR.symbol}</div>
            <div className="flex gap-2">
              {output === Curve.WithdrawAs.Tor &&
                curve.gt(0) &&
                `≈ ${curve.toFixed(2)}`}
              <StaticImg
                src={FANTOM_TOR.logo}
                alt={FANTOM_TOR.symbol}
                className="h-6 w-auto"
              />
            </div>
          </div>
        </Radio>
        <Radio
          checked={output === Curve.WithdrawAs.Dai}
          onCheck={() => setOutput(Curve.WithdrawAs.Dai)}
        >
          <div className="flex justify-between">
            <div>{FANTOM_DAI.symbol}</div>
            <div className="flex gap-2">
              {output === Curve.WithdrawAs.Dai &&
                curve.gt(0) &&
                `≈ ${curve.toFixed(2)}`}
              <StaticImg
                src={FANTOM_DAI.logo}
                alt={FANTOM_DAI.symbol}
                className="h-6 w-auto"
              />
            </div>
          </div>
        </Radio>
        <Radio
          checked={output === Curve.WithdrawAs.Usdc}
          onCheck={() => setOutput(Curve.WithdrawAs.Usdc)}
        >
          <div className="flex justify-between">
            <div>{FANTOM_USDC.symbol}</div>
            <div className="flex gap-2">
              {output === Curve.WithdrawAs.Usdc &&
                curve.gt(0) &&
                `≈ ${curve.toFixed(2)}`}
              <StaticImg
                src={FANTOM_USDC.logo}
                alt={FANTOM_USDC.symbol}
                className="h-6 w-auto"
              />
            </div>
          </div>
        </Radio>
      </RadioGroup>
      <Submit
        label="Withdraw"
        disabled={!canWithdraw}
        onClick={() => {
          setCurveInput("");
          onTx({
            title: "Withdraw",
            chain: FANTOM,
            allowance: {
              amount: curve,
              spender: Curve.CURVE,
              token: FANTOM_CURVE,
            },
            send: (wallet) =>
              Curve.removeLiquidity(
                wallet.provider,
                wallet.address,
                DAI_TOR_USDC_POOL,
                curve,
                output,
              ),
          });
        }}
      />
    </>
  );
};

// ----------------------------------------------------------------------------
// --------------------------------  FARM  ------------------------------------
// ----------------------------------------------------------------------------

const Farm: VFC<{ onTx: (tx: Transaction) => void }> = ({ onTx }) => {
  const [view, setView] = useState<"stake" | "unstake">("stake");
  return (
    <div className="space-y-4">
      <SectionTitle>Step 2: Farm</SectionTitle>
      <div>
        <Tabs>
          <Tab
            label="Stake"
            selected={view === "stake"}
            onSelect={() => setView("stake")}
          />
          <Tab
            label="Unstake"
            selected={view === "unstake"}
            onSelect={() => setView("unstake")}
          />
        </Tabs>
      </div>
      {view === "stake" && <Stake onTx={onTx} />}
      {view === "unstake" && <Unstake onTx={onTx} />}
    </div>
  );
};

const Stake: VFC<{ onTx: (tx: Transaction) => void }> = ({ onTx }) => {
  const wallet = useWallet(FANTOM);
  const [curve, curveInput, setCurveInput] = useDecimalInput();
  const [curveBalance] = useBalance(FANTOM, FANTOM_CURVE, wallet);
  const canStake = wallet.connected && curve.gt(0) && curve.lte(curveBalance);
  return (
    <>
      <CoinInput
        amount={curveInput}
        onChange={setCurveInput}
        balance={curveBalance}
        token={FANTOM_CURVE}
      />
      {canStake && (
        <Submit
          label="Stake"
          onClick={async () => {
            onTx({
              title: "Stake",
              chain: FANTOM,
              allowance: {
                amount: curve,
                spender: LP_FARM.address,
                token: FANTOM_CURVE,
              },
              send: (wallet) =>
                Staking.stake(LP_FARM, wallet.provider, wallet.address, curve),
            });
            setCurveInput("");
          }}
        />
      )}
      {!canStake && <Submit label="Stake" />}
    </>
  );
};

const Unstake: VFC<{ onTx: (tx: Transaction) => void }> = ({ onTx }) => {
  const wallet = useWallet(FANTOM);
  const [curve, curveInput, setCurveInput] = useDecimalInput();
  const [curveBalance] = useBalance(FANTOM, FANTOM_STAKED_CURVE, wallet);
  console.log(curve.toString());
  console.log(curveBalance.toString());
  const canWithdraw =
    wallet.connected && curve.gt(0) && curve.lte(curveBalance);
  return (
    <>
      <CoinInput
        amount={curveInput}
        onChange={setCurveInput}
        balance={curveBalance}
        token={FANTOM_STAKED_CURVE}
      />
      {canWithdraw && (
        <Submit
          label="Unstake"
          onClick={async () => {
            onTx({
              title: "Unstake",
              chain: FANTOM,
              allowance: {
                amount: curve,
                spender: LP_FARM.address,
                token: FANTOM_CURVE,
              },
              send: (wallet) =>
                Staking.withdraw(
                  LP_FARM,
                  wallet.provider,
                  wallet.address,
                  curve,
                ),
            });
            setCurveInput("");
          }}
        />
      )}
      {!canWithdraw && <Submit label="Unstake" />}
    </>
  );
};

// ----------------------------------------------------------------------------
// -------------------------------  CLAIM  ------------------------------------
// ----------------------------------------------------------------------------

const Claim: VFC<{ onTx: (tx: Transaction) => void }> = ({ onTx }) => {
  const wallet = useWallet(FANTOM);
  const [earned, setEarned] = useState<Decimal>(new Decimal(0));
  useEffect(() => {
    let abort = false;
    (async () => {
      while (!abort) {
        if (wallet.connected) {
          const current = await Staking.earned(FANTOM, LP_FARM, wallet.address);
          if (abort) {
            return;
          }
          if (current.isOk) {
            setEarned((prev) =>
              prev.equals(current.value) ? prev : current.value,
            );
          }
        }
        await sleep(FANTOM.millisPerBlock / 2);
      }
    })();
    return () => {
      abort = true;
      setEarned(new Decimal(0));
    };
  }, [wallet]);

  const canClaim = earned.gt(0.1) && wallet.connected;

  return (
    <div className="space-y-4">
      <SectionTitle>Step 3: Claim</SectionTitle>
      <div className="flex items-center">
        <div className="dark:text-gray-200">wFTM Rewards:</div>
        <div className="flex-grow" />
        <div className="flex items-center dark:text-gray-200">
          <StaticImg
            src={LP_FARM.reward.logo}
            alt={LP_FARM.reward.symbol}
            className="mr-2 h-8 w-auto"
          />
          {earned.toFixed()}
        </div>
      </div>
      {!canClaim && <Submit label="Claim" />}
      {canClaim && (
        <Submit
          label="Claim"
          onClick={async () => {
            onTx({
              chain: FANTOM,
              title: "Claim staking rewards",
              send: (wallet) =>
                Staking.getReward(LP_FARM, wallet.provider, wallet.address),
            });
          }}
        />
      )}
    </div>
  );
};

export default FarmPage;
