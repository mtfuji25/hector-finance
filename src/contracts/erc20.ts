import { Decimal } from "decimal.js";
import {
  hex256,
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
} from "src/abi";
import {
  call,
  Provider,
  ProviderRpcError,
  sendTransaction,
} from "src/provider";
import { Erc20Token, ok, Result } from "src/util";

export async function allowance(
  provider: Provider,
  token: Erc20Token,
  owner: string,
  spender: string,
): Promise<Result<Decimal, ProviderRpcError>> {
  owner = hex256(owner);
  spender = hex256(spender);
  const method = await methodId(ALLOWANCE_ABI);
  const result = await call(provider, {
    to: token.address,
    data: "0x" + method + owner + spender,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
  }
  const allowance = new Decimal(result.value).mul(token.wei);
  return ok(allowance);
}

const ALLOWANCE_ABI: Interface = {
  name: "allowance",
  type: InterfaceType.Function,
  stateMutability: StateMutability.View,
  inputs: [
    {
      name: "_owner",
      type: "address",
    },
    {
      name: "_spender",
      type: "address",
    },
  ],
  outputs: [
    {
      name: "",
      type: "uint256",
    },
  ],
};

export async function approve(
  provider: Provider,
  token: Erc20Token,
  owner: string,
  spender: string,
  allowance: Decimal,
): Promise<Result<boolean, ProviderRpcError>> {
  spender = hex256(spender);
  const allowance256 = hex256(allowance.mul(token.wei).trunc().toHex());
  const method = await methodId(APPROVE_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: token.address,
    data: "0x" + method + spender + allowance256,
  });
  if (!result.isOk) {
    return result;
  }
  const isSuccess = parseInt(result.value) === 1;
  return ok(isSuccess);
}

const APPROVE_ABI = {
  name: "approve",
  type: InterfaceType.Function,
  stateMutability: StateMutability.NonPayable,
  inputs: [
    {
      name: "_spender",
      type: "address",
    },
    {
      name: "_value",
      type: "uint256",
    },
  ],
  outputs: [
    {
      name: "",
      type: "bool",
    },
  ],
};

export async function balanceOf(
  provider: Provider,
  token: Erc20Token,
  owner: string,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(BALANCE_ABI);
  const result = await call(provider, {
    to: token.address,
    data: "0x" + method + hex256(owner),
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
  }
  const balance = new Decimal(result.value).div(token.wei);
  return ok(balance);
}

const BALANCE_ABI: Interface = {
  name: "balanceOf",
  type: InterfaceType.Function,
  stateMutability: StateMutability.View,
  inputs: [
    {
      name: "_owner",
      type: "address",
    },
  ],
  outputs: [
    {
      name: "balance",
      type: "uint256",
    },
  ],
};
