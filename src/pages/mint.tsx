import { Decimal } from "decimal.js";
import { NextPage } from "next";
import Head from "next/head";
import { StaticImageData } from "next/image";
import DaiLogo from "public/icons/dai.svg";
import TorLogo from "public/icons/tor.svg";
import React, { useState, VFC } from "react";
import { CoinInput } from "src/components/CoinInput";
import { PageHeader, PageSubheader } from "src/components/Header";
import { StaticImg } from "src/components/StaticImg";
import { Submit } from "src/components/Submit";
import { Tab, Tabs } from "src/components/Tab";
import { FANTOM, FANTOM_DAI, FANTOM_TOR } from "src/constants";
import { mintWithDai, redeemToDai } from "src/contracts/torMinter";
import { useAllowance } from "src/hooks/allowance";
import { useBalance } from "src/hooks/balance";
import { useDecimalInput } from "src/util";
import { useWallet, WalletState } from "src/wallet";

const MintPage: NextPage = () => {
  const wallet = useWallet();
  const [dai, daiInput, setDaiInput] = useDecimalInput();
  const [tor, torInput, setTorInput] = useDecimalInput();
  const [view, setView] = useState<"mint" | "redeem">("mint");

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
  const [daiBalance, refreshDaiBalance] = useBalance(FANTOM_DAI, wallet);
  const [torBalance, refreshTorBalance] = useBalance(FANTOM_TOR, wallet);

  return (
    <main className="w-full space-y-4">
      <Head>
        <title>Mint — Hector Finance</title>
      </Head>
      <div>
        <PageHeader>Mint</PageHeader>
        <PageSubheader>
          Buy and sell Tor, Hector&apos;s stablecoin
        </PageSubheader>
      </div>

      {/* Choose mint or redeem. */}
      <Tabs>
        <Tab
          selected={view === "mint"}
          label="Mint"
          onSelect={() => {
            refreshDaiBalance();
            setDaiInput("");
            setTorInput("");
            setView("mint");
          }}
        />
        <Tab
          selected={view === "redeem"}
          label="Redeem"
          onSelect={() => {
            refreshTorBalance();
            setDaiInput("");
            setTorInput("");
            setView("redeem");
          }}
        />
      </Tabs>

      {/* Mint */}
      {view === "mint" && (
        <>
          <CoinInput
            label={"Selling"}
            tokenName="Dai"
            tokenImage={DaiLogo}
            amount={daiInput}
            onChange={setDaiInput}
            balance={daiBalance}
            decimalAmount={FANTOM_DAI.decimals}
          />
          <Buying amount={dai} tokenImage={TorLogo} tokenName="Tor" />
          {wallet.state !== WalletState.Connected && (
            <Submit label="Connect wallet" disabled />
          )}
          {wallet.state === WalletState.Connected &&
            daiAllowance.type === "Updating" && (
              <Submit label="Updating..." disabled />
            )}
          {wallet.state === WalletState.Connected &&
            daiAllowance.type === "NoAllowance" && (
              <Submit label="Approve" onClick={daiAllowance.approve} />
            )}
          {wallet.state === WalletState.Connected &&
            daiAllowance.type === "HasAllowance" && (
              <Submit
                label="Mint"
                disabled={dai.lte(0)}
                onClick={() =>
                  mintWithDai(wallet.provider, wallet.address, dai).then(
                    console.info,
                  )
                }
              />
            )}
        </>
      )}

      {/* Redeem */}
      {view === "redeem" && (
        <>
          <CoinInput
            amount={torInput}
            onChange={setTorInput}
            tokenImage={TorLogo}
            tokenName="Tor"
            balance={torBalance}
            label={"Selling"}
            decimalAmount={FANTOM_TOR.decimals}
          />
          <Buying amount={tor} tokenImage={DaiLogo} tokenName="Dai" />
          {wallet.state !== WalletState.Connected && (
            <Submit label="Connect wallet" disabled />
          )}
          {wallet.state === WalletState.Connected &&
            torAllowance.type === "Updating" && (
              <Submit label="Updating..." disabled />
            )}
          {wallet.state === WalletState.Connected &&
            torAllowance.type === "NoAllowance" && (
              <Submit label="Approve" onClick={torAllowance.approve} />
            )}
          {wallet.state === WalletState.Connected &&
            torAllowance.type === "HasAllowance" && (
              <Submit
                label="Redeem"
                disabled={tor.lte(0)}
                onClick={() =>
                  redeemToDai(wallet.provider, wallet.address, tor).then(
                    console.info,
                  )
                }
              />
            )}
        </>
      )}
    </main>
  );
};

const Buying: VFC<{
  amount: Decimal;
  tokenImage: StaticImageData;
  tokenName: string;
}> = ({ amount, tokenImage, tokenName }) => (
  <div className="block space-y-2">
    <div>Buying</div>
    <div
      className="flex h-12 items-center gap-2 rounded bg-gray-100 px-3"
      title={`${tokenName} purchase amount`}
    >
      <StaticImg src={tokenImage} alt={tokenName} className="h-6 w-6" />
      <div>{tokenName}</div>
      {amount.gt(0) ? (
        <div className="flex-grow text-right">≈ {amount.toString()}</div>
      ) : (
        <div className="flex-grow text-right text-gray-400">0.00</div>
      )}
    </div>
  </div>
);

export default MintPage;
