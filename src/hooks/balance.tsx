import Decimal from "decimal.js";
import { useEffect, useMemo, useReducer, useState } from "react";
import { asyncEffect, sleep } from "src/util";
import { ConnectedWallet, Wallet } from "src/wallet";
import * as Erc20 from "src/contracts/erc20";
import { Erc20Token } from "src/contracts/erc20";
import { getBalance } from "src/provider";
import { Chain } from "src/chain";

/**
 * Returns a token balance that's periodically updated from the blockchain.
 *
 * Also returns a function you can use to immediately refresh a new balance if you
 * believe there might be changes.
 */
export function useBalance(
  chain: Chain,
  token: Erc20Token,
  wallet: Wallet,
): [Decimal, React.DispatchWithoutAction] {
  const [balance, setBalance] = useState(new Decimal(0));
  const [refreshes, refreshBalance] = useReducer(
    (prev: number): number => prev + 1,
    0,
  );

  useEffect(() => {
    return asyncEffect(async (abort) => {
      if (!wallet.connected) {
        return;
      }

      while (!abort()) {
        const newBalance = await tokenBalance(chain, token, wallet);
        if (abort()) {
          return;
        }

        if (newBalance) {
          setBalance((prev) => (prev.eq(newBalance) ? prev : newBalance));
        }

        // If this timeout is too slow, you can probably make it faster.
        await sleep(chain.millisPerBlock * 3);
      }
    });
  }, [chain, token, wallet, refreshes]);

  return useMemo(() => [balance, refreshBalance], [balance, refreshBalance]);
}

const NATIVE_WEI = new Decimal(10).pow(18);

async function tokenBalance(
  chain: Chain,
  token: Erc20Token,
  wallet: ConnectedWallet,
): Promise<Decimal | undefined> {
  if (token.address === "0x0000000000000000000000000000000000000000") {
    const result = await getBalance(chain, wallet.address);
    if (result.isOk) {
      return new Decimal(result.value).div(NATIVE_WEI);
    }
  } else {
    const result = await Erc20.balanceOf(chain, token, wallet.address);
    if (result.isOk) {
      return result.value;
    }
  }
}
