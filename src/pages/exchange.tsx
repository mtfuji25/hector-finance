import Decimal from "decimal.js";
import RubicSDK, * as Rubic from "rubic-sdk";
import { NextPage } from "next";
import Head from "next/head";
import React, { FC, useEffect, useState, VFC } from "react";
import {
  AVALANCHE,
  BINANCE,
  Chain,
  CHAINS,
  ETHEREUM,
  FANTOM,
  MOONRIVER,
  POLYGON,
} from "src/chain";
import { PageHeader, PageSubheader } from "src/components/Header";
import { Modal, ModalCloseButton } from "src/components/Modal";
import { MultiCoinInput, MultiCoinOutput } from "src/components/MultiCoin";
import { StaticImg } from "src/components/StaticImg";
import { Submit } from "src/components/Submit";
import { FANTOM_HEC, FANTOM_TOR, FANTOM_USDC } from "src/constants";
import { Erc20Token } from "src/contracts/erc20";
import { useBalance } from "src/hooks/balance";
import { useDebounce } from "src/hooks/debounce";
import Chevron from "src/icons/chevron.svgr";
import CircleArrowDown from "src/icons/circle-arrow-down.svgr";
import CircleCheck from "src/icons/circle-check-solid.svgr";
import CircleExclamation from "src/icons/circle-exclamation.svgr";
import Circle from "src/icons/circle.svgr";
import SearchIcon from "src/icons/search.svgr";
import BigSpinner from "src/icons/spinner-big.svgr";
import SmallSpinner from "src/icons/spinner-small.svgr";
import { Erc20TokenResult } from "src/pages/api/tokens";
import { assertExists, classes, sleep, useDecimalInput } from "src/util";
import { ConnectedWallet, useWallet, Wallet, WalletState } from "src/wallet";

const ExchangePage: NextPage = () => {
  const [sendToken, setSendToken] = useState(FANTOM_HEC);
  const [receiveToken, setReceiveToken] = useState(FANTOM_USDC);

  const [sendChain, setSendChain] = useState(FANTOM);
  const [receiveChain, setReceiveChain] = useState(FANTOM);

  const [selectingSendToken, setSelectingSendToken] = useState(false);
  const [selectingReceiveToken, setSelectingReceiveToken] = useState(false);

  const [send, sendInput, setSendInput] = useDecimalInput();

  const wallet = useWallet(sendChain);
  const [balance] = useBalance(sendChain, sendToken, wallet);

  const rubic = useRubic(wallet);
  const trade = useRubicTrade(
    rubic,
    sendChain,
    receiveChain,
    sendToken,
    receiveToken,
    send,
  );

  const [confirmation, setConfirmation] = useState<SwapTrade | BridgeTrade>();

  let receive: string | undefined = undefined;
  if (trade && trade.type !== "Error" && trade.type !== "Loading") {
    receive = trade.trade.to.tokenAmount.toString();
  }
  let submit: (() => void) | undefined;
  if (trade && (trade.type === "Bridge" || trade.type === "Swap")) {
    submit = () => setConfirmation(trade);
  }

  return (
    <>
      <main className="w-full space-y-4">
        <Head>
          <title>Calculator — Hector Finance</title>
        </Head>
        <div>
          <PageHeader>Exchange</PageHeader>
          <PageSubheader>
            Trade thousands of coins across many chains
          </PageSubheader>
        </div>
        <div className="space-y-2">
          <MultiCoinInput
            token={sendToken}
            chain={sendChain}
            amount={sendInput}
            onInput={setSendInput}
            onChangeCoin={() => setSelectingSendToken(true)}
            balance={balance}
          />
        </div>
        <button
          className="relative mx-auto block p-2 text-gray-300 hover:text-gray-500"
          title="Swap buy and sell"
          onClick={() => {
            setSendToken(receiveToken);
            setReceiveToken(sendToken);
            setSendChain(receiveChain);
            setReceiveChain(sendChain);
            setSendInput("");
          }}
        >
          <BigSpinner
            className={classes(
              "pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 transition-opacity delay-75 duration-500",
              trade?.type === "Loading" ? "opacity-100" : "opacity-0",
            )}
          />
          <CircleArrowDown className="relative h-10 w-10 object-contain" />
        </button>
        <div className="space-y-2">
          <MultiCoinOutput
            token={receiveToken}
            chain={receiveChain}
            amount={receive}
            onChangeCoin={() => setSelectingReceiveToken(true)}
          />
        </div>

        <Submit
          disabled={!wallet.connected}
          label={sendChain.id === receiveChain.id ? "Swap" : "Bridge"}
          onClick={submit}
        />
        {trade?.type === "Error" && (
          <div className="rounded bg-red-50 px-4 py-3 text-red-700">
            <CircleExclamation className="mb-1 inline h-4 w-4" />{" "}
            <span>{trade.message}</span>
          </div>
        )}
      </main>

      {/* Modals */}
      <TokenModal
        open={selectingSendToken}
        onSelect={(chain, token) => {
          setSendChain(chain);
          setSendToken(token);
          setSelectingSendToken(false);
        }}
      />
      <TokenModal
        open={selectingReceiveToken}
        onSelect={(chain, token) => {
          setReceiveChain(chain);
          setReceiveToken(token);
          setSelectingReceiveToken(false);
        }}
      />
      {wallet.connected && confirmation && (
        <ConfirmationModal
          wallet={wallet}
          sendChain={sendChain}
          receiveChain={receiveChain}
          sendToken={sendToken}
          receiveToken={receiveToken}
          confirmation={confirmation}
          onClose={() => setConfirmation(undefined)}
        />
      )}
    </>
  );
};

