import Decimal from "decimal.js";
import { useMemo } from "react";
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
  | { type: "NoWallet"; token: Erc20Token }
  | { type: "Updating"; token: Erc20Token }
  | { type: "NoAllowance"; token: Erc20Token; approve: () => void }
  | { type: "HasAllowance"; token: Erc20Token; disapprove: () => void };

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

        await sleep(FANTOM_BLOCK_TIME / 2);
      }
    },
    [token, wallet, allowance],
  );

  return useMemo(() => {
    if (wallet.state != WalletState.Connected) {
      return { type: "NoWallet", token };
    }
    if (allowance == undefined || !allowance.isFresh) {
      return { type: "Updating", token };
    }
    if (allowance.current.gt(0)) {
      return {
        type: "HasAllowance",
        token,
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
        token,
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
