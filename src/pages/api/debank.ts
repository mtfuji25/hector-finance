import { NextApiRequest, NextApiResponse } from "next";
import { ChainData } from "..";
const ACCESS_KEY = "6c1524d03b494820a54a07bbe6c32e85fe181fe2";

const WALLET_1 = "0x4bfb33d65f4167ebe190145939479227e7bf2cb0";
const TREASURY_WALLET = "0xcb54ea94191b280c296e6ff0e37c7e76ad42dc6a";
const WALLET_2 = "0x677d6ec74fa352d4ef9b1886f6155384acd70d90";
const WALLET_3 = "0x3cdf52cc28d21c5b7b91d7065fd6dfe6d426fcc5";
const WALLET_4 = "0x8a43e670619973944cb573bb23688c24cc0b5131";
const FTM_VALIDATOR_1 = "0xBE4b73f5Caff476Ed0Cdb4C043236fce81f4dC6C";
const FTM_VALIDATOR_2 = "0x35796Ce4Ed757075D346c1bc374D67628fadcbB1";

async function getChainTotals(): Promise<ChainData[]> {
  const wallet1TokenAmounts = await fetch(
    `https://pro-openapi.debank.com/v1/user/token_list?id=${WALLET_1}&chain_id=eth&is_all=false&has_balance=true`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet1ProtocolList = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${WALLET_1}&chain_id=eth&`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const TreasuryTokenAmounts = await fetch(
    `https://pro-openapi.debank.com/v1/user/token_list?id=${TREASURY_WALLET}&chain_id=ftm&is_all=false&has_balance=true`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const TreasuryProtocolList = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${TREASURY_WALLET}&chain_id=ftm`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet2TokenAmounts = await fetch(
    `https://pro-openapi.debank.com/v1/user/token_list?id=${WALLET_2}&chain_id=ftm&is_all=false&has_balance=true`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet2ProtocolList = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${WALLET_2}&chain_id=ftm`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet3TokenAmounts = await fetch(
    `https://pro-openapi.debank.com/v1/user/token_list?id=${WALLET_3}&chain_id=bsc&is_all=false&has_balance=true`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet3ProtocolList = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${WALLET_3}&chain_id=bsc`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet4TokenAmounts = await fetch(
    `https://pro-openapi.debank.com/v1/user/token_list?id=${WALLET_4}&chain_id=ftm&is_all=false&has_balance=true`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const wallet4ProtocolList = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${WALLET_4}&chain_id=ftm`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const ftmValidator1 = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${FTM_VALIDATOR_1}&chain_id=ftm`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  const ftmValidator2 = await fetch(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${FTM_VALIDATOR_2}&chain_id=ftm`,
    {
      headers: {
        "Content-Type": "application/json",
        "AccessKey": ACCESS_KEY,
      },
    },
  ).then((res) => res.json());
  return await Promise.all([
    {
      wallet: TreasuryTokenAmounts,
      protocols: TreasuryProtocolList,
      source: TREASURY_WALLET,
      chain: "ftm",
    },
    {
      wallet: wallet1TokenAmounts,
      protocols: wallet1ProtocolList,
      source: WALLET_1,
      chain: "eth",
    },
    {
      wallet: wallet2TokenAmounts,
      protocols: wallet2ProtocolList,
      source: WALLET_2,
      chain: "ftm",
    },
    {
      wallet: wallet3TokenAmounts,
      protocols: wallet3ProtocolList,
      source: WALLET_3,
      chain: "bsc",
    },
    {
      wallet: wallet4TokenAmounts,
      protocols: wallet4ProtocolList,
      source: WALLET_4,
      chain: "ftm",
    },
    { protocols: ftmValidator1, source: FTM_VALIDATOR_1, chain: "ftm" },
    { protocols: ftmValidator2, source: FTM_VALIDATOR_2, chain: "ftm" },
  ]);
}

let data: ChainData[];
setInterval(async () => {
  data = await getChainTotals();
}, 43200);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!data) {
    await getChainTotals()
      .then((repsonse) => (data = repsonse))
      .catch(() => res.status(404).end());
  }

  res.send(data);
}
