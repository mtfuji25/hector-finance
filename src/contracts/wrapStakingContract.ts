import {
  ProviderRpcError,
  sendTransaction,
  TransactionAddress,
  WalletProvider,
} from "src/providerEip1193";
import { Result } from "src/util";
import { Decimal } from "decimal.js";
import {
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
  token256,
} from "src/abi";
import { FANTOM_ADDRESS, FANTOM_sHEC, FANTOM_wsHEC } from "src/constants";

export async function wrap(
  provider: WalletProvider,
  owner: string,
  sHec: Decimal,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  const method = await methodId(WRAP_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: FANTOM_ADDRESS.WSHEC,
    data: "0x" + method + token256(FANTOM_sHEC, sHec),
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
  provider: WalletProvider,
  owner: string,
  wsHec: Decimal,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  const method = await methodId(UNWRAP_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: FANTOM_ADDRESS.WSHEC,
    data: "0x" + method + token256(FANTOM_wsHEC, wsHec),
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
