import { Erc20Token } from "./contracts/erc20";
import { Farm } from "./contracts/staking";
import DaiLogo from "public/icons/dai.svg";
import HecLogo from "public/icons/hector.svg";
import TorLogo from "public/icons/tor.svg";
import CurveLogo from "public/icons/curve.webp";
import UsdcLogo from "public/icons/usdc.svg";
import WftmLogo from "public/icons/wftm.svg";
import Decimal from "decimal.js";

/**
 * This is a rough estimate of the Fantom block time.
 * You should use this when polling the blockchain for changes!
 */
// TODO: Block times can vary based on chain and congestion.
// Polling could be made more efficient if the `BLOCK_TIME` was
// dynamically updated. There's no reason to poll more often than
// the blocks are actually produced.
export const FANTOM_BLOCK_TIME: number = 2_000;

export const THE_GRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/hectordao-hec/hector-dao";
export const THE_ALT_GRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/hectordao-hec/hector-dao-alt";
export const ETH_GRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/hectordao-hec/hector-eth";
export const EPOCH_INTERVAL = 28800;

export const GRAPH_DATA = `
query {
  protocolMetrics(first: 1000, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    hecCirculatingSupply
    sHecCirculatingSupply
    totalSupply
    hecPrice
    marketCap
    totalValueLocked
    treasuryRiskFreeValue
    treasuryMarketValue
    nextEpochRebase
    nextDistributedHec
    treasuryDaiMarketValue
    treasuryDaiLPMarketValue
    treasuryDaiRiskFreeValue
    treasuryUsdcMarketValue
    treasuryUsdcLPMarketValue
    treasuryUsdcRiskFreeValue
    treasuryMIMMarketValue
    treasuryMIMRiskFreeValue
    treasuryWFTMMarketValue
    treasuryWFTMRiskFreeValue
    treasuryFRAXRiskFreeValue
    treasuryFRAXMarketValue
    treasuryInvestments
    treasuryBOOMarketValue
    treasuryBOORiskFreeValue
    treasuryCRVRiskFreeValue
    treasuryCRVMarketValue
    treasuryWETHRiskFreeValue
    treasuryWETHMarketValue
    currentAPY
    runwayCurrent
    treasuryHecDaiPOL
    bankBorrowed
    bankSupplied
    treasuryFantomValidatorValue
    treasuryFantomDelegatorValue
    treasuryTORLPValue
  }
  tors(first: 1000, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    torTVL
    supply
  }
}
`;

export interface SubgraphData {
  protocolMetrics: ProtocolMetrics[];
  tors: Tors[];
}

interface Tors {
  id: string;
  timestamp: string;
  torTVL: string;
  supply: string;
}

export interface ProtocolMetrics {
  id: string;
  timestamp: string;
  hecCirculatingSupply: string;
  sHecCirculatingSupply: string;
  totalSupply: string;
  hecPrice: string;
  marketCap: string;
  totalValueLocked: string;
  treasuryRiskFreeValue: string;
  treasuryMarketValue: string;
  nextEpochRebase: string;
  nextDistributedHec: string;
  treasuryDaiMarketValue: string;
  treasuryDaiLPMarketValue: string;
  treasuryDaiRiskFreeValue: string;
  treasuryUsdcMarketValue: string;
  treasuryUsdcLPMarketValue: string;
  treasuryUsdcRiskFreeValue: string;
  treasuryMIMMarketValue: string;
  treasuryMIMRiskFreeValue: string;
  treasuryWFTMMarketValue: string;
  treasuryWFTMRiskFreeValue: string;
  treasuryFRAXRiskFreeValue: string;
  treasuryFRAXMarketValue: string;
  treasuryInvestments: string;
  treasuryBOOMarketValue: string;
  treasuryBOORiskFreeValue: string;
  treasuryCRVRiskFreeValue: string;
  treasuryCRVMarketValue: string;
  treasuryWETHRiskFreeValue: string;
  treasuryWETHMarketValue: string;
  currentAPY: string;
  runwayCurrent: string;
  treasuryHecDaiPOL: string;
  bankBorrowed: string;
  bankSupplied: string;
  bankTotal: string;
  treasuryFantomValidatorValue: string;
  treasuryFantomDelegatorValue: string;
  treasuryTORLPValue: string;
  treasuryBaseRewardPool?: string;
  treasuryIlluviumBalance?: string;
  treasuryEthMarketValue?: string;
  treasuryMaticBalance?: string;
  treasuryRFMaticBalance?: string;
  treasuryRFIlluviumBalance?: string;
  torTVL: string;
  staked: string;
}
// export const MWEI_PER_ETHER = BigNumber.from("1000000000000");

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 1;

