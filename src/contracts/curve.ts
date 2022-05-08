import Decimal from "decimal.js";
import {
  hex256,
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
} from "src/abi";
import { Provider, ProviderRpcError, sendTransaction } from "src/provider";
import {
  FANTOM_CURVE,
  FANTOM_DAI,
  FANTOM_TOR,
  FANTOM_USDC,
  Result,
  ok,
} from "src/util";

const CURVE = "0x78D51EB71a62c081550EfcC0a9F9Ea94B2Ef081c";

export async function addLiquidity(
  provider: Provider,
  owner: string,
  pool: string,
  tor: Decimal,
  dai: Decimal,
  usdc: Decimal,
): Promise<Result<Decimal, ProviderRpcError>> {
  const dai256 = hex256(dai.mul(FANTOM_DAI.wei).trunc().toHex());
  const tor256 = hex256(tor.mul(FANTOM_TOR.wei).trunc().toHex());
  const usdc256 = hex256(usdc.mul(FANTOM_USDC.wei).trunc().toHex());
  const minMintAmount = hex256(new Decimal(1).toHex());
  const method = await methodId(ADD_LIQUIDITY_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: CURVE,
    data:
      "0x" + method + hex256(pool) + tor256 + dai256 + usdc256 + minMintAmount,
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
  const tokens256 = hex256(tokens.mul(FANTOM_DAI.wei).trunc().toHex());
  const minMintAmount = hex256(new Decimal(1).toHex());
  const method = await methodId(REMOVE_LIQUIDITY_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: CURVE,
    data:
      "0x" +
      method +
      hex256(pool) +
      tokens256 +
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
