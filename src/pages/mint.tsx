import { Decimal } from "decimal.js";
import { NextPage } from "next";
import Head from "next/head";
import DaiLogo from "public/icons/dai.svg";
import TorLogo from "public/icons/tor.svg";
import React, { FC, useMemo, useReducer, useState, VFC } from "react";
import { StaticImg } from "src/components/StaticImg";
import * as Erc20 from "src/contracts/erc20";
import {
  mintWithDai,
  redeemToDai,
  TOR_MINTER_ADDRESS,
} from "src/contracts/torMinter";
import {
  classes,
  DecimalInput,
  Erc20Token,
  FANTOM_BLOCK_TIME,
  FANTOM_DAI,
  FANTOM_TOR,
  sleep,
  useAsyncEffect,
  useDecimalInput,
  validateEther,
} from "src/util";
import { useWallet, useWalletState, Wallet, WalletState } from "src/wallet";

const MintPage: NextPage = () => {
  const wallet = useWallet();
  const [dai, daiInput, setDaiInput] = useDecimalInput();
  const [tor, torInput, setTorInput] = useDecimalInput();
  const [view, setView] = useState<"mint" | "redeem">("mint");

  const daiAllowance = useAllowance(FANTOM_DAI, wallet);
  const torAllowance = useAllowance(FANTOM_TOR, wallet);
  const [daiBalance, refreshDaiBalance] = useBalance(FANTOM_DAI, wallet);
  const [torBalance, refreshTorBalance] = useBalance(FANTOM_TOR, wallet);

  return (
    <main className="w-full space-y-4">
      <Head>
        <title>Mint — Hector Finance</title>
      </Head>
      <div>
        <h1 className="text-2xl font-semibold">Mint</h1>
        <h2>Buy and sell Tor — Hector&apos;s stablecoin</h2>
      </div>

      {/* Choose mint or redeem. */}
      <div className="space-y-1">
        <Radio
          checked={view === "mint"}
          onCheck={() => {
            refreshDaiBalance();
            setDaiInput("");
            setTorInput("");
            setView("mint");
          }}
        >
          Mint
        </Radio>
        <Radio
          checked={view === "redeem"}
          onCheck={() => {
            refreshTorBalance();
            setDaiInput("");
            setTorInput("");
            setView("redeem");
          }}
        >
          Redeem
        </Radio>
      </div>

      {/* Mint */}
      {view === "mint" && (
        <>
          <Selling
            amount={daiInput}
            onChange={setDaiInput}
            tokenImage={DaiLogo}
            tokenName="Dai"
            balance={daiBalance}
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
          <Selling
            amount={torInput}
            onChange={setTorInput}
            tokenImage={TorLogo}
            tokenName="Tor"
            balance={torBalance}
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

const Selling: VFC<{
  amount: DecimalInput;
  tokenImage: StaticImageData;
  tokenName: string;
  balance: Decimal;
  onChange: (input: string) => void;
}> = ({ amount, tokenImage, tokenName, balance, onChange }) => (
  <div className="block space-y-2">
    <div className="flex">
      <div>Selling</div>
      <div className="flex-grow" />
      <button className="-m-2 p-2" onClick={() => onChange(balance.toString())}>
        MAX {balance.toFixed(2)}
      </button>
    </div>
    <div className="relative">
      <div className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 gap-2">
        <StaticImg src={tokenImage} alt={tokenName} className="h-6 w-6" />
        <div>{tokenName}</div>
      </div>
      <input
        className={classes(
          "w-full rounded px-3 py-3 pl-11 text-right",
          amount.isValid ? "bg-gray-100" : "bg-red-50 text-red-700",
        )}
        title={`${tokenName} sell amount`}
        pattern="[0-9]*"
        inputMode="decimal"
        value={amount.input}
        onChange={(e) => onChange(validateEther(e.target.value))}
        placeholder="0.00"
      />
    </div>
  </div>
);

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

const Submit: FC<{
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ label, onClick, disabled = false }) => (
  <input
    type="submit"
    className={classes(
      "ml-auto block rounded px-10 py-3",
      !disabled
        ? "cursor-pointer bg-orange-500 text-white"
        : "cursor-not-allowed bg-gray-200 text-gray-400",
    )}
    disabled={disabled}
    value={label}
    onClick={onClick}
  />
);

const Radio: FC<{ checked: boolean; onCheck: () => void }> = ({
  children,
  checked,
  onCheck,
}) => (
  <label
    className={classes(
      "flex cursor-pointer items-center gap-2.5 rounded px-4 py-3",
      checked
        ? "bg-gray-200"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200/70",
    )}
  >
    <div
      className={classes(
        "flex h-5 w-5 items-center justify-center rounded-full border-2 ",
        checked ? "border-gray-900" : "border-gray-700",
      )}
    >
      {checked && <div className="h-3 w-3 rounded-full bg-gray-800"></div>}
    </div>
    {children}
    <input
      type="radio"
      className="appearance-none"
      checked={checked}
      onChange={onCheck}
    />
  </label>
);

/// ===========================================================================
/// =============================== HOOKS =====================================
/// ===========================================================================

/**
 * Returns a token balance that's periodically updated from the blockchain.
 *
 * Also returns a function you can use to immediately refresh a new balance if you
 * believe there might be changes.
 */
function useBalance(
  token: Erc20Token,
  wallet: Wallet,
): [Decimal, React.DispatchWithoutAction] {
  const [balance, setBalance] = useState(new Decimal(0));

  /**
   * Whenever `refreshes` bumps, we need to restart the
   * polling `useAsyncEffect` below.
   */
  const [refreshes, refreshBalance] = useReducer(
    (prev: number): number => prev + 1,
    0,
  );

  useAsyncEffect(
    async (signal) => {
      if (wallet.state !== WalletState.Connected) {
        return;
      }

      while (!signal.abort) {
        const freshBalance = await Erc20.balanceOf(
          wallet.provider,
          token,
          wallet.address,
        );

        if (signal.abort) {
          return;
        }

        if (freshBalance.isOk) {
          setBalance((prev) =>
            prev.eq(freshBalance.value) ? prev : freshBalance.value,
          );
        }

        // If this timeout is too slow, you can probably make it faster.
        await sleep(FANTOM_BLOCK_TIME * 10);
      }
    },
    [token, wallet, refreshes],
  );

  return useMemo(() => [balance, refreshBalance], [balance, refreshBalance]);
}

/**
 * TODO: Documentation and abstraction.
 */
function useAllowance(token: Erc20Token, wallet: Wallet): Allowance {
  const [allowance, setAllowance] = useWalletState<
    Perishable<Decimal> | undefined
  >(undefined);

  useAsyncEffect(
    async (signal) => {
      if (wallet.state !== WalletState.Connected || allowance?.isFresh) {
        return;
      }

      while (!signal.abort) {
        const freshAllowance = await Erc20.allowance(
          wallet.provider,
          token,
          wallet.address,
          TOR_MINTER_ADDRESS,
        );

        if (signal.abort) {
          return;
        }

        if (freshAllowance.isOk) {
          const isTrulyFresh =
            allowance == undefined || !allowance.stale.eq(freshAllowance.value);

          if (isTrulyFresh) {
            setAllowance({ isFresh: true, current: freshAllowance.value });
            return;
          }
        }

        await sleep(FANTOM_BLOCK_TIME);
      }
    },
    [token, wallet, allowance],
  );

  return useMemo(() => {
    if (wallet.state != WalletState.Connected) {
      return { type: "NoWallet" };
    }
    if (allowance == undefined || !allowance.isFresh) {
      return { type: "Updating" };
    }
    if (allowance.current.gt(0)) {
      return {
        type: "HasAllowance",
        disapprove: async () => {
          const result = await Erc20.approve(
            wallet.provider,
            token,
            wallet.address,
            TOR_MINTER_ADDRESS,
            new Decimal(0),
          );
          if (result.isOk) {
            setAllowance({ isFresh: false, stale: allowance.current });
          }
        },
      };
    } else {
      return {
        type: "NoAllowance",
        approve: async () => {
          const result = await Erc20.approve(
            wallet.provider,
            token,
            wallet.address,
            TOR_MINTER_ADDRESS,
            new Decimal(1_000_000),
          );
          if (result.isOk) {
            setAllowance({ isFresh: false, stale: allowance.current });
          }
        },
      };
    }
  }, [wallet, allowance, setAllowance, token]);
}

/** A value that could be either fresh or stale. Ideally, values
 * should be kept fresh. If a value is made stale, replace it with
 * a fresh value ASAP! (probably by polling the blockchain)
 */
type Perishable<T> =
  | { isFresh: false; stale: T }
  | { isFresh: true; current: T };

type Allowance =
  | { type: "NoWallet" }
  | { type: "Updating" }
  | { type: "NoAllowance"; approve: () => void }
  | { type: "HasAllowance"; disapprove: () => void };

export default MintPage;
