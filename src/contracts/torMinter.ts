import { Decimal } from "decimal.js";
import {
  hex256,
  Interface,
  methodId,
  StateMutability,
  InterfaceType,
} from "src/abi";
import {
  Provider,
  ProviderRpcError,
  sendTransaction,
  TransactionAddress,
} from "src/provider";
import { FANTOM_DAI, FANTOM_TOR, Result } from "src/util";

export const TOR_MINTER_ADDRESS = "0x9b0c6FfA7d0Ec29EAb516d3F2dC809eE43DD60ca";

export async function mintWithDai(
  provider: Provider,
  owner: string,
  dai: Decimal,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  const wei = hex256(dai.mul(FANTOM_DAI.wei).trunc().toHex());
  const method = await methodId(MINT_WITH_DAI_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: TOR_MINTER_ADDRESS,
    data: "0x" + method + wei,
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
  provider: Provider,
  owner: string,
  tor: Decimal,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  const wei = hex256(tor.mul(FANTOM_TOR.wei).trunc().toHex());
  const method = await methodId(REDEEM_TO_DAI_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: TOR_MINTER_ADDRESS,
    data: "0x" + method + wei,
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
