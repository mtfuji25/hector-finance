import { NextPage } from "next";
import Head from "next/head";
import CheckIcon from "src/icons/circle-check-solid.svgr";
import CloseIcon from "src/icons/xmark-solid.svgr";
import * as Curve from "src/contracts/curve";
import * as Staking from "src/contracts/staking";
import React, { FC, useState, VFC } from "react";
import { CoinInput } from "src/components/CoinInput";
import { Radio, RadioGroup } from "src/components/Radio";
import { Submit } from "src/components/Submit";
import { Allowance, useAllowance } from "src/hooks/allowance";
import { useBalance } from "src/hooks/balance";
import { classes, useDecimalInput } from "src/util";
import { useWallet, Wallet, WalletState } from "src/wallet";
import { Tab, Tabs } from "src/components/Tab";
import { PageHeader, PageSubheader } from "src/components/Header";
import { StaticImg } from "src/components/StaticImg";
import {
  FANTOM_DAI,
  FANTOM_TOR,
  FANTOM_USDC,
  FANTOM_CURVE,
  FANTOM_WFTM,
  FANTOM_STAKED_CURVE,
  LP_FARM,
} from "src/constants";

const FarmPage: NextPage = () => {
  return (
    <main className="w-full space-y-20">
      <Head>
        <title>Farm — Hector Finance</title>
      </Head>
      <div className="-mb-12">
        <PageHeader>Farm</PageHeader>
        <PageSubheader>Earn passive income by lending to Hector</PageSubheader>
      </div>
      <Pool />
      <Farm />
      <Claim />
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

// ----------------------------------------------------------------------------
// --------------------------------  POOL  ------------------------------------
// ----------------------------------------------------------------------------

const Pool: VFC = () => {
  const wallet = useWallet();
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
              // refreshTorBalance();
              // refreshDaiBalance();
              // refreshUsdcBalance();
              // setDaiInput("");
              // setTorInput("");
              setView("deposit");
            }}
          />
          <Tab
            selected={view === "withdraw"}
            label="Withdraw"
            onSelect={() => {
              // refreshTorBalance();
              // refreshDaiBalance();
              // refreshUsdcBalance();
              // setDaiInput("");
              // setTorInput("");
              setView("withdraw");
            }}
          />
        </Tabs>
      </div>

      {view === "deposit" && <PoolDeposit wallet={wallet} />}
      {view === "withdraw" && <PoolWithdraw wallet={wallet} />}
    </div>
  );
};

const DAI_TOR_USDC_FARM = "0x61B71689684800f73eBb67378fc2e1527fbDC3b3";
const DAI_TOR_USDC_POOL = "0x24699312CB27C26Cfc669459D670559E5E44EE60";

