import Decimal from "decimal.js";
import {
  hex256,
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
  token256,
} from "src/abi";
import { Chain } from "src/chain";
import { BINANCE_HEC, FANTOM_HEC } from "src/constants";
import { ProviderRpcError, sendTransaction } from "src/provider";
import { Result, ok } from "src/util";
import { WriteWallet } from "src/wallet";
import { Erc20Token } from "./erc20";

export class AnyswapRouter {
  address: string;
  constructor(address: string) {
    this.address = address;
  }
}

export const FANTOM_ROUTER = new AnyswapRouter(
  "0xb576c9403f39829565bd6051695e2ac7ecf850e2",
);

export const BINANCE_ROUTER = new AnyswapRouter(
  "0xabd380327fe66724ffda91a87c772fb8d00be488",
);

export type AnyswapToken = { address: string; token: Erc20Token };

export const FANTOM_ANY_HEC: AnyswapToken = {
  address: "0x8564bA78F88B744FcC6F9407B9AF503Ad35adAFC",
  token: FANTOM_HEC,
};

export const BINANCE_ANY_HEC: AnyswapToken = {
  address: "0xe98803E5cE78Cf8AAD43267d9852A4057423Cb1d",
  token: BINANCE_HEC,
};

export async function swapOut(
  wallet: WriteWallet,
  router: AnyswapRouter,
  token: AnyswapToken,
  amount: Decimal,
  toChain: Chain,
): Promise<Result<string, ProviderRpcError>> {
  const method = await methodId(SWAP_ABI);
  const result = await sendTransaction(wallet.provider, {
    from: wallet.address,
    to: router.address,
    data:
      "0x" +
      method +
      hex256(token.address) +
      hex256(wallet.address) +
      token256(token.token, amount) +
      hex256("0x" + toChain.id.toString(16)),
  });
  return result;
}

const SWAP_ABI: Interface = {
  inputs: [
    { name: "token", type: "address" },
    { name: "to", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "toChainID", type: "uint256" },
  ],
  name: "anySwapOutUnderlying",
  outputs: [],
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
};

const AMOUNT_IN_ABI: Interface = {
  inputs: [
    { name: "amountOut", type: "uint256" },
    { name: "reserveIn", type: "uint256" },
    { name: "reserveOut", type: "uint256" },
  ],
  name: "getAmountIn",
  outputs: [{ name: "amountIn", type: "uint256" }],
  stateMutability: StateMutability.Pure,
  type: InterfaceType.Function,
};

const AMOUNT_OUT_ABI: Interface = {
  inputs: [
    { name: "amountIn", type: "uint256" },
    { name: "reserveIn", type: "uint256" },
    { name: "reserveOut", type: "uint256" },
  ],
  name: "getAmountOut",
  outputs: [{ name: "amountOut", type: "uint256" }],
  stateMutability: StateMutability.Pure,
  type: InterfaceType.Function,
};
