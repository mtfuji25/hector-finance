import { NextPage } from "next";
import Head from "next/head";
import DaiLogo from "public/icons/dai.svg";
import TorLogo from "public/icons/tor.svg";
import UsdcLogo from "public/icons/usdc.svg";
import CurveLogo from "public/icons/curve.webp";
import WftmLogo from "public/icons/wftm.svg";
import React, { FC, useState, VFC } from "react";
import { CoinInput } from "src/components/CoinInput";
import { Radio, RadioGroup } from "src/components/Radio";
import { Submit } from "src/components/Submit";
import { FANTOM } from "src/constants";
import { useAllowance } from "src/hooks/allowance";
import { useBalance } from "src/hooks/balance";
import {
  FANTOM_CURVE,
  FANTOM_DAI,
  FANTOM_TOR,
  FANTOM_USDC,
  FANTOM_WFTM,
  useDecimalInput,
} from "src/util";
import { useWallet, Wallet } from "src/wallet";
import { Tab, Tabs } from "src/components/Tab";
import { PageHeader, PageSubheader } from "src/components/Header";
import { StaticImg } from "src/components/StaticImg";

const FarmPage: NextPage = () => {
  const wallet = useWallet();

  const daiAllowance = useAllowance(
    FANTOM_DAI,
    wallet,
    FANTOM.TOR_MINTER_ADDRESS,
  );
  const torAllowance = useAllowance(
    FANTOM_TOR,
    wallet,
    FANTOM.TOR_MINTER_ADDRESS,
  );

  return (
    <main className="w-full space-y-20">
      <Head>
        <title>Farm — Hector Finance</title>
      </Head>
      <div className="-mb-12">
        <PageHeader>Farm</PageHeader>
        <PageSubheader>Earn passive income by lending to Hector</PageSubheader>
      </div>
      <Pool wallet={wallet} />
      <Farm wallet={wallet} />
      <Claim wallet={wallet} />
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

const Pool: VFC<{ wallet: Wallet }> = ({ wallet }) => {
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

const PoolDeposit: VFC<{ wallet: Wallet }> = ({ wallet }) => {
  const [tor, torInput, setTorInput] = useDecimalInput();
  const [dai, daiInput, setDaiInput] = useDecimalInput();
  const [usdc, usdcInput, setUsdcInput] = useDecimalInput();
  const [daiBalance, refreshDaiBalance] = useBalance(FANTOM_DAI, wallet);
  const [torBalance, refreshTorBalance] = useBalance(FANTOM_TOR, wallet);
  const [usdcBalance, refreshUsdcBalance] = useBalance(FANTOM_USDC, wallet);
  return (
    <>
      <CoinInput
        amount={torInput}
        onChange={setTorInput}
        tokenImage={TorLogo}
        tokenName="TOR"
        balance={torBalance}
        decimalAmount={FANTOM_TOR.decimals}
      />
      <CoinInput
        amount={daiInput}
        onChange={setDaiInput}
        tokenImage={DaiLogo}
        tokenName="DAI"
        balance={daiBalance}
        decimalAmount={FANTOM_DAI.decimals}
      />
      <CoinInput
        amount={usdcInput}
        onChange={setUsdcInput}
        tokenImage={UsdcLogo}
        tokenName="USDC"
        balance={usdcBalance}
        decimalAmount={FANTOM_USDC.decimals}
      />
      <Submit
        label="Deposit"
        disabled={tor.lte(0) && dai.lte(0) && usdc.lte(0)}
      />
    </>
  );
};

const PoolWithdraw: VFC<{ wallet: Wallet }> = ({ wallet }) => {
  const [output, setOutput] = useState<"dai" | "tor" | "usdc">("tor");
  const [curve, curveInput, setCurveInput] = useDecimalInput();
  const [curveBalance, refreshCurveBalance] = useBalance(FANTOM_TOR, wallet);
  return (
    <>
      <CoinInput
        amount={curveInput}
        onChange={setCurveInput}
        tokenImage={CurveLogo}
        tokenName={FANTOM_CURVE.symbol}
        balance={curveBalance}
        decimalAmount={FANTOM_USDC.decimals}
      />
      <RadioGroup label="Withdraw as">
        <Radio
          checked={output === "tor"}
          onCheck={() => {
            // refreshTorBalance();
            // refreshDaiBalance();
            // refreshUsdcBalance();
            // setDaiInput("");
            // setTorInput("");
            setOutput("tor");
          }}
        >
          <div className="flex justify-between">
            <div>{FANTOM_TOR.symbol}</div>
            <StaticImg
              src={TorLogo}
              alt={FANTOM_TOR.symbol}
              className="h-6 w-auto"
            />
          </div>
        </Radio>
        <Radio
          checked={output === "dai"}
          onCheck={() => {
            // refreshTorBalance();
            // refreshDaiBalance();
            // refreshUsdcBalance();
            // setDaiInput("");
            // setTorInput("");
            setOutput("dai");
          }}
        >
          <div className="flex justify-between">
            <div>{FANTOM_DAI.symbol}</div>
            <StaticImg
              src={DaiLogo}
              alt={FANTOM_DAI.symbol}
              className="h-6 w-auto"
            />
          </div>
        </Radio>
        <Radio
          checked={output === "usdc"}
          onCheck={() => {
            // refreshTorBalance();
            // refreshDaiBalance();
            // refreshUsdcBalance();
            // setDaiInput("");
            // setTorInput("");
            setOutput("usdc");
          }}
        >
          <div className="flex justify-between">
            <div>{FANTOM_USDC.symbol}</div>
            <StaticImg
              src={UsdcLogo}
              alt={FANTOM_USDC.symbol}
              className="h-6 w-auto"
            />
          </div>
        </Radio>
      </RadioGroup>
      <Submit label="Withdraw" disabled={curve.lte(0)} />
    </>
  );
};

const Farm: VFC<{ wallet: Wallet }> = ({ wallet }) => {
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
  return (
    <>
      <CoinInput
        amount={curveInput}
        onChange={setCurveInput}
        tokenImage={CurveLogo}
        tokenName={FANTOM_CURVE.symbol}
        balance={curveBalance}
        decimalAmount={FANTOM_USDC.decimals}
      />
      <Submit label="Stake" disabled={curve.lte(0)} />
    </>
  );
};

const Unstake: VFC<{ wallet: Wallet }> = ({ wallet }) => {
  const [curve, curveInput, setCurveInput] = useDecimalInput();
  const [curveBalance, refreshCurveBalance] = useBalance(FANTOM_CURVE, wallet);
  return (
    <>
      <CoinInput
        amount={curveInput}
        onChange={setCurveInput}
        tokenImage={CurveLogo}
        tokenName={FANTOM_CURVE.symbol}
        balance={curveBalance}
        decimalAmount={FANTOM_USDC.decimals}
      />
      <Submit label="Unstake" disabled={curve.lte(0)} />
    </>
  );
};

const Claim: VFC<{ wallet: Wallet }> = ({ wallet }) => {
  const [earned, refreshEarned] = useBalance(FANTOM_WFTM, wallet);
  return (
    <div className="space-y-4">
      <SectionTitle>Step 3: Claim</SectionTitle>
      <div className="flex items-center">
        <div>wFTM Rewards:</div>
        <div className="flex-grow" />
        <div className="flex items-center">
          <StaticImg src={WftmLogo} alt="WFTM" className="h-8 w-auto" />
          {earned.toString()}
        </div>
      </div>
      <Submit label="Claim" disabled={earned.lessThan(0.1)} />
    </div>
  );
};

export default FarmPage;