export const TOKEN_DECIMALS = 9;

export const FANTOM_NETWORK_ID: number = 0xfa;

export const DEFAULT_NETWORK = FANTOM_NETWORK_ID;

export const FANTOM = {
  FANTOM_VALIDATOR_ADDRESS: "0x35796Ce4Ed757075D346c1bc374D67628fadcbB1",
  SECOND_FANTOM_VALIDATOR_ADDRESS: "0x9c2036151781661D08184163Cbb89dFD3b921075",
  THIRD_FANTOM_VALIDATOR_ADDRESS: "0xBE4b73f5Caff476Ed0Cdb4C043236fce81f4dC6C",
  DAI_ADDRESS: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
  USDC_ADDRESS: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
  MIM_ADDRESS: "0x82f0B8B456c1A451378467398982d4834b6829c1",
  FRAX_ADDRESS: "0xdc301622e621166bd8e82f2ca0a26c13ad0be355",
  WFTM_ADDRESS: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
  TOR_ADDRESS: "0x74E23dF9110Aa9eA0b6ff2fAEE01e740CA1c642e",
  DAILP_ADDRESS: "0xbc0eecdA2d8141e3a26D2535C57cadcb1095bca9",
  USDCLP_ADDRESS: "0xd661952749f05acc40503404938a91af9ac1473b",
  FRAXLP_ADDRESS: "0x0f8D6953F58C0dd38077495ACA64cbd1c76b7501",

  HEC_ADDRESS: "0x5C4FDfc5233f935f20D2aDbA572F770c2E377Ab0",
  SHEC_ADDRESS: "0x75bdef24285013387a47775828bec90b91ca9a5f",
  WSHEC_ADDRESS: "0x94CcF60f700146BeA8eF7832820800E2dFa92EdA",

  STAKING_ADDRESS: "0xD12930C8deeDafD788F437879cbA1Ad1E3908Cc5", // The new staking contract
  STAKING_HELPER_ADDRESS: "0x2694c2AAab19950B37FE47478276B5D4a2A73C45", // Helper contract used for Staking only
  DISTRIBUTOR_ADDRESS: "0x41400d445359f5aD51650C76746C98D79174b2e3",
  OLD_STAKING_ADDRESS: "0x9ae7972BA46933B3B20aaE7Acbf6C311847aCA40",
  OLD_STAKING_HELPER_ADDRESS: "0x2ca8913173D36021dC56922b5db8C428C3fdb146",
  OLD_SHEC_ADDRESS: "0x36F26880C6406b967bDb9901CDe43ABC9D53f106",

  BONDINGCALC_ADDRESS: "0xA36De21abd90b27e5EfF108D761Ab4fe06fD4Ab4",
  gOHMBONDINGCALC_ADDRESS: "0xC13E8C5465998BDD1D91952243774d55B12dBEd0",
  BONDINGCALC_ADDRESS1: "0x783A734D5C65e44D3CC0C74e331C4d4F23407E64",
  TREASURY_ADDRESS: "0xCB54EA94191B280C296E6ff0E37c7e76Ad42dC6A",
  DAO_WALLET_ADDRESS: "0x677d6EC74fA352D4Ef9B1886F6155384aCD70D90",
  REDEEM_HELPER_ADDRESS: "0xe78D7ECe7969d26Ae39b2d86BbC04Ae32784daF2",
  AGGREGATOR_ADDRESS: "0x7dc6bad2798ba1AcD8cf34F9a3eF3a168252e1A6",

  FARMING_AGGREGATOR_ADDRESS: "0x86fb74B3b1949985AC2081B9c679d84BB44A2bf2",

  DAI_TOR_USDC_POOL: "0x24699312CB27C26Cfc669459D670559E5E44EE60",
  DAI_TOR_USDC_FARM: "0x61B71689684800f73eBb67378fc2e1527fbDC3b3",

  TOR_WFTM_POOL: "0x41d88635029c4402BF9914782aE55c412f8F2142",
  TOR_WFTM_FARM: "0xD54d478975990927c0Bb9803708A3eD5Dc1cFa20",

  TOR_MINTER_ADDRESS: "0x9b0c6FfA7d0Ec29EAb516d3F2dC809eE43DD60ca",
  TOR_REDEEM_ADDRESS: "0x4E998502b51F4742A7E7285679E55a0580207C64",
  TOR_LP_AMOUNTS_ADDRESS: "0xE4D581869BFc6238d544b0e4c9D678Ad51192654",
  CURVE_FI_ADDRESS: "0x78D51EB71a62c081550EfcC0a9F9Ea94B2Ef081c",

  OLD_HEC_BURN_ALLOCATOR: "0x3fF53A304d3672693e90bb880653925db6e63C51",
  HEC_BURN_ALLOCATOR: "0xD3Ea3b2313d24e0f2302b21f04D0F784CDb6389B",

  STAKING_GATEWAY: "0xfF03889aBC1a36BDF176f6dd6742CB58705c8517",
  TOR_WFTM_FARM_REWARDS: "0xD54d478975990927c0Bb9803708A3eD5Dc1cFa20",
  TOR_WFTM_POOL_PRICER: "0x4e0bE969429976Cfd2fB7DE4bac7C5a46d1887D6",
  TOR_WFTM_FARM_REWARD_PRICER: "0xB6328dcc014B3D4B6639f055d2d6B6935236D114",

  HEC_DAI_LP_44_BOND_ADDRESS: "0x124C23a4119122f05a4C9D2287Ed19fC00f8059a",
  DAI_44_BOND_ADDRESS: "0xE1Cc7FE3E78aEfe6f93D1614A09156fF296Bc81E",
};

