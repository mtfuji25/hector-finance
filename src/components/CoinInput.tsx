import Decimal from "decimal.js";
import { StaticImageData } from "next/image";
import { VFC } from "react";
import { classes, DecimalInput, validateEther } from "src/util";
import { StaticImg } from "./StaticImg";
import WalletIcon from "src/icons/wallet-regular.svgr";

export const CoinInput: VFC<{
  amount: DecimalInput;
  tokenImage: StaticImageData;
  tokenName: string;
  balance: Decimal;
  label?: string;
  decimalAmount: number;
  onChange: (input: string) => void;
}> = ({
  amount,
  tokenImage,
  tokenName,
  label,
  balance,
  decimalAmount,
  onChange,
}) => (
  <div className="space-y-2">
    {label && <div>{label}</div>}
    <div>
      <div className="relative">
        <div className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 gap-2">
          <StaticImg
            src={tokenImage}
            alt={tokenName}
            className="h-6 w-6 object-contain"
          />
          <div>{tokenName}</div>
        </div>
        <input
          className={classes(
            "w-full rounded-t px-3 py-3 pl-11 text-right",
            amount.isValid ? "bg-gray-100" : "bg-red-50 text-red-700",
          )}
          title={tokenName}
          pattern="[0-9]*"
          inputMode="decimal"
          value={amount.input}
          onFocus={(e) => e.target.select()}
          onChange={(e) => onChange(validateEther(e.target.value))}
          placeholder="0.00"
        />
      </div>
      <div className="h-px bg-gray-200" />
      <div className="h-px bg-transparent" />
      <div className="flex rounded-b bg-gray-100 text-xs text-gray-400">
        <button
          className="flex items-center gap-1.5 px-3 py-2"
          tabIndex={-1}
          onClick={() => onChange(balance.toString())}
        >
          <WalletIcon className="h-3 w-3 flex-shrink-0 object-contain" />
          {balance.toFixed()}
        </button>
        <div className="flex-grow" />
        <button
          className="p-2 px-3"
          tabIndex={-1}
          onClick={() => onChange(balance.div(4).toString())}
        >
          1/4
        </button>
        <button
          className="p-2 px-3"
          tabIndex={-1}
          onClick={() => onChange(balance.div(2).toString())}
        >
          1/2
        </button>
        <button
          className="px-3 py-2"
          tabIndex={-1}
          onClick={() => onChange(balance.toString())}
        >
          MAX
        </button>
      </div>
    </div>
  </div>
);
