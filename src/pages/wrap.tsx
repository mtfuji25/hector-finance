import Decimal from "decimal.js";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FANTOM } from "src/chain";
import { CoinInput } from "src/components/CoinInput";
import { PageHeader, PageSubheader } from "src/components/Header";
import { Submit } from "src/components/Submit";
import { Tab, Tabs } from "src/components/Tab";
import { Transaction, TransactionModal } from "src/components/Transaction";
import { FANTOM_HEC, FANTOM_sHEC, FANTOM_wsHEC } from "src/constants";
import { getStakingIndex } from "src/contracts/stakingContract";
import { getMarketPrice } from "src/contracts/uniswapV2";
import * as Staking from "src/contracts/wrapStakingContract";
import { useBalance } from "src/hooks/balance";
import { asyncEffect, useDecimalInput } from "src/util";
import { useWallet } from "src/wallet";
import Link from "next/link";
import { Notice } from "src/components/Notice";
import { DappPage } from "src/components/DappPage";

export default function WrapPage() {
  const wallet = useWallet(FANTOM);
  const [view, setView] = useState<"wrap" | "unwrap">("wrap");
  const [sHecPrice, setsHecPrice] = useState<Decimal>();
  const [wsHecPrice, setwsHecPrice] = useState<Decimal>();
  const [currentIndex, setCurrentIndex] = useState<Decimal>();
  const [tx, setTx] = useState<Transaction>();
  const [sHecBalance, refreshsHecBalance] = useBalance(
    FANTOM,
    FANTOM_sHEC,
    wallet,
  );
  const [wsHecBalance, refreshwsHecBalance] = useBalance(
    FANTOM,
    FANTOM_wsHEC,
    wallet,
  );
  const [sHec, sHecInput, setsHecInput] = useDecimalInput();
  const [wsHec, wsHecInput, setwsHecInput] = useDecimalInput();

  useEffect(() => {
    return asyncEffect(async (abort) => {
      const [price, index] = await Promise.all([
        getMarketPrice(FANTOM),
        getStakingIndex(FANTOM),
      ]);
      if (abort()) {
        return;
      }
      if (price.isOk) {
        setsHecPrice(price.value.div(FANTOM_sHEC.wei));
      }
      if (index.isOk) {
        setCurrentIndex(new Decimal(index.value).div(FANTOM_HEC.wei));
      }
    });
  }, []);

  useEffect(() => {
    if (sHecPrice && currentIndex) {
      setwsHecPrice(sHecPrice.times(currentIndex));
    }
  }, [sHecPrice, currentIndex]);

  return (
    <DappPage>
      <main className="w-full space-y-4">
        <Head>
          <title>Wrap — Hector Network</title>
        </Head>

        <div>
          <PageHeader>Wrap</PageHeader>
          <PageSubheader>Utilize your staked HEC tokens and wrap</PageSubheader>
        </div>

        <div className="flex flex-wrap justify-between text-center">
          <div>
            <div className="dark:text-gray-200">sHEC Price</div>
            {sHecPrice && (
              <div className="text-2xl font-medium text-orange-400">
                ${sHecPrice?.toFixed(2)}
              </div>
            )}
          </div>
          <div>
            <div className="dark:text-gray-200">Current Index</div>
            <div className="text-xl font-medium text-orange-400">
              {currentIndex && (
                <div className="text-2xl font-medium text-orange-400">
                  {currentIndex?.toFixed(2)}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="dark:text-gray-200">wsHEC Price</div>
            {wsHecPrice && (
              <div className="text-2xl font-medium text-orange-400">
                ${wsHecPrice?.toFixed(2)}
              </div>
            )}
          </div>
        </div>
        <Tabs>
          <Tab
            label="Wrap"
            selected={view === "wrap"}
            onSelect={() => {
              setwsHecInput("");
              setsHecInput("");
              refreshsHecBalance();
              setView("wrap");
            }}
          />
          <Tab
            label="Unwrap"
            selected={view === "unwrap"}
            onSelect={() => {
              setwsHecInput("");
              setsHecInput("");
              refreshwsHecBalance();
              setView("unwrap");
            }}
          />
        </Tabs>
        <div>
          {sHecBalance && view === "wrap" && (
            <CoinInput
              amount={sHecInput}
              token={FANTOM_sHEC}
              onChange={setsHecInput}
              balance={sHecBalance}
            />
          )}
          {wsHecBalance && view === "unwrap" && (
            <CoinInput
              amount={wsHecInput}
              token={FANTOM_wsHEC}
              onChange={setwsHecInput}
              balance={wsHecBalance}
            />
          )}
        </div>
        {view === "wrap" && sHecPrice && wsHecPrice && sHec.greaterThan(0) && (
          <div className="dark:text-gray-200">
            Wrapping <span className="text-orange-400">{sHec.toString()}</span>{" "}
            sHEC will result in wsHEC{" "}
            <span className="text-orange-400">
              {sHec
                .times(sHecPrice)
                .div(wsHecPrice)
                .toFixed(FANTOM_sHEC.decimals)}
            </span>
          </div>
        )}
        {view === "unwrap" && sHecPrice && wsHecPrice && wsHec.greaterThan(0) && (
          <div className="dark:text-gray-200">
            Unwrapping{" "}
            <span className="text-orange-400">{wsHec.toString()}</span> wsHEC
            will result in sHEC{" "}
            <span className="text-orange-400">
              {wsHec
                .times(wsHecPrice)
                .div(sHecPrice)
                .toFixed(FANTOM_wsHEC.decimals)}
            </span>
          </div>
        )}
        {wallet.connected && (
          <>
            {view === "wrap" && (
              <Submit
                label="Wrap"
                onClick={() =>
                  setTx({
                    title: "Wrap",
                    chain: FANTOM,
                    allowance: {
                      token: FANTOM_sHEC,
                      spender: FANTOM_wsHEC.address,
                      amount: sHec,
                    },
                    send: (wallet) =>
                      Staking.wrap(wallet.provider, wallet.address, sHec),
                  })
                }
                disabled={sHec.isZero() || sHec.gt(sHecBalance)}
              />
            )}
            {view === "unwrap" && (
              <Submit
                label="Unwrap"
                onClick={() =>
                  setTx({
                    title: "Unwrap",
                    chain: FANTOM,
                    allowance: {
                      token: FANTOM_wsHEC,
                      spender: FANTOM_wsHEC.address,
                      amount: wsHec,
                    },
                    send: (wallet) =>
                      Staking.unwrap(wallet.provider, wallet.address, wsHec),
                  })
                }
                disabled={wsHec.isZero() || wsHec.gt(wsHecBalance)}
              />
            )}
          </>
        )}
        {!wallet.connected && <Submit label="Connect wallet" />}

        <Notice>
          Wrapping is only available on Fantom. If you have HEC on another
          chain, you can{" "}
          <Link href="/bridge">
            <a className="underline">bridge</a>
          </Link>{" "}
          it to Fantom.
        </Notice>

        {tx && wallet.connected && (
          <TransactionModal
            wallet={wallet}
            tx={tx}
            onClose={(success) => {
              setTx(undefined);
              if (success) {
                setsHecInput("");
                setwsHecInput("");
              }
            }}
          />
        )}
      </main>
    </DappPage>
  );
}