const ConfirmationModal: FC<{
  wallet: ConnectedWallet;
  confirmation: SwapTrade | BridgeTrade | undefined;
  sendChain: Chain;
  receiveChain: Chain;
  sendToken: Erc20Token;
  receiveToken: Erc20Token;
  onClose: () => void;
}> = ({
  wallet,
  confirmation,
  sendChain,
  receiveChain,
  sendToken,
  receiveToken,
  onClose,
}) => {
  type Approval = "Approved" | "NeedApproval" | "Processing" | "Requesting";
  const [chain, setChain] = useState(false);
  const [allowance, setAllowance] = useState<Approval>("NeedApproval");
  const [transaction, setTransaction] = useState<boolean>(false);
  useEffect(() => {
    const isChainCorrect = wallet.state === WalletState.CanWrite;
    setChain(isChainCorrect);
    setAllowance("NeedApproval");
    setTransaction(false);
    if (!confirmation) {
      return;
    }
    let abort = false;
    (async () => {
      if (!isChainCorrect) {
        if (!wallet.switchChain) {
          onClose();
          return;
        }
        const isOk = await wallet.switchChain();
        if (abort) {
          return;
        }
        if (!isOk) {
          onClose();
          return;
        }
        setChain(true);
      }

      const needApproval = await confirmation.trade.needApprove();
      if (abort) {
        return;
      }
      if (!needApproval) {
        setAllowance("Approved");
        return;
      }

      try {
        setAllowance("Requesting");
        await confirmation.trade.approve({});
      } catch (e) {
        console.error("approval failed", e);
        onClose();
      }

      if (abort) {
        return;
      }
      setAllowance("Processing");
      while (true) {
        const needApproval = await confirmation.trade.needApprove();
        if (abort) {
          return;
        }
        if (!needApproval) {
          setAllowance("Approved");
          break;
        }
        await sleep(sendChain.millisPerBlock / 2);
      }
    })();
    return () => {
      abort = true;
    };
  }, [wallet, confirmation, sendChain]);

  useEffect(() => {
    setTransaction(false);
    if (!confirmation || allowance !== "Approved") {
      return;
    }

    let abort = false;
    (async () => {
      try {
        await confirmation.trade.swap();
      } catch {}
      if (abort) {
        return;
      }
      setTransaction(true);
      onClose();
    })();
    return () => {
      abort = true;
    };
  }, [confirmation, allowance]);

  let chainTask: TaskState = chain ? "Complete" : "InProgress";
  let allowanceTask: TaskState;
  switch (chainTask) {
    case "Complete":
      allowanceTask = allowance === "Approved" ? "Complete" : "InProgress";
      break;
    case "InProgress":
      allowanceTask = "Incomplete";
      break;
  }
  let transactionTask: TaskState;
  switch (allowanceTask) {
    case "Complete":
      transactionTask = transaction ? "Complete" : "InProgress";
      break;
    case "Incomplete":
      transactionTask = "Incomplete";
      break;
    case "InProgress":
      transactionTask = "Incomplete";
      break;
  }

  if (!confirmation) {
    return <></>;
  }
  return (
    <Modal className="relative max-w-md bg-white p-5">
      <ModalCloseButton onClick={onClose} />
      <div className="space-y-5">
        <div className="text-xl font-medium ">
          {sendChain.id === receiveChain.id && "Swap"}
          {sendChain.id !== receiveChain.id && "Bridge"}
        </div>
        <ConfirmationAmount
          label="Send"
          token={sendToken}
          chain={sendChain}
          amount={confirmation.trade.from.tokenAmount.toString()}
        />
        <ConfirmationAmount
          label="Receive"
          token={receiveToken}
          chain={receiveChain}
          amount={confirmation.trade.to.tokenAmount.toString()}
        />
        <div className="space-y-2.5">
          <Task
            state={chainTask}
            label={`Switch to ${sendChain.shortName} chain`}
          />
          <Task state={allowanceTask} label="Approve spend allowance" />
          <Task state={transactionTask} label="Confirm transaction" />
        </div>
      </div>
    </Modal>
  );
};

