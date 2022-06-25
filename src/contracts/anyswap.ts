import Decimal from "decimal.js";
import {
  hex256,
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
  token256,
} from "src/abi";
import { BINANCE, Chain, FANTOM } from "src/chain";
import {
  BINANCE_ANYSWAP_HEC,
  BINANCE_ANYSWAP_TOR,
  BINANCE_HEC,
  BINANCE_TOR,
  FANTOM_ANYSWAP_HEC,
  FANTOM_ANYSWAP_TOR,
  FANTOM_HEC,
  FANTOM_TOR,
} from "src/constants";
import { ProviderRpcError, sendTransaction } from "src/provider";
import { Result } from "src/util";
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

export type AnyswapPair = {
  chain: Chain;
  router: AnyswapRouter;
  anyswap: Erc20Token;
  token: Erc20Token;
};

export const ANYSWAP_FANTOM_HEC: AnyswapPair = {
  token: FANTOM_HEC,
  anyswap: FANTOM_ANYSWAP_HEC,
  chain: FANTOM,
  router: FANTOM_ROUTER,
};

export const ANYSWAP_BINANCE_HEC: AnyswapPair = {
  token: BINANCE_HEC,
  anyswap: BINANCE_ANYSWAP_HEC,
  chain: BINANCE,
  router: BINANCE_ROUTER,
};

export const ANYSWAP_FANTOM_TOR: AnyswapPair = {
  token: FANTOM_TOR,
  anyswap: FANTOM_ANYSWAP_TOR,
  chain: FANTOM,
  router: FANTOM_ROUTER,
};

export const ANYSWAP_BINANCE_TOR: AnyswapPair = {
  token: BINANCE_TOR,
  anyswap: BINANCE_ANYSWAP_TOR,
  chain: BINANCE,
  router: BINANCE_ROUTER,
};

export async function swapOut(
  wallet: WriteWallet,
  from: AnyswapPair,
  to: AnyswapPair,
  amount: Decimal,
): Promise<Result<string, ProviderRpcError>> {
  const method = await methodId(SWAP_ABI);
  return sendTransaction(wallet.provider, {
    from: wallet.address,
    to: from.router.address,
    data:
      "0x" +
      method +
      hex256(from.anyswap.address) +
      hex256(wallet.address) +
      token256(from.token, amount) +
      hex256("0x" + to.chain.id.toString(16)),
  });
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
