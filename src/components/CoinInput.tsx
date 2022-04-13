import Decimal from "decimal.js";
import { StaticImageData } from "next/image";
import { VFC } from "react";
import { classes, DecimalInput, validateEther } from "src/util";
import { StaticImg } from "./StaticImg";

const CoinInput: VFC<{
  amount: DecimalInput;
  tokenImage: StaticImageData;
  tokenName: string;
  balance: Decimal;
  label: string;
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
  <div className="block space-y-2">
    <div className="flex">
      <div>{label}</div>
      <div className="flex-grow" />
      <button className="-m-2 p-2" onClick={() => onChange(balance.toString())}>
        MAX {balance.toFixed(decimalAmount)}
      </button>
    </div>
    <div className="relative">
      <div className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 gap-2">
        <StaticImg src={tokenImage} alt={tokenName} className="h-6 w-6" />
        <div>{tokenName}</div>
      </div>
      <input
        className={classes(
          "w-full rounded px-3 py-3 pl-11 text-right",
          amount.isValid ? "bg-gray-100" : "bg-red-50 text-red-700",
        )}
        title={`${tokenName} sell amount`}
        pattern="[0-9]*"
        inputMode="decimal"
        value={amount.input}
        onChange={(e) => onChange(validateEther(e.target.value))}
        placeholder="0.00"
      />
    </div>
  </div>
);

export default CoinInput;
