import {
  hex256,
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
  token256,
} from "src/abi";
import { getParameter, ok } from "src/util";
import { FANTOM_ADDRESS, FANTOM_HEC } from "src/constants";
import {
  call,
  ProviderRpcError,
  sendTransaction,
  TransactionAddress,
  WalletProvider,
} from "src/provider";
import { Result } from "src/util";
import { Decimal } from "decimal.js";
import { Chain } from "src/chain";

export interface EpochInfo {
  length: Decimal;
  number: Decimal;
  endBlock: Decimal;
  distribute: Decimal;
}

export async function getEpochInfo(
  chain: Chain,
): Promise<Result<EpochInfo, ProviderRpcError>> {
  const method = await methodId(STAKE_EPOCH_ABI);
  const result = await call(chain, {
    to: FANTOM_ADDRESS.STAKING,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    const zeroDecimal = new Decimal(0);
    return ok({
      length: zeroDecimal,
      number: zeroDecimal,
      endBlock: zeroDecimal,
      distribute: zeroDecimal,
    });
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
  chain: Chain,
): Promise<Result<string, ProviderRpcError>> {
  const method = await methodId(HECTOR_CIRC_SUPPLY);
  const result = await call(chain, {
    to: FANTOM_ADDRESS.SHEC,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
    return ok(result.value);
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
  chain: Chain,
): Promise<Result<string, ProviderRpcError>> {
  const method = await methodId(STAKING_INDEX);
  const result = await call(chain, {
    to: FANTOM_ADDRESS.STAKING,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
    return ok(result.value);
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
  provider: WalletProvider,
  owner: string,
  hec: Decimal,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  const method = await methodId(STAKE);
  const result = await sendTransaction(provider, {
    from: owner,
    to: FANTOM_ADDRESS.STAKING_HELPER,
    data: "0x" + method + token256(FANTOM_HEC, hec) + hex256(owner),
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

export async function unstake(
  provider: WalletProvider,
  owner: string,
  sHec: Decimal,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  const method = await methodId(UNSTAKE);
  const result = await sendTransaction(provider, {
    from: owner,
    to: FANTOM_ADDRESS.STAKING,
    data: "0x" + method + token256(FANTOM_HEC, sHec) + hex256(owner),
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