const PoolDeposit: VFC<{ wallet: Wallet }> = ({ wallet }) => {
  const [tor, torInput, setTorInput] = useDecimalInput();
  const [dai, daiInput, setDaiInput] = useDecimalInput();
  const [usdc, usdcInput, setUsdcInput] = useDecimalInput();

  const [daiBalance, refreshDaiBalance] = useBalance(FANTOM_DAI, wallet);
  const [torBalance, refreshTorBalance] = useBalance(FANTOM_TOR, wallet);
  const [usdcBalance, refreshUsdcBalance] = useBalance(FANTOM_USDC, wallet);

  const daiAllowance = useAllowance(FANTOM_DAI, wallet, DAI_TOR_USDC_FARM);
  const torAllowance = useAllowance(FANTOM_TOR, wallet, DAI_TOR_USDC_FARM);
  const usdcAllowance = useAllowance(FANTOM_USDC, wallet, DAI_TOR_USDC_FARM);

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

    if (wallet.state === WalletState.Connected) {
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
    }
  };

  return (
    <>
      <CoinInput
        amount={torInput}
        onChange={setTorInput}
        balance={torBalance}
        decimalAmount={FANTOM_TOR.decimals}
        tokenImage={FANTOM_TOR.logo}
        tokenName={FANTOM_TOR.symbol}
      />
      <CoinInput
        amount={daiInput}
        onChange={setDaiInput}
        balance={daiBalance}
        decimalAmount={FANTOM_DAI.decimals}
        tokenImage={FANTOM_DAI.logo}
        tokenName={FANTOM_DAI.symbol}
      />
      <CoinInput
        amount={usdcInput}
        onChange={setUsdcInput}
        balance={usdcBalance}
        decimalAmount={FANTOM_USDC.decimals}
        tokenImage={FANTOM_USDC.logo}
        tokenName={FANTOM_USDC.symbol}
      />
      <Submit
        label="Deposit"
        disabled={tor.lte(0) && dai.lte(0) && usdc.lte(0)}
        onClick={deposit}
      />
      {allowanceModal && (
        <div>
          <AllowanceModal
            allowances={[torAllowance, daiAllowance, usdcAllowance]}
            onCancel={() => showAllowanceModal(false)}
            onComplete={() => {
              showAllowanceModal(false);
              deposit();
            }}
          />
        </div>
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
  <div className="fixed top-0 left-0 right-0 bottom-0 z-10 m-0 bg-gray-900/50 p-4 backdrop-blur-sm">
    <div className="relative left-1/2 top-1/2 max-w-md -translate-x-1/2 -translate-y-1/2 rounded bg-white">
      <div className={className}>{children}</div>
    </div>
  </div>
);

const PoolWithdraw: VFC<{ wallet: Wallet }> = ({ wallet }) => {
  const [output, setOutput] = useState<Curve.WithdrawAs>(Curve.WithdrawAs.Tor);
  const [curve, curveInput, setCurveInput] = useDecimalInput();
  const [curveBalance, refreshCurveBalance] = useBalance(FANTOM_CURVE, wallet);

  const withdraw = async () => {
    if (wallet.state === WalletState.Connected) {
      const response = await Curve.removeLiquidity(
        wallet.provider,
        wallet.address,
        DAI_TOR_USDC_POOL,
        curve,
        output,
      );
      if (response.isOk) {
        setCurveInput("");
        // TODO: display success toast
      } else {
        // TODO: display error toast
      }
    }
  };

  return (
    <>
      <CoinInput
        amount={curveInput}
        onChange={setCurveInput}
        balance={curveBalance}
        decimalAmount={FANTOM_CURVE.decimals}
        tokenImage={FANTOM_CURVE.logo}
        tokenName={FANTOM_CURVE.symbol}
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
      <Submit label="Withdraw" disabled={curve.lte(0)} onClick={withdraw} />
    </>
  );
};

// ----------------------------------------------------------------------------
// --------------------------------  FARM  ------------------------------------
// ----------------------------------------------------------------------------

const Farm: VFC = () => {
  const wallet = useWallet();
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
      {view === "stake" && <Stake wallet={wallet} />}
      {view === "unstake" && <Unstake wallet={wallet} />}
    </div>
  );
};

const Stake: VFC<{ wallet: Wallet }> = ({ wallet }) => {
  const [curve, curveInput, setCurveInput] = useDecimalInput();
  const [curveBalance, refreshCurveBalance] = useBalance(FANTOM_CURVE, wallet);
  const canStake = wallet.state === WalletState.Connected && curve.gt(0);
  return (
    <>
      <CoinInput
        amount={curveInput}
        onChange={setCurveInput}
        tokenImage={FANTOM_CURVE.logo}
        tokenName={FANTOM_CURVE.symbol}
        balance={curveBalance}
        decimalAmount={FANTOM_USDC.decimals}
      />
      {canStake && (
        <Submit
          label="Stake"
          onClick={async () => {
            const response = await Staking.stake(
              LP_FARM,
              wallet.provider,
              wallet.address,
              curve,
            );
            if (response.isOk) {
              setCurveInput("");
              // TODO: show success
            } else {
              // TODO: show error
            }
          }}
        />
      )}
      {!canStake && <Submit label="Stake" />}
    </>
  );
};

const Unstake: VFC<{ wallet: Wallet }> = ({ wallet }) => {
  const [curve, curveInput, setCurveInput] = useDecimalInput();
  const [curveBalance, refreshCurveBalance] = useBalance(
    FANTOM_STAKED_CURVE,
    wallet,
  );
  const canWithdraw = wallet.state === WalletState.Connected && curve.gt(0);
  return (
    <>
      <CoinInput
        amount={curveInput}
        onChange={setCurveInput}
        balance={curveBalance}
        decimalAmount={FANTOM_STAKED_CURVE.decimals}
        tokenImage={FANTOM_STAKED_CURVE.logo}
        tokenName={FANTOM_STAKED_CURVE.symbol}
      />
      {canWithdraw && (
        <Submit
          label="Unstake"
          onClick={async () => {
            const response = await Staking.withdraw(
              LP_FARM,
              wallet.provider,
              wallet.address,
              curve,
            );
            if (response.isOk) {
              setCurveInput("");
              // TODO: show success
            } else {
              // TODO: show error
            }
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

const Claim: VFC = () => {
  const wallet = useWallet();
  const [earned, refreshEarned] = useBalance(FANTOM_WFTM, wallet);
  return (
    <div className="space-y-4">
      <SectionTitle>Step 3: Claim</SectionTitle>
      <div className="flex items-center">
        <div>wFTM Rewards:</div>
        <div className="flex-grow" />
        <div className="flex items-center">
          <StaticImg src={FANTOM_WFTM.logo} alt="WFTM" className="h-8 w-auto" />
          {earned.toString()}
        </div>
      </div>
      <Submit label="Claim" disabled={earned.lessThan(0.1)} />
    </div>
  );
};

export default FarmPage;
