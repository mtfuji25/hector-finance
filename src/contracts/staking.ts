import Decimal from "decimal.js";
import {
  hex256,
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
  token256,
} from "src/abi";
import {
  call,
  Provider,
  ProviderRpcError,
  sendTransaction,
} from "src/provider";
import { Result, ok } from "src/util";
import { Erc20Token } from "./erc20";

export type Farm = {
  address: string;
  stake: Erc20Token;
  reward: Erc20Token;
};

export async function stake(
  farm: Farm,
  provider: Provider,
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
  return ok(null);
}

const STAKE_ABI: Interface = {
  inputs: [{ name: "amount", type: "uint256" }],
  name: "stake",
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
};

export async function withdraw(
  farm: Farm,
  provider: Provider,
  owner: string,
  amount: Decimal,
): Promise<Result<null, ProviderRpcError>> {
  const method = await methodId(WITHDRAW_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: farm.address,
    data: "0x" + method + token256(farm.reward, amount),
  });
  if (!result.isOk) {
    return result;
  }
  return ok(null);
}

const WITHDRAW_ABI: Interface = {
  name: "withdraw",
  inputs: [{ name: "amount", type: "uint256" }],
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
};

export async function getReward(
  farm: Farm,
  provider: Provider,
  owner: string,
): Promise<Result<null, ProviderRpcError>> {
  const method = await methodId(GET_REWARD_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: farm.address,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  return ok(null);
}

const GET_REWARD_ABI: Interface = {
  name: "getReward",
  inputs: [],
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
};

export async function earned(
  farm: Farm,
  provider: Provider,
  owner: string,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(EARNED_ABI);
  const result = await call(provider, {
    to: farm.address,
    data: "0x" + method + hex256(owner),
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
  }
  const earned = new Decimal(result.value).div(farm.reward.wei);
  return ok(earned);
}

const EARNED_ABI: Interface = {
  inputs: [{ name: "account", type: "address" }],
  name: "earned",
  outputs: [{ name: "", type: "uint256" }],
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};
