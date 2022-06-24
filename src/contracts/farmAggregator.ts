import Decimal from "decimal.js";
import {
  hex256,
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
} from "src/abi";
import { Chain } from "src/chain";
import { FANTOM_ADDRESS, FANTOM_TOR, FANTOM_USDC } from "src/constants";
import { call, ProviderRpcError } from "src/provider";
import { getParameter, ok, Result } from "src/util";

const VOID_ADDRESS = "0x0000000000000000000000000000000000000000";

export interface TorStats {
  apr: Decimal;
  tvl: Decimal;
}

export async function getTorStats(
  chain: Chain,
): Promise<Result<TorStats, ProviderRpcError>> {
  const method = await methodId(FARMING_AGGREGATOR_ABI);
  const result = await call(chain, {
    to: FANTOM_ADDRESS.FARMING_AGGREGATOR,
    data: "0x" + method + hex256(VOID_ADDRESS) + hex256(new Decimal(0).toHex()),
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
  }
  const tvl = new Decimal(getParameter(0, result.value)).div(FANTOM_TOR.wei);
  const apr = new Decimal(getParameter(1, result.value)).div(FANTOM_USDC.wei);
  return ok({
    apr,
    tvl,
  });
}

const FARMING_AGGREGATOR_ABI: Interface = {
  inputs: [
    {
      name: "wallet",
      type: "address",
    },
    {
      name: "amount",
      type: "uint256",
    },
  ],
  name: "getStakingInfo",
  outputs: [
    {
      name: "_tvl",
      type: "uint256",
    },
    {
      name: "_apr",
      type: "uint256",
    },
    {
      name: "_begin",
      type: "uint256",
    },
    {
      name: "_finish",
      type: "uint256",
    },
    {
      name: "_optimalHugsAmount",
      type: "uint256",
    },
    {
      name: "_optimalDaiAmount",
      type: "uint256",
    },
    {
      name: "_optimalUsdcAmount",
      type: "uint256",
    },
    {
      name: "_hugsWithdrawAmount",
      type: "uint256",
    },
    {
      name: "_daiWithdrawAmount",
      type: "uint256",
    },
    {
      name: "_usdcWithdrawAmount",
      type: "uint256",
    },
    {
      name: "_earnedRewardAmount",
      type: "uint256",
    },
  ],
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};
