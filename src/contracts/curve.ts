import Decimal from "decimal.js";
import {
  hex256,
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
  token256,
} from "src/abi";
import {
  FANTOM_DAI,
  FANTOM_TOR,
  FANTOM_USDC,
  FANTOM_CURVE,
} from "src/constants";
import { Provider, ProviderRpcError, sendTransaction } from "src/provider";
import { Result, ok } from "src/util";

const CURVE = "0x78D51EB71a62c081550EfcC0a9F9Ea94B2Ef081c";

export async function addLiquidity(
  provider: Provider,
  owner: string,
  pool: string,
  tor: Decimal,
  dai: Decimal,
  usdc: Decimal,
): Promise<Result<Decimal, ProviderRpcError>> {
  const minMintAmount = hex256(new Decimal(1).toHex());
  const method = await methodId(ADD_LIQUIDITY_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: CURVE,
    data:
      "0x" +
      method +
      hex256(pool) +
      token256(FANTOM_TOR, tor) +
      token256(FANTOM_DAI, dai) +
      token256(FANTOM_USDC, usdc) +
      minMintAmount,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
  }
  const deposited = new Decimal(result.value).mul(FANTOM_CURVE.wei);
  return ok(deposited);
}

const ADD_LIQUIDITY_ABI: Interface = {
  name: "add_liquidity",
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
  inputs: [
    { name: "_pool", type: "address" },
    { name: "_deposit_amounts", type: "uint256[3]" },
    { name: "_min_mint_amount", type: "uint256" },
  ],
};

export enum WithdrawAs {
  Tor = 0,
  Dai = 1,
  Usdc = 2,
}

export async function removeLiquidity(
  provider: Provider,
  owner: string,
  pool: string,
  tokens: Decimal,
  withdrawAs: WithdrawAs,
): Promise<Result<Decimal, ProviderRpcError>> {
  const minMintAmount = hex256(new Decimal(1).toHex());
  const method = await methodId(REMOVE_LIQUIDITY_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: CURVE,
    data:
      "0x" +
      method +
      hex256(pool) +
      token256(FANTOM_DAI, tokens) +
      hex256("0x" + withdrawAs.toString(16)) +
      minMintAmount +
      hex256(owner),
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
  }
  const withdrawn = new Decimal(result.value).mul(FANTOM_CURVE.wei);
  return ok(withdrawn);
}

const REMOVE_LIQUIDITY_ABI: Interface = {
  stateMutability: StateMutability.NonPayable,
  type: InterfaceType.Function,
  name: "remove_liquidity_one_coin",
  inputs: [
    { name: "_pool", type: "address" },
    { name: "_burn_amount", type: "uint256" },
    { name: "i", type: "int128" },
    { name: "_min_amount", type: "uint256" },
    { name: "_receiver", type: "address" },
  ],
};
