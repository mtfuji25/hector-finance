import { Decimal } from "decimal.js";
import { Interface, InterfaceType, methodId, StateMutability } from "src/abi";
import { Chain } from "src/chain";
import { FANTOM_ADDRESS, FANTOM_HEC } from "src/constants";
import { call, ProviderRpcError } from "src/providerEip1193";
import { ok, Result } from "src/util";

export async function getHecBurned(
  chain: Chain,
): Promise<Result<Decimal, ProviderRpcError>> {
  const method = await methodId(HECTOR_BURNED);
  const [res1, res2] = await Promise.all([
    call(chain, {
      to: FANTOM_ADDRESS.HEC_BURN_ALLOCATOR,
      data: "0x" + method,
    }),
    call(chain, {
      to: FANTOM_ADDRESS.OLD_HEC_BURN_ALLOCATOR,
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
    new Decimal(res1.value).plus(new Decimal(res2.value)).div(FANTOM_HEC.wei),
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