const ConfirmationAmount: FC<{
  label: string;
  token: Erc20Token;
  chain: Chain;
  amount: string;
}> = ({ label, token, chain, amount }) => (
  <div className="space-y-1 rounded bg-gray-100 px-4 py-3 dark:bg-gray-600 dark:text-gray-200">
    <div className="text-xs font-bold uppercase text-gray-400 dark:text-gray-200">
      {label}
    </div>
    <div className="-space-y-0.5">
      <div className="items-center gap-1 overflow-hidden text-ellipsis text-3xl font-bold text-gray-600 dark:text-gray-200">
        {amount}
      </div>
      <div className="flex items-center gap-1.5 text-sm">
        <StaticImg
          src={token.logo}
          alt=""
          className="h-3.5 w-3.5 flex-shrink-0 align-text-top"
        />
        <div>
          {chain.shortName} {token.symbol}
        </div>
      </div>
    </div>
  </div>
);

type TaskState = "Complete" | "InProgress" | "Incomplete";

const Task: FC<{ label: string; state: TaskState }> = ({ label, state }) => (
  <div>
    <div className="flex items-center gap-1">
      {state === "Incomplete" && (
        <>
          <Circle className="h-4 w-4 shrink-0 animate-spin text-gray-200" />
          <div className="text-gray-300">{label}</div>
        </>
      )}
      {state === "InProgress" && (
        <>
          <SmallSpinner className="h-4 w-4 shrink-0 animate-spin text-blue-500" />
          <div>{label}</div>
        </>
      )}
      {state === "Complete" && (
        <>
          <CircleCheck className="h-4 w-4 shrink-0 text-blue-500" />
          <div>{label}</div>
        </>
      )}
    </div>
  </div>
);

const TokenModal: FC<{
  open: boolean;
  onSelect: (chain: Chain, token: Erc20Token) => void;
}> = ({ open, onSelect }) => {
  const [search, setSearch] = useState("");
  const [chain, setChain] = useState<Chain>(FANTOM);
  const [results, isSearching] = useTokenSearch(chain.id, search);
  const [selectingChain, setSelectingChain] = useState(false);
  if (!open) {
    return <></>;
  }
  if (selectingChain) {
    return (
      <SelectChain
        onSelect={(chain) => {
          setChain(chain);
          setSelectingChain(false);
        }}
      />
    );
  } else {
    return (
      <SelectToken
        search={search}
        isSearching={isSearching}
        onSearch={setSearch}
        onChangeChain={() => setSelectingChain(true)}
        onSelect={(token) => onSelect(chain, token)}
        chain={chain}
        results={results}
      />
    );
  }
};

