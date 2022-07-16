import Decimal from "decimal.js";
import { VFC, useState, useEffect } from "react";
import { FANTOM } from "src/chain";
import {
  FANTOM_SPOOKY_FTM_TOR,
  FANTOM_SPOOKY_FTM_WSHEC,
  FANTOM_TOR,
  FANTOM_WFTM,
  FANTOM_wsHEC,
} from "src/constants";
import { formatCurrency } from "src/util";
import * as SpookyFarm from "src/contracts/spookyFarm";
import * as Erc20 from "src/contracts/erc20";
import * as SpookyMasterChef from "src/contracts/spookyMasterChef";
import ExternalIcon from "src/icons/arrow-up-right-from-square-regular.svgr";

export const FarmFtmTor = () => {
  return <div className="space-y-6"></div>;
};

const SPOOKY_FTM_TOR: SpookyFarm.Farm = {
  lp: FANTOM_SPOOKY_FTM_TOR,
  pid: 5,
  token0: FANTOM_WFTM,
  token1: FANTOM_TOR,
};

const SPOOKY_FTM_WSHEC: SpookyFarm.Farm = {
  lp: FANTOM_SPOOKY_FTM_WSHEC,
  pid: 31,
  token0: FANTOM_WFTM,
  token1: FANTOM_wsHEC,
};

const FARMS = [SPOOKY_FTM_TOR, SPOOKY_FTM_WSHEC];

const SPOOKY_MASTER_CHEF = "0x18b4f774fdC7BF685daeeF66c2990b1dDd9ea6aD";

const SpookyFarmPage: VFC<{ farm: SpookyFarm.Farm }> = ({ farm }) => {
  return (
    <div className="space-y-5">
      <FarmStats farm={farm} />

      <a
        href={`https://spooky.fi/#/add/FTM/${farm.token1.address}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 rounded bg-orange-400 p-3.5 text-center text-white"
      >
        <div>Pool</div>
        <ExternalIcon className="mb-1 h-4 w-4" />
      </a>
      <a
        href="https://spooky.fi/#/farms"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 rounded bg-orange-400 p-3.5 text-center text-white"
      >
        Stake
        <ExternalIcon className="mb-1 h-4 w-4" />
      </a>
    </div>
  );
};

export const SpookyFtmWshecFarm = () => (
  <SpookyFarmPage farm={SPOOKY_FTM_WSHEC} />
);
export const SpookyFtmTorFarm = () => <SpookyFarmPage farm={SPOOKY_FTM_TOR} />;

const FarmStats: VFC<{ farm: SpookyFarm.Farm }> = ({ farm }) => {
  const [stats, setStats] = useState<FarmStats>();

  useEffect(() => {
    (async () => {
      const s = await getFarmStats(farm);
      setStats(s);
    })();
  }, [farm]);

  return (
    <div className="flex flex-wrap justify-around text-center">
      <div>
        <div className="dark:text-gray-200">APR</div>
        {stats && (
          <div className="text-2xl font-medium text-orange-400">
            {stats.apr?.mul(100).toFixed(2)}%
          </div>
        )}
      </div>
      <div>
        <div className="dark:text-gray-200">Total Deposited</div>
        {stats && (
          <div className="text-2xl font-medium text-orange-400">
            {formatCurrency(stats.tvl.toNumber(), 2)}
          </div>
        )}
      </div>
    </div>
  );
};

type FarmStats = {
  tvl: Decimal;
  apr: Decimal;
};
async function getFarmStats(farm: SpookyFarm.Farm): Promise<FarmStats> {
  const prices = await coingeckoPrices(
    FARMS.flatMap((farm) => [
      farm.token0.coingecko!,
      farm.token1.coingecko!,
    ]).concat(["spookyswap"]),
  );

  const priceBoo = prices.get("spookyswap");

  const reserves = await SpookyFarm.getReserves(FANTOM, farm);
  if (!reserves.isOk) {
    throw new Error("failed to get reserves");
  }

  const balance = await Erc20.balanceOf(FANTOM, farm.lp, SPOOKY_MASTER_CHEF);
  if (!balance.isOk) {
    throw new Error("failed to get balance");
  }

  const totalSupply = await SpookyFarm.totalSupply(FANTOM, farm);
  if (!totalSupply.isOk) {
    throw new Error("failed to get total supply");
  }

  const priceToken0 = prices.get(farm.token0.coingecko!)!;
  const priceToken1 = prices.get(farm.token1.coingecko!)!;
  const [reservesToken0, reservesToken1] = reserves.value;
  const usdToken0 = reservesToken0.mul(priceToken0);
  const usdToken1 = reservesToken1.mul(priceToken1);
  const totalUsd = usdToken0.add(usdToken1);
  const tvl = totalUsd.mul(balance.value).div(totalSupply.value);

  const poolInfo = await SpookyMasterChef.poolInfo(
    FANTOM,
    SPOOKY_MASTER_CHEF,
    farm.pid,
  );
  if (!poolInfo.isOk) {
    throw new Error("failed to get pool info");
  }

  const { allocPoint } = poolInfo.value;

  const booPerSecond = await SpookyMasterChef.booPerSecond(
    FANTOM,
    SPOOKY_MASTER_CHEF,
  );
  if (!booPerSecond.isOk) {
    throw new Error("failed to get boo per second");
  }

  const totalAllocPoint = await SpookyMasterChef.totalAllocPoint(
    FANTOM,
    SPOOKY_MASTER_CHEF,
  );
  if (!totalAllocPoint.isOk) {
    throw new Error("failed to get total alloc point");
  }

  const SECONDS_PER_YEAR = new Decimal(365.2425).mul(24).mul(60).mul(60);
  const apr = booPerSecond.value
    .mul(allocPoint.div(totalAllocPoint.value))
    .mul(SECONDS_PER_YEAR)
    .mul(priceBoo!)
    .div(tvl);

  return { tvl, apr };
}

async function coingeckoPrices(
  tokenIds: string[],
): Promise<Map<string, Decimal>> {
  type PriceResponse = Record<string, { usd: number }>;
  const ids = tokenIds.join("%2C");
  const request = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
  const response: PriceResponse = await fetch(request).then((r) => r.json());
  const prices = new Map<string, Decimal>();
  for (const token of tokenIds) {
    const price = response[token]?.usd;
    if (price == undefined) {
      continue;
    }
    prices.set(token, new Decimal(price));
  }
  return prices;
}
