import Decimal from "decimal.js";
import { VFC } from "react";
import { classes, DecimalInput, validateEther } from "src/util";
import { StaticImg } from "./StaticImg";
import WalletIcon from "src/icons/wallet-regular.svgr";
import { Erc20Token } from "src/contracts/erc20";

export const CoinInput: VFC<{
  amount: DecimalInput;
  token: Erc20Token;
  balance: Decimal;
  label?: string;
  onChange: (input: string) => void;
}> = ({ amount, token, label, balance, onChange }) => (
  <div className="space-y-2">
    {label && <div className="dark:text-gray-200">{label}</div>}
    <div>
      <div className="relative">
        <div className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 gap-2">
          <StaticImg
            src={token.logo}
            alt=""
            className="h-6 w-6 object-contain"
          />
          <div className="dark:text-gray-200">{token.symbol}</div>
        </div>
        <input
          className={classes(
            "w-full rounded-t px-3 py-3 pl-11 text-right  ",
            amount.isValid
              ? "bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
              : "bg-red-50 text-red-700 dark:bg-red-700 dark:text-gray-200",
          )}
          title={token.symbol}
          pattern="[0-9]*"
          inputMode="decimal"
          value={amount.input}
          onFocus={(e) => e.target.select()}
          onChange={(e) => onChange(validateEther(e.target.value))}
          placeholder="0.00"
        />
      </div>
      <div className="h-px bg-gray-200 dark:bg-gray-400" />
      <div className="h-px bg-transparent" />
      <div className="flex rounded-b bg-gray-100 text-xs text-gray-400 dark:bg-gray-700 dark:text-gray-200">
        <button
          className="flex items-center gap-1.5 overflow-hidden px-3 py-2 hover:text-gray-600 dark:hover:bg-gray-500 dark:hover:text-gray-100"
          tabIndex={-1}
          onClick={() => onChange(balance.toString())}
        >
          <WalletIcon className="h-3 w-3 flex-shrink-0 object-contain" />
          <div className="overflow-hidden overflow-ellipsis">
            {balance.toFixed()}
          </div>
        </button>
        <div className="flex-grow" />
        <button
          className="p-2 px-3 hover:text-gray-600 dark:hover:bg-gray-500 dark:hover:text-gray-100 "
          tabIndex={-1}
          onClick={() => onChange(balance.div(4).toString())}
        >
          1/4
        </button>
        <button
          className="p-2 px-3 hover:text-gray-600 dark:hover:bg-gray-500 dark:hover:text-gray-100"
          tabIndex={-1}
          onClick={() => onChange(balance.div(2).toString())}
        >
          1/2
        </button>
        <button
          className="px-3 py-2 hover:text-gray-600 dark:hover:bg-gray-500 dark:hover:text-gray-100"
          tabIndex={-1}
          onClick={() => onChange(balance.toString())}
        >
          MAX
        </button>
      </div>
    </div>
  </div>
);
