import Decimal from "decimal.js";
import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState, VFC } from "react";
import { CoinInput } from "src/components/CoinInput";
import { PageHeader, PageSubheader } from "src/components/Header";
import { Notice } from "src/components/Notice";
import { Radio, RadioGroup } from "src/components/BasicInput";
import { StaticImg } from "src/components/StaticImg";
import { Submit } from "src/components/Submit";
import { Transaction, TransactionModal } from "src/components/Transaction";
import * as Anyswap from "src/contracts/anyswap";
import { useBalance } from "src/hooks/balance";
import ArrowRight from "src/icons/arrow-right-long-regular.svgr";
import { classes, useDecimalInput } from "src/util";
import { useWallet } from "src/wallet";
import { DappPage } from "src/components/DappPage";

type BridgePair = {
  minBridge: Decimal;
  maxBridge: Decimal;
  minFee: Decimal;
  maxFee: Decimal;

  from: Anyswap.AnyswapPair;
  to: Anyswap.AnyswapPair;
  uuid: string;
};

const ANYSWAP_FEE = new Decimal(0.1);

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
    <DappPage>
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

        <Notice>
          If liquidity is too low, you will receive{" "}
          <a
            className="underline"
            target="_blank"
            rel="noreferrer"
            href={`${bridge.to.chain.explorers[0]}/token/${bridge.to.anyswap.address}`}
          >
            {bridge.to.anyswap.symbol} on {bridge.to.chain.longName}
          </a>
        </Notice>
      </main>
    </DappPage>
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
  let fee = out.mul(ANYSWAP_FEE);
  if (fee.lt(bridge.minFee)) {
    fee = bridge.minFee;
  }
  if (fee.gt(bridge.maxFee)) {
    fee = bridge.maxFee;
  }

  const isBadTransaction =
    out.lt(bridge.minBridge) || out.gt(bridge.maxBridge) || out.gt(outBalance);

  return (
    <>
      <CoinInput
        label="Bridge amount"
        token={from.token}
        amount={outInput}
        balance={outBalance}
        onChange={setOutInput}
      />
      <div className="space-y-1.5">
        <div className="flex">
          <div>Min amount:</div>
          <div className="flex-grow" />
          <div>
            {bridge.minBridge.toString()} {bridge.from.token.symbol}
          </div>
        </div>
        <div className="flex">
          <div>Max amount:</div>
          <div className="flex-grow" />
          <div>
            {bridge.maxBridge.toString()} {bridge.from.token.symbol}
          </div>
        </div>
        <div className="flex">
          <div>Transaction time:</div>
          <div className="flex-grow" />
          <div>3-30 mins</div>
        </div>
        <div className="flex">
          <div>Bridge fee (0.1%):</div>
          <div className="flex-grow" />
          {!isBadTransaction && (
            <div>
              {fee.toString()} {bridge.to.token.symbol}
            </div>
          )}
          {isBadTransaction && <div>~</div>}
        </div>
        <div className="flex">
          <div>Minimum received on {bridge.to.chain.shortName}:</div>
          <div className="flex-grow" />
          {!isBadTransaction && (
            <div>
              {out.minus(fee).toString()} {bridge.to.token.symbol}
            </div>
          )}
          {isBadTransaction && <div>~</div>}
        </div>
      </div>
      <Submit
        label={`Bridge to ${to.chain.shortName}`}
        disabled={isBadTransaction}
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
