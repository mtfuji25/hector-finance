import {
  call,
  Provider,
  ProviderRpcError,
  sendTransaction,
  TransactionAddress,
} from "src/provider";
import { FANTOM_sHEC, FANTOM_wsHEC, Result } from "src/util";
import { Decimal } from "decimal.js";
import {
  hex256,
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
} from "src/abi";
import { FANTOM } from "src/constants";

export async function wrap(
  provider: Provider,
  owner: string,
  sHec: Decimal,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  const wei = hex256(sHec.mul(FANTOM_sHEC.wei).trunc().toHex());
  const method = await methodId(WRAP_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: FANTOM.WSHEC_ADDRESS,
    data: "0x" + method + wei,
  });
  return result;
}

const WRAP_ABI: Interface = {
  inputs: [
    {
      name: "_amount",
      type: "uint256",
    },
  ],
  name: "wrap",
  outputs: [
    {
      name: "",
      type: "uint256",
    },
  ],
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
};

export async function unwrap(
  provider: Provider,
  owner: string,
  wsHec: Decimal,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  const wei = hex256(wsHec.mul(FANTOM_wsHEC.wei).trunc().toHex());
  const method = await methodId(UNWRAP_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: FANTOM.WSHEC_ADDRESS,
    data: "0x" + method + wei,
  });
  return result;
}

const UNWRAP_ABI: Interface = {
  inputs: [
    {
      name: "_amount",
      type: "uint256",
    },
  ],
  name: "unwrap",
  outputs: [
    {
      name: "",
      type: "uint256",
    },
  ],
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
};
