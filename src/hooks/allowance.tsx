import Decimal from "decimal.js";
import { useMemo } from "react";
import { TOR_MINTER_ADDRESS } from "src/contracts/torMinter";
import { Erc20Token, FANTOM_BLOCK_TIME, sleep, useAsyncEffect } from "src/util";
import { useWalletState, Wallet, WalletState } from "src/wallet";
import * as Erc20 from "src/contracts/erc20";

/** A value that could be either fresh or stale. Ideally, values
 * should be kept fresh. If a value is made stale, replace it with
 * a fresh value ASAP! (probably by polling the blockchain)
 */
export type Perishable<T> =
  | { isFresh: false; stale: T }
  | { isFresh: true; current: T };

export type Allowance =
  | { type: "NoWallet" }
  | { type: "Updating" }
  | { type: "NoAllowance"; approve: () => void }
  | { type: "HasAllowance"; disapprove: () => void };

export function useAllowance(
  token: Erc20Token,
  wallet: Wallet,
  spender: string,
): Allowance {
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
          spender,
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
            spender,
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
            spender,
            new Decimal(1_000_000_000),
          );
          if (result.isOk) {
            setAllowance({ isFresh: false, stale: allowance.current });
          }
        },
      };
    }
  }, [wallet, allowance, setAllowance, token, spender]);
}
