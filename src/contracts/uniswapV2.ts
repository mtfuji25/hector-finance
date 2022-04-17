import Decimal from "decimal.js";
import { Interface, InterfaceType, methodId, StateMutability } from "src/abi";
import { FANTOM } from "src/constants";
import {
  call,
  Provider,
  ProviderRpcError,
  sendTransaction,
  TransactionAddress,
} from "src/provider";
import { Result, ok, getParameter } from "src/util";

export async function getMarketPrice(
  provider: Provider,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(GET_RESERVES_ABI);
  const result = await call(provider, {
    to: FANTOM.DAILP_ADDRESS,
    data: "0x" + method,
  });
  if (!result.isOk) {
    return result;
  }
  if (result.value === "0x") {
    result.value = "0x0";
  }
  let marketPrice: Decimal = new Decimal("0");
  if (result.value !== "0x") {
    const reserve0 = new Decimal(getParameter(0, result.value));
    const reserve1 = new Decimal(getParameter(1, result.value));
    marketPrice = reserve1.div(reserve0);
  }
  return ok(marketPrice);
}

const GET_RESERVES_ABI: Interface = {
  constant: true,
  inputs: [],
  name: "getReserves",
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
