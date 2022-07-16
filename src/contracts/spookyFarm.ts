import Decimal from "decimal.js";
import { Interface, InterfaceType, methodId, StateMutability } from "src/abi";
import { Chain } from "src/chain";
import { call, ProviderRpcError } from "src/providerEip1193";
import { Result, ok, getParameter } from "src/util";
import { Erc20Token } from "./erc20";

export type Farm = {
  lp: Erc20Token;
  pid: number;
  token0: Erc20Token;
  token1: Erc20Token;
};

export async function getReserves(
  chain: Chain,
  farm: Farm,
): Promise<Result<[Decimal, Decimal], ProviderRpcError>> {
  const method = await methodId(GET_RESERVES_ABI);
  const result = await call(chain, {
    to: farm.lp.address,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
    return ok([new Decimal(0), new Decimal(0)]);
  }

  const reserve0 = new Decimal(getParameter(0, result.value)).div(
    farm.token0.wei,
  );
  const reserve1 = new Decimal(getParameter(1, result.value)).div(
    farm.token1.wei,
  );
  return ok([reserve0, reserve1]);
}

const GET_RESERVES_ABI: Interface = {
  name: "getReserves",
  inputs: [],
  constant: true,
  outputs: [
    {
      name: "reserve0",
      type: "uint112",
    },
    {
      name: "reserve1",
      type: "uint112",
    },
    {
      name: "blockTimestampLast",
      type: "uint32",
    },
  ],
  payable: false,
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};

export async function totalSupply(
  chain: Chain,
  farm: Farm,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(TOTAL_SUPPLY_ABI);
  const result = await call(chain, {
    to: farm.lp.address,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    return ok(new Decimal(0));
  }
  return ok(new Decimal(result.value).div(farm.lp.wei));
}

const TOTAL_SUPPLY_ABI: Interface = {
  name: "totalSupply",
  inputs: [],
  constant: true,
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};
