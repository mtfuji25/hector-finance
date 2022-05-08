import Decimal from "decimal.js";
import { useMemo, useReducer, useState } from "react";
import { sleep, useAsyncEffect } from "src/util";
import { Wallet, WalletState } from "src/wallet";
import * as Erc20 from "src/contracts/erc20";
import { Erc20Token } from "src/contracts/erc20";
import { FANTOM_BLOCK_TIME } from "src/constants";

/**
 * Returns a token balance that's periodically updated from the blockchain.
 *
 * Also returns a function you can use to immediately refresh a new balance if you
 * believe there might be changes.
 */
export function useBalance(
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
