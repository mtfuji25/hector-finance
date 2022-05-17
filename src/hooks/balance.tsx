import Decimal from "decimal.js";
import { useMemo, useReducer, useState } from "react";
import { sleep, useAsyncEffect } from "src/util";
import { ConnectedWallet, Wallet, WalletState } from "src/wallet";
import * as Erc20 from "src/contracts/erc20";
import { Erc20Token } from "src/contracts/erc20";
import { FANTOM_BLOCK_TIME } from "src/constants";
import { getBalance } from "src/provider";

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
        const newBalance = await tokenBalance(wallet, token);
        if (signal.abort) {
          return;
        }

        if (newBalance) {
          setBalance((prev) => (prev.eq(newBalance) ? prev : newBalance));
        }

        // If this timeout is too slow, you can probably make it faster.
        await sleep(FANTOM_BLOCK_TIME * 10);
      }
    },
    [token, wallet, refreshes],
  );

  return useMemo(() => [balance, refreshBalance], [balance, refreshBalance]);
}

const NATIVE_WEI = new Decimal(10).pow(18);

async function tokenBalance(
  wallet: ConnectedWallet,
  token: Erc20Token,
): Promise<Decimal | undefined> {
  if (
    wallet.network === token.chain &&
    token.address === "0x0000000000000000000000000000000000000000"
  ) {
    const result = await getBalance(wallet.provider, wallet.address);
    if (result.isOk) {
      return new Decimal(result.value).div(NATIVE_WEI);
    }
  } else {
    const result = await Erc20.balanceOf(
      wallet.provider,
      token,
      wallet.address,
    );
    if (result.isOk) {
      return result.value;
    }
  }
}
