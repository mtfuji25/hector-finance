import type { NextApiRequest, NextApiResponse } from "next";
import Avalanche from "src/tokens/avalanche.json";
import Binance from "src/tokens/binance.json";
import Ethereum from "src/tokens/ethereum.json";
import Fantom from "src/tokens/fantom.json";
import Moonriver from "src/tokens/moonriver.json";
import Polygon from "src/tokens/polygon.json";

import * as Chain from "src/chain";

export type Erc20TokenResult = {
  name: string;
  logo: string;
  symbol: string;
  address: string;
  isNative?: boolean;
  decimals: number;
};

const lookupByChain: Map<string, LookupTable> = new Map([
  [Chain.AVALANCHE.id.toString(), generateLookupTable(Avalanche)],
  [Chain.BINANCE.id.toString(), generateLookupTable(Binance)],
  [Chain.ETHEREUM.id.toString(), generateLookupTable(Ethereum)],
  [Chain.FANTOM.id.toString(), generateLookupTable(Fantom)],
  [Chain.MOONRIVER.id.toString(), generateLookupTable(Moonriver)],
  [Chain.POLYGON.id.toString(), generateLookupTable(Polygon)],
]);

type LookupTable = {
  names: string[];
  symbols: string[];
  addresses: string[];
  tokens: Erc20TokenResult[];
};

function generateLookupTable(tokens: Erc20TokenResult[]): LookupTable {
  return {
    names: tokens.map(({ name }) => name.toLowerCase()),
    symbols: tokens.map(({ symbol }) => symbol.toLowerCase()),
    addresses: tokens.map((token) => token.address),
    tokens,
  };
}

function queryLookup(
  table: LookupTable,
  query: string,
  max: number,
): Erc20TokenResult[] {
  let results: Erc20TokenResult[] = [];
  query = query.toLowerCase();
  for (let i = 0; i < table.tokens.length; i += 1) {
    if (table.symbols[i]!.includes(query) || table.names[i]!.includes(query)) {
      results.push(table.tokens[i]!);
    }
    if (results.length >= max) {
      break;
    }
  }
  return results;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Erc20TokenResult[]>,
) {
  let { chain, query } = req.query;
  if (typeof query !== "string" || query.length > 80) {
    return res.status(200).json([]);
  }
  if (typeof chain !== "string") {
    return res.status(404).end();
  }

  const lookup = lookupByChain.get(chain);
  if (!lookup) {
    return res.status(404).end();
  }

  if (query.length === 0) {
    return res.status(200).json(lookup.tokens.slice(0, 35));
  } else {
    const results = queryLookup(lookup, query, 25);
    return res.status(200).json(results);
  }
}
