import Decimal from "decimal.js";
import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState, VFC } from "react";
import { CoinInput } from "src/components/CoinInput";
import { PageHeader, PageSubheader } from "src/components/Header";
import { Radio, RadioGroup } from "src/components/Radio";
import { StaticImg } from "src/components/StaticImg";
import { Submit } from "src/components/Submit";
import { Transaction, TransactionModal } from "src/components/Transaction";
import * as Anyswap from "src/contracts/anyswap";
import { useBalance } from "src/hooks/balance";
import ArrowRight from "src/icons/arrow-right-long-regular.svgr";
import { classes, useDecimalInput } from "src/util";
import { useWallet } from "src/wallet";

type BridgePair = {
  minBridge: Decimal;
  maxBridge: Decimal;
  minFee: Decimal;
  maxFee: Decimal;

  from: Anyswap.AnyswapPair;
  to: Anyswap.AnyswapPair;
  uuid: string;
};

const BRIDGES: BridgePair[] = [
  {
    from: Anyswap.ANYSWAP_FANTOM_HEC,
    to: Anyswap.ANYSWAP_BINANCE_HEC,
    minBridge: new Decimal(3),
    maxBridge: new Decimal(550),
    minFee: new Decimal(0.62),
    maxFee: new Decimal(123),
    uuid: "459fd753-b0ba-4eb1-8ade-7f92430e671b",
  },
  {
    from: Anyswap.ANYSWAP_BINANCE_HEC,
    to: Anyswap.ANYSWAP_FANTOM_HEC,
    minBridge: new Decimal(3),
    maxBridge: new Decimal(550),
    minFee: new Decimal(0.62),
    maxFee: new Decimal(123),
    uuid: "e0fd7835-695d-45e7-9088-f663c8ac471e",
  },
  {
    from: Anyswap.ANYSWAP_FANTOM_TOR,
    to: Anyswap.ANYSWAP_BINANCE_TOR,
    minBridge: new Decimal(12),
    maxBridge: new Decimal(5_000_000),
    minFee: new Decimal(5),
    maxFee: new Decimal(1000),
    uuid: "b4a8bb65-a00d-461f-82d2-d257cc779ff2",
  },
  {
    from: Anyswap.ANYSWAP_BINANCE_TOR,
    to: Anyswap.ANYSWAP_FANTOM_TOR,
    minBridge: new Decimal(12),
    maxBridge: new Decimal(5_000_000),
    minFee: new Decimal(5),
    maxFee: new Decimal(1000),
    uuid: "791bb9c3-7346-4bcc-a186-3fb0605df3bb",
  },
];

const BridgePage: NextPage = () => {
  const [bridge, setBridge] = useState<BridgePair>(BRIDGES[0]!);
  return (
    <main className="w-full space-y-4">
      <Head>
        <title>Bridge — Hector Finance</title>
      </Head>
      <div>
        <PageHeader>Bridge</PageHeader>
        <PageSubheader>Swap tokens between chains</PageSubheader>
      </div>

      <RadioGroup label="Source and destination">
        {BRIDGES.map((b) => {
          const isSelected = b.uuid === bridge.uuid;
          return (
            <Radio
              key={b.uuid}
              checked={isSelected}
              onCheck={() => setBridge(b)}
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-grow items-center gap-2">
                  <StaticImg
                    src={b.from.token.logo}
                    alt=""
                    className="h-5 w-5"
                  />
                  <div>{b.from.token.symbol}</div>
                </div>
                <div
                  className={classes(
                    "h-7 w-7 flex-shrink-0 rounded-full p-1.5",
                    !isSelected && "opacity-30",
                  )}
                  style={{ backgroundColor: b.from.chain.color }}
                >
                  <StaticImg
                    src={b.from.chain.logo}
                    alt=""
                    className="object-fit h-full w-full"
                    style={{ color: b.from.chain.color }}
                  />
                </div>
                <ArrowRight
                  className={classes("h-4 w-4", !isSelected && "opacity-50")}
                />
                <div
                  className={classes(
                    "h-7 w-7 flex-shrink-0 rounded-full p-1.5",
                    !isSelected && "opacity-30",
                  )}
                  style={{ backgroundColor: b.to.chain.color }}
                >
                  <StaticImg
                    src={b.to.chain.logo}
                    alt=""
                    className="object-fit h-full w-full"
                    style={{ color: b.to.chain.color }}
                  />
                </div>
              </div>
            </Radio>
          );
        })}
      </RadioGroup>

      <Swap bridge={bridge} />

      <div className="text-gray-600 dark:bg-gray-700 dark:text-gray-200">
        <div>Bridge usage:</div>
        <ul className="ml-5 list-outside list-disc">
          <li>
            0.1% fee
            <ul className="ml-5 list-outside list-disc">
              <li>
                Minimum fee: {bridge.minFee.toString()}{" "}
                {bridge.from.token.symbol}{" "}
              </li>
              <li>
                Maximum fee: {bridge.maxFee.toString()}{" "}
                {bridge.from.token.symbol}
              </li>
            </ul>
          </li>
          <li>
            Minimum bridge: {bridge.minBridge.toString()}{" "}
            {bridge.from.token.symbol}
          </li>
          <li>
            Maximum bridge: {bridge.maxBridge.toString()}{" "}
            {bridge.from.token.symbol}
          </li>
          <li>Transactions complete in 3 to 30 minutes</li>
          <li>
            If there&apos;s not enough liquidity, you will receive{" "}
            <a
              className="underline"
              target="_blank"
              rel="noreferrer"
              href={`${bridge.to.chain.explorers[0]}/token/${bridge.to.anyswap.address}`}
            >
              {bridge.to.anyswap.symbol} on {bridge.to.chain.longName}
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
};

const Swap: VFC<{ bridge: BridgePair }> = ({ bridge }) => {
  const from = bridge.from;
  const to = bridge.to;
  const wallet = useWallet(from.chain);
  const [out, outInput, setOutInput] = useDecimalInput();
  const [outBalance] = useBalance(from.chain, from.token, wallet);
  const [tx, setTx] = useState<Transaction>();
  useEffect(() => {
    setOutInput("");
  }, [setOutInput, bridge.uuid]);
  return (
    <>
      <CoinInput
        label="Bridge amount"
        token={from.token}
        amount={outInput}
        balance={outBalance}
        onChange={setOutInput}
      />
      <Submit
        label={`Bridge to ${to.chain.shortName}`}
        disabled={
          out.lt(bridge.minBridge) ||
          out.gt(bridge.maxBridge) ||
          out.gt(outBalance)
        }
        onClick={() => {
          setTx({
            allowance: {
              spender: from.router.address,
              token: from.token,
              amount: out,
            },
            title: `Bridge from ${from.chain.shortName} to ${to.chain.shortName}`,
            chain: from.chain,
            send: (wallet) => {
              const result = Anyswap.swapOut(wallet, from, to, out);
              return result;
            },
          });
        }}
      />
      <div>
        {wallet.connected && tx && (
          <TransactionModal
            tx={tx}
            wallet={wallet}
            onClose={(success) => {
              setTx(undefined);
              if (success) {
                setOutInput("");
              }
            }}
          />
        )}
      </div>
    </>
  );
};

export default BridgePage;
