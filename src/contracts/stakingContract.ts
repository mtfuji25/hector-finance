import {
  hex256,
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
} from "src/abi";
import { FANTOM_HECTOR, getParameter, ok } from "src/util";
import { FANTOM } from "src/constants";
import {
  call,
  Provider,
  ProviderRpcError,
  sendTransaction,
  TransactionAddress,
} from "src/provider";
import { Result } from "src/util";
import { Decimal } from "decimal.js";

export const HEC_DECIMAL = 9;

export interface EpochInfo {
  length: Decimal;
  number: Decimal;
  endBlock: Decimal;
  distribute: Decimal;
}

export async function getEpochInfo(
  provider: Provider,
): Promise<Result<EpochInfo, ProviderRpcError>> {
  const method = await methodId(STAKE_EPOCH_ABI);
  const result = await call(provider, {
    to: FANTOM.STAKING_ADDRESS,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  const length = new Decimal(getParameter(0, result.value));
  const number = new Decimal(getParameter(1, result.value));
  const endBlock = new Decimal(getParameter(2, result.value));
  const distribute = new Decimal(getParameter(3, result.value));

  return ok({ length, number, endBlock, distribute });
}

const STAKE_EPOCH_ABI: Interface = {
  inputs: [],
  name: "epoch",
  outputs: [
    {
      name: "length",
      type: "uint256",
    },
    {
      name: "number",
      type: "uint256",
    },
    {
      name: "endBlock",
      type: "uint256",
    },
    {
      name: "distribute",
      type: "uint256",
    },
  ],
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};

export async function getHecCircSupply(
  provider: Provider,
): Promise<Result<string, ProviderRpcError>> {
  const method = await methodId(HECTOR_CIRC_SUPPLY);
  const result = await call(provider, {
    to: FANTOM.SHEC_ADDRESS,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  const circ = new Decimal(getParameter(0, result.value));

  return ok(circ.toString());
}

const HECTOR_CIRC_SUPPLY: Interface = {
  inputs: [],
  name: "circulatingSupply",
  outputs: [{ name: "", type: "uint256" }],
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};

export async function getStakingIndex(
  provider: Provider,
): Promise<Result<string, ProviderRpcError>> {
  const method = await methodId(STAKING_INDEX);
  const result = await call(provider, {
    to: FANTOM.STAKING_ADDRESS,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  const index = new Decimal(getParameter(0, result.value));

  return ok(index.toString());
}

const STAKING_INDEX: Interface = {
  inputs: [],
  name: "index",
  outputs: [{ name: "", type: "uint256" }],
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};

export async function stake(
  provider: Provider,
  owner: string,
  hec: Decimal,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  const wei = hex256(hec.mul(FANTOM_HECTOR.wei).trunc().toHex());
  const method = await methodId(STAKE);
  const result = await sendTransaction(provider, {
    from: owner,
    to: FANTOM.STAKING_HELPER_ADDRESS,
    data: "0x" + method + wei + hex256(owner),
  });
  return result;
}

const STAKE: Interface = {
  inputs: [
    {
      name: "_amount",
      type: "uint256",
    },
    {
      name: "_recipient",
      type: "address",
    },
  ],
  name: "stake",
  outputs: [],
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
};

export async function unStake(
  provider: Provider,
  owner: string,
  sHec: Decimal,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  const wei = hex256(sHec.mul(FANTOM_HECTOR.wei).trunc().toHex());
  const method = await methodId(UNSTAKE);
  const result = await sendTransaction(provider, {
    from: owner,
    to: FANTOM.STAKING_ADDRESS,
    data: "0x" + method + wei + hex256(owner),
  });
  return result;
}

const UNSTAKE: Interface = {
  inputs: [
    { name: "_amount", type: "uint256" },
    { name: "_trigger", type: "bool" },
  ],
  name: "unstake",
  outputs: [],
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
};
