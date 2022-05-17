import { Decimal } from "decimal.js";
import { StaticImageData } from "next/image";
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
  TokenAddress,
} from "src/provider";
import { ok, Result } from "src/util";

export interface Erc20Token {
  name: string;
  symbol: string;
  logo: StaticImageData;
  address: TokenAddress;
  chain: number;

  /**
   * The number of decimal places this token can represent.
   * Otherwise known as _precision_.
   *
   * Most tokens are 18 decimals, some are not.
   *
   * Don't use this property for converting to/from wei. Use {@link wei} for that.
   */
  decimals: number;

  /**
   * The amount of wei in a single token. You should use this
   * when converting to/from values used by the blockchain!
   * ```ts
   * balance.mul(token.wei); // From tokens to wei
   * balance.div(token.wei); // From wei to tokens
   * ```
   */
  wei: Decimal;
}

export interface LpToken extends Erc20Token {
  reserveAddress: TokenAddress;
  lpURL: string;
  isFour: boolean;
}

export async function allowance(
  provider: Provider,
  token: Erc20Token,
  owner: string,
  spender: string,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(ALLOWANCE_ABI);
  const result = await call(provider, {
    to: token.address,
    data: "0x" + method + hex256(owner) + hex256(spender),
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
  const method = await methodId(APPROVE_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: token.address,
    data: "0x" + method + spender + token256(token, allowance),
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

export async function getTotalSupply(
  provider: Provider,
  token: Erc20Token,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(TOTAL_SUPPLY);
  const result = await call(provider, {
    to: token.address,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
  }
  return ok(new Decimal(result.value).div(token.wei));
}

const TOTAL_SUPPLY: Interface = {
  inputs: [],
  name: "totalSupply",
  outputs: [
    {
      name: "",
      type: "uint256",
    },
  ],
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};
