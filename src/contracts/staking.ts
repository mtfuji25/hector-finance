import Decimal from "decimal.js";
import {
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
  token256,
} from "src/abi";
import { Provider, ProviderRpcError, sendTransaction } from "src/provider";
import { Result, ok } from "src/util";
import { Erc20Token } from "./erc20";

export type Farm = {
  address: string;
  stake: Erc20Token;
  reward: Erc20Token;
};

export async function allowance(
  provider: Provider,
  farm: Farm,
  owner: string,
  amount: Decimal,
): Promise<Result<null, ProviderRpcError>> {
  const method = await methodId(STAKE_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: farm.address,
    data: "0x" + method + token256(farm.reward, amount),
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
  }
  return ok(null);
}

const STAKE_ABI: Interface = {
  inputs: [{ name: "amount", type: "uint256" }],
  name: "stake",
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
};

const WITHDRAW_ABI: Interface = {
  name: "withdraw",
  inputs: [{ name: "amount", type: "uint256" }],
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
};