export const messages = {
  please_connect:
    "Please connect your wallet to the Fantom network to use Wonderland.",
  please_connect_wallet: "Please connect your wallet.",
  try_mint_more: (value: string) =>
    `You're trying to mint more than the maximum payout available! The maximum mint payout is ${value} HEC.`,
  before_minting: "Before minting, enter a value.",
  existing_mint:
    "You have an existing mint. Minting will reset your vesting period and forfeit any pending claimable rewards. We recommend claiming rewards first or using a fresh wallet. Do you still wish to proceed?",
  before_stake: "Before staking, enter a value.",
  before_unstake: "Before un staking, enter a value.",
  tx_successfully_send: "Your transaction was successful",
  your_balance_updated: "Your balance was successfully updated",
  nothing_to_claim: "You have nothing to claim",
  something_wrong: "Something went wrong",
  switch_to_fantom: "Switch to the Fantom network?",
  slippage_too_small: "Slippage too small",
  slippage_too_big: "Slippage too big",
  your_balance_update_soon: "Your balance will update soon",
  account_update: "Your account will update soon",
};

export const ETHEREUM_RPC = "https://cloudflare-eth.com";
export const FANTOM_RPC = "https://rpc.ftm.tools/";
export const AVALANCHE_RPC = "https://avalanche.public-rpc.com";
export const BSC_RPC = "https://bscrpc.com";
export const POLYGON_RPC = "https://polygon-rpc.com";

export const FANTOM_DAI: Erc20Token = {
  symbol: "DAI",
  logo: DaiLogo,
  address: FANTOM.DAI_ADDRESS,
  chain: 0xfa,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_USDC: Erc20Token = {
  symbol: "USDC",
  logo: UsdcLogo,
  address: FANTOM.USDC_ADDRESS,
  chain: 0xfa,
  decimals: 6,
  wei: new Decimal(10 ** 6),
};

export const FANTOM_TOR: Erc20Token = {
  symbol: "TOR",
  logo: TorLogo,
  address: FANTOM.TOR_ADDRESS,
  chain: 0xfa,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_WFTM: Erc20Token = {
  symbol: "wFTM",
  logo: WftmLogo,
  address: FANTOM.WFTM_ADDRESS,
  chain: 0xfa,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_CURVE: Erc20Token = {
  symbol: "crvLP",
  logo: CurveLogo,
  address: FANTOM.DAI_TOR_USDC_POOL,
  chain: 0xfa,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_HECTOR: Erc20Token = {
  symbol: "HEC",
  logo: HecLogo,
  address: FANTOM.HEC_ADDRESS,
  chain: 0xfa,
  decimals: 9,
  wei: new Decimal(10 ** 9),
};

export const FANTOM_sHEC: Erc20Token = {
  symbol: "sHEC",
  logo: HecLogo,
  address: FANTOM.SHEC_ADDRESS,
  chain: 0xfa,
  decimals: 9,
  wei: new Decimal(10 ** 9),
};

export const FANTOM_wsHEC: Erc20Token = {
  symbol: "wsHEC",
  logo: HecLogo,
  address: FANTOM.WSHEC_ADDRESS,
  chain: 0xfa,
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const TOR_LP: Farm = {
  address: "0xD54d478975990927c0Bb9803708A3eD5Dc1cFa20",
  stake: FANTOM_CURVE,
  reward: FANTOM_WFTM,
};