const SelectChain: VFC<{
  onSelect: (chain: Chain) => void;
}> = ({ onSelect }) => (
  <Modal className="flex h-full max-h-[500px] max-w-xs flex-col gap-3 overflow-hidden overflow-y-auto bg-white p-3">
    {CHAINS.map((chain) => (
      <ChainButton
        key={chain.id}
        chain={chain}
        onClick={() => onSelect(chain)}
      />
    ))}
  </Modal>
);

const SelectToken: VFC<{
  search: string;
  isSearching: boolean;
  onSearch: (value: string) => void;
  onChangeChain: () => void;
  onSelect: (token: Erc20Token) => void;
  chain: Chain;
  results: Erc20TokenResult[];
}> = ({
  search,
  isSearching,
  onSearch,
  onChangeChain,
  onSelect,
  chain,
  results,
}) => (
  <Modal className="flex h-full max-h-[500px] max-w-xs flex-col gap-3 overflow-hidden bg-white pt-3">
    {/* Chain */}
    <div className="px-3">
      <ChainButton
        chain={chain}
        decoration="dropdown"
        onClick={onChangeChain}
      />
    </div>

    {/* Search */}
    <div className="px-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => onSearch(e.currentTarget.value)}
          className="w-full rounded bg-gray-200 px-3 py-3 pl-11 dark:bg-gray-600 dark:text-gray-200"
          placeholder={`Search tokens on ${chain.shortName}`}
        />
        <div
          className={classes(
            "pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transition-opacity duration-200",
            isSearching ? "opacity-100" : "opacity-0",
          )}
        >
          <SmallSpinner className="h-5 w-5 animate-spin" />
        </div>
      </div>
    </div>

    {/* Tokens */}
    <div className="overflow-y-auto overflow-x-hidden">
      {results.map((token) => (
        <button
          key={token.address}
          className="group flex w-full items-center gap-2 p-3 py-2.5 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
          title={token.address}
          onClick={() => {
            onSelect({
              address: token.address,
              chain: chain.id,
              decimals: token.decimals,
              logo: { src: token.logo, width: 32, height: 32 },
              name: token.name,
              symbol: token.symbol,
              wei: new Decimal(10).pow(token.decimals),
            });
          }}
        >
          <img
            src={token.logo}
            alt=""
            className="h-6 w-6 shrink-0 object-contain"
          />
          <div className="overflow-hidden overflow-ellipsis whitespace-nowrap ">
            {token.name}
          </div>
          <div className="overflow-hidden whitespace-nowrap text-gray-300 group-hover:text-gray-400 dark:text-gray-200 dark:group-hover:text-gray-200 ">
            {token.symbol}
          </div>
        </button>
      ))}
    </div>
  </Modal>
);

const ChainButton: VFC<{
  chain: Chain;
  decoration?: "dropdown";
  onClick: () => void;
}> = ({ chain, decoration, onClick }) => (
  <button
    className="relative flex w-full shrink-0 items-center gap-2 overflow-hidden rounded px-4 py-2 pr-5 text-lg text-white "
    title={chain.longName}
    onClick={onClick}
    style={{
      backgroundColor: chain.color,
      boxShadow: "inset 0px 8px 9px 0px #ffffff1c",
    }}
  >
    <StaticImg
      src={chain.logo}
      alt=""
      className="pointer-events-none absolute left-0 h-20 w-20 -translate-x-1/3 opacity-20"
    />
    <div
      className="relative"
      style={{
        textShadow: `0 0 6px ${chain.color}, 0 0 6px ${chain.color}, 0 0 6px ${chain.color}`,
      }}
    >
      {chain.shortName}
    </div>
    <div className="flex-grow"></div>
    {decoration && <Chevron className="h-3.5 w-3.5" />}
  </button>
);

