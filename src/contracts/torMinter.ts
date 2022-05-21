import { Decimal } from "decimal.js";
import {
  Interface,
  methodId,
  StateMutability,
  InterfaceType,
  token256,
} from "src/abi";
import { Chain } from "src/chain";
import { FANTOM_ADDRESS, FANTOM_DAI, FANTOM_TOR } from "src/constants";
import {
  call,
  ProviderRpcError,
  sendTransaction,
  TransactionAddress,
  WalletProvider,
} from "src/provider";
import { ok, Result } from "src/util";

export const TOR_MINTER_ADDRESS = "0x9b0c6FfA7d0Ec29EAb516d3F2dC809eE43DD60ca";

export async function mintWithDai(
  provider: WalletProvider,
  owner: string,
  dai: Decimal,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  const method = await methodId(MINT_WITH_DAI_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: TOR_MINTER_ADDRESS,
    data: "0x" + method + token256(FANTOM_DAI, dai),
  });
  return result;
}
const MINT_WITH_DAI_ABI: Interface = {
  inputs: [
    {
      name: "_daiAmount",
      type: "uint256",
    },
  ],
  name: "mintWithDai",
  outputs: [
    {
      name: "_torAmount",
      type: "uint256",
    },
  ],
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
};

export async function redeemToDai(
  provider: WalletProvider,
  owner: string,
  tor: Decimal,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  const method = await methodId(REDEEM_TO_DAI_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: TOR_MINTER_ADDRESS,
    data: "0x" + method + token256(FANTOM_TOR, tor),
  });
  return result;
}

const REDEEM_TO_DAI_ABI: Interface = {
  inputs: [
    {
      name: "_torAmount",
      type: "uint256",
    },
  ],
  name: "redeemToDai",
  outputs: [
    {
      name: "_daiAmount",
      type: "uint256",
    },
  ],
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
};

export async function getMintLimit(
  chain: Chain,
  owner: string,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(MINT_LIMIT_ABI);
  const result = await call(chain, {
    from: owner,
    to: FANTOM_ADDRESS.TOR_REDEEM,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
  }
  return ok(new Decimal(result.value).div(FANTOM_TOR.wei));
}

const MINT_LIMIT_ABI: Interface = {
  inputs: [],
  name: "getCurrentMintBuffer",
  outputs: [
    {
      name: "_mintBuffer",
      type: "uint256",
    },
  ],
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};

export async function getRedeemLimit(
  chain: Chain,
  owner: string,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(REDEEM_LIMIT_ABI);
  const result = await call(chain, {
    from: owner,
    to: FANTOM_ADDRESS.TOR_REDEEM,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
  }
  return ok(new Decimal(result.value).div(FANTOM_TOR.wei));
}

const REDEEM_LIMIT_ABI: Interface = {
  inputs: [],
  name: "getCurrentRedeemBuffer",
  outputs: [
    {
      name: "_redeemBuffer",
      type: "uint256",
    },
  ],
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};
