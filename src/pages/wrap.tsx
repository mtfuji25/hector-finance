import Decimal from "decimal.js";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CoinInput } from "src/components/CoinInput";
import {
  FANTOM,
  FANTOM_HECTOR,
  FANTOM_sHEC,
  FANTOM_wsHEC,
} from "src/constants";
import { getStakingIndex } from "src/contracts/stakingContract";
import { getMarketPrice } from "src/contracts/uniswapV2";
import { useAllowance } from "src/hooks/allowance";
import { useBalance } from "src/hooks/balance";
import { useDecimalInput } from "src/util";
import hectorImg from "public/icons/hector.svg";
import { useWallet, WalletState } from "src/wallet";
import { Submit } from "src/components/Submit";
import { unwrap, wrap } from "src/contracts/wrapStakingContract";
import { PageHeader, PageSubheader } from "src/components/Header";
import { Tab, Tabs } from "src/components/Tab";

export default function WrapPage() {
  const wallet = useWallet();
  const [view, setView] = useState<"wrap" | "unwrap">("wrap");
  const [marketPrice, setMarketPrice] = useState<Decimal>();
  const [currentIndex, setCurrentIndex] = useState<Decimal>();
  const [sHecBalance, refreshsHecBalance] = useBalance(FANTOM_sHEC, wallet);
  const [wsHecBalance, refreshwsHecBalance] = useBalance(FANTOM_wsHEC, wallet);
  const [sHec, sHecInput, setsHecInput] = useDecimalInput();
  const [wsHec, wsHecInput, setwsHecInput] = useDecimalInput();
  const wrapAllowance = useAllowance(FANTOM_sHEC, wallet, FANTOM.WSHEC_ADDRESS);
  const unWrapAllowance = useAllowance(
    FANTOM_wsHEC,
    wallet,
    FANTOM.WSHEC_ADDRESS,
  );

  useEffect(() => {
    const loadWrapData = async () => {
      if (wallet.state === WalletState.Connected) {
        Promise.all([
          getMarketPrice(wallet.provider),
          getStakingIndex(wallet.provider),
        ]).then(([marketPrice, index]) => {
          if (marketPrice.isOk) {
            setMarketPrice(marketPrice.value.div(FANTOM_sHEC.wei));
          }
          if (index.isOk) {
            setCurrentIndex(new Decimal(index.value).div(FANTOM_HECTOR.wei));
          }
        });
      }
    };

    loadWrapData();
  }, [wallet]);

  return (
    <main className="w-full space-y-4">
      <Head>
        <title>Wrap — Hector Finance</title>
      </Head>

      <div>
        <PageHeader>Wrap</PageHeader>
        <PageSubheader>Utilize your staked HEC tokens and wrap</PageSubheader>
      </div>

      <div className="flex flex-wrap justify-between text-center">
        <div>
          <div>sHEC Price</div>
          {marketPrice && (
            <div className="text-xl font-medium text-orange-400">
              ${marketPrice?.toFixed(2)}
            </div>
          )}
        </div>
        <div>
          <div>Current Index</div>
          <div className="text-xl font-medium text-orange-400">
            {currentIndex && (
              <div className="text-xl font-medium text-orange-400">
                {currentIndex?.toFixed(2)}
              </div>
            )}
          </div>
        </div>
        <div>
          <div>wsHEC Price</div>
          {currentIndex && marketPrice && (
            <div className="text-xl font-medium text-orange-400">
              ${marketPrice.times(currentIndex)?.toFixed(2)}
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
            tokenImage={hectorImg}
            tokenName="sHec"
            onChange={setsHecInput}
            balance={sHecBalance}
            decimalAmount={FANTOM_sHEC.decimals}
          />
        )}
        {wsHecBalance && view === "unwrap" && (
          <CoinInput
            amount={wsHecInput}
            tokenImage={hectorImg}
            tokenName="wsHec"
            onChange={setwsHecInput}
            balance={wsHecBalance}
            decimalAmount={FANTOM_wsHEC.decimals}
          />
        )}
      </div>
      {wallet.state === WalletState.Connected && (
        <>
          {view === "wrap" && (
            <>
              {wrapAllowance.type === "NoAllowance" && (
                <Submit onClick={wrapAllowance.approve} label={"Approve"} />
              )}
              {wrapAllowance.type === "Updating" && (
                <Submit label={"Updating..."} disabled />
              )}
              {wrapAllowance.type === "HasAllowance" && (
                <Submit
                  onClick={() => wrap(wallet.provider, wallet.address, sHec)}
                  label={"Wrap"}
                />
              )}
            </>
          )}
          {view === "unwrap" && (
            <>
              {unWrapAllowance.type === "NoAllowance" && (
                <Submit onClick={unWrapAllowance.approve} label={"Approve"} />
              )}
              {unWrapAllowance.type === "Updating" && (
                <Submit label={"Updating..."} disabled />
              )}
              {unWrapAllowance.type === "HasAllowance" && (
                <Submit
                  onClick={() => unwrap(wallet.provider, wallet.address, wsHec)}
                  label={"Unwrap"}
                />
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