function useTokenSearch(
  chain: number,
  query: string,
): [Erc20TokenResult[], boolean] {
  const debouncedQuery = useDebounce(250, query);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Erc20TokenResult[]>([]);

  useEffect(() => {
    setSearching(true);
  }, [query]);

  useEffect(() => {
    let abort = false;
    (async () => {
      const response = await fetch(
        `/api/tokens?chain=${chain}&query=${encodeURIComponent(
          debouncedQuery.trim(),
        )}`,
      );
      const results: Erc20TokenResult[] = await response.json();
      if (abort) {
        return;
      }
      setResults(results);
      setSearching(false);
    })();
    return () => {
      abort = true;
    };
  }, [chain, debouncedQuery]);

  return [results, searching];
}

// ----------------------------------------------------------------------------
// -------------------------------  RUBIC  ------------------------------------
// ----------------------------------------------------------------------------

function useRubic(wallet: Wallet): Rubic.SDK | undefined {
  const [rubic, setRubic] = useState<Rubic.SDK>();

  useEffect(() => {
    let abort = false;
    (async () => {
      const rubic = await RubicSDK.createSDK(configWithoutWallet);
      if (abort) {
        return;
      }
      setRubic(rubic);
    })();
    return () => {
      abort = true;
    };
  }, []);

  useEffect(() => {
    if (!rubic) {
      return;
    }
    if (wallet.state !== WalletState.CanWrite) {
      rubic.updateConfiguration(configWithoutWallet);
      return;
    }

    const configWithWallet: Rubic.Configuration = {
      ...configWithoutWallet,
      walletProvider: {
        address: wallet.address,
        chainId: wallet.chain,
        // @ts-ignore this must exist when the wallet is connected
        core: window.ethereum,
      },
    };
    rubic.updateConfiguration(configWithWallet);
  }, [rubic, wallet]);

  return rubic;
}

const configWithoutWallet: Rubic.Configuration = {
  providerAddress: "0x677d6EC74fA352D4Ef9B1886F6155384aCD70D90",
  rpcProviders: {
    [Rubic.BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
      mainRpc: BINANCE.rpc[0],
    },
    [Rubic.BLOCKCHAIN_NAME.MOONRIVER]: {
      mainRpc: MOONRIVER.rpc[0],
    },
    [Rubic.BLOCKCHAIN_NAME.POLYGON]: {
      mainRpc: POLYGON.rpc[0],
    },
    [Rubic.BLOCKCHAIN_NAME.AVALANCHE]: {
      mainRpc: AVALANCHE.rpc[0],
    },
    [Rubic.BLOCKCHAIN_NAME.ETHEREUM]: {
      mainRpc: ETHEREUM.rpc[0],
    },
    [Rubic.BLOCKCHAIN_NAME.FANTOM]: {
      mainRpc: FANTOM.rpc[0],
    },
  },
};

type Trade =
  | SwapTrade
  | BridgeTrade
  | { type: "Error"; message: string }
  | { type: "Loading" };

type SwapTrade = { type: "Swap"; trade: Rubic.InstantTrade };
type BridgeTrade = { type: "Bridge"; trade: Rubic.CrossChainTrade };

