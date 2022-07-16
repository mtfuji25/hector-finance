import Decimal from "decimal.js";
import {
  hex256,
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
} from "src/abi";
import { Chain } from "src/chain";
import { call, ProviderRpcError } from "src/providerEip1193";
import { getParameter, ok, Result } from "src/util";

export async function booPerSecond(
  chain: Chain,
  address: string,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(BOO_PER_SECOND_ABI);
  const result = await call(chain, {
    to: address,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    return ok(new Decimal(0));
  }
  return ok(new Decimal(result.value).div(10 ** 18));
}

const BOO_PER_SECOND_ABI: Interface = {
  name: "booPerSecond",
  inputs: [],
  constant: true,
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};

export async function poolInfo(
  chain: Chain,
  address: string,
  pid: number,
): Promise<
  Result<
    { accBooPerShare: Decimal; lastRewardTime: Decimal; allocPoint: Decimal },
    ProviderRpcError
  >
> {
  const method = await methodId(POOL_INFO_ABI);
  const result = await call(chain, {
    to: address,
    data: "0x" + method + hex256("0x" + pid.toString(16)),
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
    return ok({
      accBooPerShare: new Decimal(0),
      lastRewardTime: new Decimal(0),
      allocPoint: new Decimal(0),
    });
  }

  const accBooPerShare = new Decimal(getParameter(0, result.value)).div(
    10 ** 18,
  );
  const lastRewardTime = new Decimal(getParameter(1, result.value));
  const allocPoint = new Decimal(getParameter(2, result.value));
  return ok({ accBooPerShare, lastRewardTime, allocPoint });
}

const POOL_INFO_ABI: Interface = {
  name: "poolInfo",
  inputs: [
    {
      name: "<input>",
      type: "uint256",
    },
  ],
  constant: true,
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};

export async function totalAllocPoint(
  chain: Chain,
  address: string,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(TOTAL_ALLOC_POINT_ABI);
  const result = await call(chain, {
    to: address,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    return ok(new Decimal(0));
  }
  return ok(new Decimal(result.value));
}

const TOTAL_ALLOC_POINT_ABI: Interface = {
  name: "totalAllocPoint",
  inputs: [],
  constant: true,
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};
