import Head from "next/head";
import React, { useState, VFC } from "react";
import { SideNav, TopNav } from "src/components/Nav";
import {
  classes,
  DecimalInput,
  useDecimalInput,
  validateEther,
} from "src/util";
import { Decimal } from "decimal.js-light";

export default function Home() {
  return (
    <>
      <Head>
        <title>Calculator — Hector Finance</title>
      </Head>
      <TopNav />
      <div className="mx-auto max-w-3xl">
        <div className="flex gap-8 p-8">
          <SideNav />
          <main className="flex-grow space-y-6">
            <div>
              <h1 className="text-2xl font-medium">Calculator</h1>
              <h2>Plan for the future</h2>
            </div>
            <Calculator />
          </main>
        </div>
      </div>
    </>
  );
}

const Calculator: VFC = () => {
  const [initialHec, initialHecInput, setInitialHecInput] =
    useDecimalInput("0.01234295");
  const [apy, apyInput, setApyInput] = useDecimalInput("213.5");
  const [initialPrice, initialPriceInput, setInitialPriceInput] =
    useDecimalInput("14.48");
  const [finalPrice, finalPriceInput, setFinalPriceInput] =
    useDecimalInput("20.12");
  const [days, setDays] = useState(30);

  const DAYS_PER_YEAR = 365;
  const initialUsd = initialHec.times(initialPrice);
  const apr = apy
    .div(100)
    .plus(1)
    .pow(new Decimal(1).div(DAYS_PER_YEAR))
    .mul(DAYS_PER_YEAR)
    .minus(DAYS_PER_YEAR);
  const finalHec = apr.div(DAYS_PER_YEAR).plus(1).pow(days).times(initialHec);
  const finalUsd = finalHec.times(finalPrice);
  const roi = finalHec.minus(initialHec).div(initialHec).times(100);

  return (
    <>
      <Input
        label="sHEC amount"
        value={initialHecInput}
        onChange={setInitialHecInput}
      />
      <Input label="APY (%)" value={apyInput} onChange={setApyInput} />
      <Input
        label="HEC price ($) at purchase"
        value={initialPriceInput}
        onChange={setInitialPriceInput}
      />
      <Input
        label={`HEC price ($) after ${days} days`}
        value={finalPriceInput}
        onChange={setFinalPriceInput}
      />

      <label className="block space-y-2">
        <div>Stake for {days} days</div>
        <input
          min={1}
          max={365}
          type="range"
          value={days}
          onChange={(e) => setDays(e.target.valueAsNumber)}
          className="block w-full"
        />
      </label>

      <div className="space-y-2 rounded bg-emerald-50 p-6 text-emerald-900">
        <div className="text-xs font-bold uppercase opacity-30">Results</div>
        <div className="flex justify-between">
          <div>Initial balance:</div>
          <div>${initialUsd.toFixed(2)}</div>
        </div>
        <div className="flex justify-between">
          <div>Final balance after {days} days:</div>
          <div>${finalUsd.toFixed(2)}</div>
        </div>
        <div className="flex justify-between">
          <div>ROI after {days} days:</div>
          <div>{roi.toFixed(0)}%</div>
        </div>
      </div>
    </>
  );
};

const Input: VFC<{
  label: string;
  value: DecimalInput;
  onChange: (input: string) => void;
}> = ({ label, value, onChange }) => (
  <label className="block space-y-2">
    <div>{label}</div>
    <input
      className={classes(
        "w-full rounded px-3 py-2",
        value.isValid ? "bg-slate-100" : "bg-red-100 text-red-800",
      )}
      pattern="[0-9]*"
      inputMode="decimal"
      value={value.input}
      onChange={(e) => onChange(validateEther(e.target.value))}
    />
  </label>
);