function useRubicTrade(
  rubic: Rubic.SDK | undefined,
  sendChain: Chain,
  receiveChain: Chain,
  sendToken: Erc20Token,
  receiveToken: Erc20Token,
  send: Decimal,
): Trade | undefined {
  const [trade, setTrade] = useState<Trade>();
  useEffect(() => {
    if (send.isZero()) {
      setTrade(undefined);
      return;
    }

    if (!rubic) {
      return;
    }

    setTrade({ type: "Loading" });
    let abort = false;
    (async () => {
      await sleep(250); // Debounce
      if (abort) {
        return;
      }

      const RUBIC_CHAIN_BY_ID: Map<number, Rubic.BlockchainName> = new Map([
        [FANTOM.id, Rubic.BLOCKCHAIN_NAME.FANTOM],
        [MOONRIVER.id, Rubic.BLOCKCHAIN_NAME.MOONRIVER],
        [POLYGON.id, Rubic.BLOCKCHAIN_NAME.POLYGON],
        [AVALANCHE.id, Rubic.BLOCKCHAIN_NAME.AVALANCHE],
        [ETHEREUM.id, Rubic.BLOCKCHAIN_NAME.ETHEREUM],
        [BINANCE.id, Rubic.BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN],
      ]);
      try {
        if (sendChain.id === receiveChain.id) {
          const blockchain = RUBIC_CHAIN_BY_ID.get(sendChain.id);
          assertExists(blockchain);
          let instantTrades = await rubic.instantTrades.calculateTrade(
            {
              blockchain,
              address: sendToken.address,
            },
            send.toString(),
            receiveToken.address,
          );
          if (abort) {
            return;
          }

          // Remove providers for certain tokens that are known to have low liquidity.
          if (
            sendToken.address === FANTOM_TOR.address ||
            sendToken.address === FANTOM_HEC.address ||
            receiveToken.address === FANTOM_TOR.address ||
            receiveToken.address == FANTOM_HEC.address
          ) {
            instantTrades = instantTrades.filter(
              (trade) => trade.type !== Rubic.TRADE_TYPE.SPIRIT_SWAP,
            );
          }

          instantTrades.sort((a, b) => {
            if (a.to.tokenAmount.gt(b.to.tokenAmount)) {
              return -1;
            } else if (a.to.tokenAmount.lt(b.to.tokenAmount)) {
              return +1;
            } else {
              return 0;
            }
          });
          const bestInstantTrade = instantTrades[0];
          if (bestInstantTrade) {
            setTrade({ type: "Swap", trade: bestInstantTrade });
          } else {
            setTrade({ type: "Error", message: "No trade available." });
          }
        } else {
          const sendBlockchain = RUBIC_CHAIN_BY_ID.get(sendChain.id);
          const receiveBlockchain = RUBIC_CHAIN_BY_ID.get(receiveChain.id);
          assertExists(sendBlockchain);
          assertExists(receiveBlockchain);
          const crossTrades = await rubic.crossChain.calculateTrade(
            {
              address: sendToken.address,
              blockchain: sendBlockchain,
            },
            send.toString(),
            {
              address: receiveToken.address,
              blockchain: receiveBlockchain,
            },
          );
          if (abort) {
            return;
          }
          crossTrades.sort((a, b) => {
            if (!a.trade) {
              return +1;
            }
            if (!b.trade) {
              return -1;
            }
            if (a.trade.to.tokenAmount.gt(b.trade.to.tokenAmount)) {
              return -1;
            } else if (a.trade.to.tokenAmount.lt(b.trade.to.tokenAmount)) {
              return +1;
            } else {
              return 0;
            }
          });
          const bestCrossTrade = crossTrades[0];
          if (!bestCrossTrade) {
            setTrade({ type: "Error", message: "No trade available." });
            return;
          }
          if (!bestCrossTrade.trade) {
            if (bestCrossTrade.error) {
              setTrade({
                type: "Error",
                message: bestCrossTrade.error.message,
              });
            } else {
              setTrade({ type: "Error", message: "Error finding a trade." });
            }
            return;
          }
          setTrade({ type: "Bridge", trade: bestCrossTrade.trade });
        }
      } catch (e) {
        if (abort) {
          return;
        }
        if (e instanceof Rubic.InsufficientLiquidityError) {
          setTrade({
            type: "Error",
            message:
              "Not enough liquidity. Either try again later, or lower your sell amount.",
          });
        } else {
          setTrade({
            type: "Error",
            message: "Unknown error occured. Report this to the Hector team.",
          });
        }
      }
    })();
    return () => {
      abort = true;
    };
  }, [rubic, sendChain, receiveChain, sendToken, receiveToken, send]);

  return trade;
}

export default ExchangePage;
