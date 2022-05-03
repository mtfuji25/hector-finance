import {
  hex256,
  Interface,
  InterfaceType,
  methodId,
  StateMutability,
} from "src/abi";
import { FANTOM_HECTOR, getParameter, ok } from "src/util";
import { FANTOM } from "src/constants";
import {
  call,
  Provider,
  ProviderRpcError,
  sendTransaction,
  TransactionAddress,
} from "src/provider";
import { Result } from "src/util";
import { Decimal } from "decimal.js";

export async function getHecBurned(
  provider: Provider,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(HECTOR_BURNED);
  const [res1, res2] = await Promise.all([
    call(provider, {
      to: FANTOM.HEC_BURN_ALLOCATOR,
      data: "0x" + method,
    }),
    call(provider, {
      to: FANTOM.OLD_HEC_BURN_ALLOCATOR,
      data: "0x" + method,
    }),
  ]);
  if (!res1.isOk) {
    return res1;
  }
  if (!res2.isOk) {
    return res2;
  }
  if (res1.value === "0x") {
    res1.value = "0x0";
    return ok(new Decimal(res1.value));
  }
  return ok(
    new Decimal(res1.value)
      .plus(new Decimal(res2.value))
      .div(FANTOM_HECTOR.wei),
  );
}

const HECTOR_BURNED: Interface = {
  inputs: [],
  name: "totalBurnt",
  outputs: [
    {
      name: "",
      type: "uint256",
    },
  ],
  stateMutability: StateMutability.View,
  type: InterfaceType.Function,
};
