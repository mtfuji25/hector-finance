import { Decimal } from "decimal.js";
import { hex256, Interface, methodId } from "src/abi";
import _abi from "./erc20.json";
import {
  call,
  Provider,
  ProviderRpcError,
  sendTransaction,
} from "src/provider";
import { Erc20Token, ok, Result } from "src/util";

const abi = _abi as Interface[];

const ALLOWANCE_ABI = abi.find((a) => a.name === "allowance")!;
export async function allowance(
  provider: Provider,
  token: Erc20Token,
  owner: string,
  spender: string,
): Promise<Result<Decimal, ProviderRpcError>> {
  owner = hex256(owner);
  spender = hex256(spender);
  const method = await methodId(ALLOWANCE_ABI);
  const result = await call(provider, {
    to: token.address,
    data: "0x" + method + owner + spender,
  });
  if (!result.isOk) {
    return result;
  }
  const allowance = new Decimal(result.value).mul(token.wei);
  return ok(allowance);
}

const APPROVE_ABI = abi.find((a) => a.name === "approve")!;
export async function approve(
  provider: Provider,
  token: Erc20Token,
  owner: string,
  spender: string,
  allowance: Decimal,
): Promise<Result<boolean, ProviderRpcError>> {
  spender = hex256(spender);
  const allowance256 = hex256(allowance.mul(token.wei).trunc().toHex());
  const method = await methodId(APPROVE_ABI);
  const result = await sendTransaction(provider, {
    from: owner,
    to: token.address,
    data: "0x" + method + spender + allowance256,
  });
  if (!result.isOk) {
    return result;
  }
  const isSuccess = parseInt(result.value) === 1;
  return ok(isSuccess);
}

const BALANCE_ABI = abi.find((a) => a.name === "balanceOf")!;
export async function balanceOf(
  provider: Provider,
  token: Erc20Token,
  owner: string,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(BALANCE_ABI);
  const result = await call(provider, {
    to: token.address,
    data: "0x" + method + hex256(owner),
  });
  if (!result.isOk) {
    return result;
  }
  const balance = new Decimal(result.value).div(token.wei);
  return ok(balance);
}
