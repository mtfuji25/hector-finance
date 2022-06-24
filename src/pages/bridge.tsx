import { NextPage } from "next";
import Head from "next/head";
import React, { useState, VFC } from "react";
import { BINANCE, Chain, FANTOM } from "src/chain";
import { CoinInput } from "src/components/CoinInput";
import { PageHeader, PageSubheader } from "src/components/Header";
import { Submit } from "src/components/Submit";
import { Tab, Tabs } from "src/components/Tab";
import { Transaction, TransactionModal } from "src/components/Transaction";
import * as Anyswap from "src/contracts/anyswap";
import { useBalance } from "src/hooks/balance";
import { useDecimalInput } from "src/util";
import { useWallet } from "src/wallet";

const BridgePage: NextPage = () => {
  const [view, setView] = useState<"ftm-to-bsc" | "bsc-to-ftm">("ftm-to-bsc");
  return (
    <main className="w-full space-y-4">
      <Head>
        <title>Bridge — Hector Finance</title>
      </Head>
      <div>
        <PageHeader>Bridge</PageHeader>
        <PageSubheader>Send tokens to different chains for cheap</PageSubheader>
      </div>

      <Tabs>
        <Tab
          selected={view === "ftm-to-bsc"}
          label="Fantom to Binance"
          onSelect={() => {
            setView("ftm-to-bsc");
          }}
        />
        <Tab
          selected={view === "bsc-to-ftm"}
          label="Binance to Fantom"
          onSelect={() => {
            setView("bsc-to-ftm");
          }}
        />
      </Tabs>

      {view === "ftm-to-bsc" && (
        <Swap
          token={Anyswap.FANTOM_ANY_HEC}
          router={Anyswap.FANTOM_ROUTER}
          fromChain={FANTOM}
          toChain={BINANCE}
        />
      )}
      {view === "bsc-to-ftm" && (
        <Swap
          token={Anyswap.BINANCE_ANY_HEC}
          router={Anyswap.BINANCE_ROUTER}
          fromChain={BINANCE}
          toChain={FANTOM}
        />
      )}

      <div className="rounded-md bg-gray-100 py-5 px-7 text-gray-600 dark:bg-gray-700 dark:text-gray-200">
        <div>Note:</div>
        <ul className="list-inside list-disc">
          <li>Bridging costs around 0.6 HEC</li>
          <li>Bridging can take anywhere from 3-30 minutes</li>
        </ul>
      </div>
    </main>
  );
};

const Swap: VFC<{
  router: Anyswap.AnyswapRouter;
  token: Anyswap.AnyswapToken;
  fromChain: Chain;
  toChain: Chain;
}> = ({ router, token, fromChain, toChain }) => {
  const wallet = useWallet(fromChain);
  const [out, outInput, setOutInput] = useDecimalInput();
  const [outBalance] = useBalance(fromChain, token.token, wallet);
  const [tx, setTx] = useState<Transaction>();
  return (
    <>
      <CoinInput
        token={token.token}
        amount={outInput}
        balance={outBalance}
        onChange={setOutInput}
      />
      <Submit
        label={`Bridge to ${toChain.shortName}`}
        onClick={() => {
          setTx({
            allowance: {
              spender: router.address,
              token: token.token,
              amount: out,
            },
            title: `Bridge from ${fromChain.shortName} to ${toChain.shortName}`,
            chain: fromChain,
            send: (wallet) => {
              const result = Anyswap.swapOut(
                wallet,
                router,
                token,
                out,
                toChain,
              );
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
