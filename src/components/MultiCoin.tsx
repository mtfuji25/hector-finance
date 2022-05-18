import Decimal from "decimal.js";
import { VFC } from "react";
import { classes, DecimalInput, validateEther } from "src/util";
import WalletIcon from "src/icons/wallet-regular.svgr";
import Chevron from "src/icons/chevron.svgr";
import { Erc20Token } from "src/contracts/erc20";
import { StaticImg } from "./StaticImg";
import { Chain } from "src/chain";

export const MultiCoinInput: VFC<{
  amount: DecimalInput;
  chain: Chain;
  token: Erc20Token;
  balance: Decimal;
  onInput: (input: string) => void;
  onChangeCoin: () => void;
}> = ({ amount, token, chain, balance, onInput, onChangeCoin }) => (
  <div>
    <div
      className={classes(
        "flex rounded-t ",
        amount.isValid
          ? "bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
          : "bg-red-50 text-red-700 dark:bg-red-700 dark:text-gray-200",
      )}
    >
      <button
        className="flex shrink-0 items-center gap-2 p-3"
        title={`${token.name} on ${chain.longName}`}
        onClick={onChangeCoin}
      >
        <div className="flex items-center">
          <StaticImg
            src={chain.logo}
            alt=""
            className="-mr-2 h-6 w-6 rounded-full p-1"
            style={{ backgroundColor: chain.color }}
          />
          <StaticImg
            src={token.logo}
            alt=""
            className="h-6 w-6 object-contain"
          />
        </div>
        <div>{token.symbol}</div>
        <Chevron className="h-2.5 w-2.5 shrink-0 object-contain" />
      </button>
      <input
        className="min-w-0 flex-grow overflow-ellipsis bg-transparent p-3 text-right "
        title={token.symbol}
        pattern="[0-9]*"
        inputMode="decimal"
        value={amount.input}
        onFocus={(e) => e.target.select()}
        onChange={(e) => onInput(validateEther(e.target.value))}
        placeholder="0.00"
      />
    </div>
    <div className="h-px bg-gray-200 dark:bg-gray-400" />
    <div className="h-px bg-transparent" />
    <div className="flex rounded-b bg-gray-100 text-xs text-gray-400 dark:bg-gray-700 dark:text-gray-200">
      <button
        className="flex items-center gap-1.5 overflow-hidden px-3 py-2 hover:text-gray-600 dark:hover:text-gray-400"
        tabIndex={-1}
        onClick={() => onInput(balance.toString())}
      >
        <WalletIcon className="h-3 w-3 flex-shrink-0 object-contain" />
        <div className="overflow-hidden overflow-ellipsis">
          {balance.toFixed()}
        </div>
      </button>
      <div className="flex-grow" />
      <button
        className="p-2 px-3 hover:text-gray-600 dark:hover:text-gray-100"
        tabIndex={-1}
        onClick={() => onInput(balance.div(4).toString())}
      >
        1/4
      </button>
      <button
        className="p-2 px-3 hover:text-gray-600 dark:hover:text-gray-100"
        tabIndex={-1}
        onClick={() => onInput(balance.div(2).toString())}
      >
        1/2
      </button>
      <button
        className="px-3 py-2 hover:text-gray-600 dark:hover:text-gray-100"
        tabIndex={-1}
        onClick={() => onInput(balance.toString())}
      >
        MAX
      </button>
    </div>
  </div>
);

export const MultiCoinOutput: VFC<{
  amount?: string;
  chain: Chain;
  token: Erc20Token;
  onChangeCoin: () => void;
}> = ({ amount, token, chain, onChangeCoin }) => (
  <div className="flex rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
    <button
      className="flex shrink-0 items-center gap-2 p-3"
      title={`${token.name} on ${chain.longName}`}
      onClick={onChangeCoin}
    >
      <div className="flex items-center">
        <StaticImg
          src={chain.logo}
          alt=""
          className="-mr-2 h-6 w-6 rounded-full p-1"
          style={{ backgroundColor: chain.color }}
        />
        <StaticImg src={token.logo} alt="" className="h-6 w-6 object-contain" />
      </div>
      <div>{token.symbol}</div>
      <Chevron className="h-2.5 w-2.5 shrink-0 object-contain" />
    </button>
    <div className="min-w-0 flex-grow overflow-hidden overflow-ellipsis bg-transparent p-3 text-right">
      {amount || <span className="text-gray-400">0.00</span>}
    </div>
  </div>
);
