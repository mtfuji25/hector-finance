import { Decimal } from "decimal.js";
import { NextPage } from "next";
import Head from "next/head";
import React, { useState, VFC } from "react";
import { PageHeader, PageSubheader } from "src/components/Header";
import {
  classes,
  DecimalInput,
  useDecimalInput,
  validateEther,
} from "src/util";

const CalculatorPage: NextPage = () => {
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
    <main className="w-full space-y-4">
      <Head>
        <title>Calculator — Hector Finance</title>
      </Head>

      <div>
        <PageHeader>Calculator</PageHeader>
        <PageSubheader>Plan for the future</PageSubheader>
      </div>

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

      <label className="block space-y-2 dark:text-gray-200">
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

      <div className="space-y-2 rounded bg-green-50 p-6 text-green-800 dark:bg-gray-700 dark:text-gray-200">
        <div className="text-xs font-bold uppercase tracking-wide text-green-400 dark:text-gray-200">
          Results
        </div>
        <div className="flex justify-between dark:text-gray-200">
          <div>Initial balance:</div>
          <div>${initialUsd.toFixed(2)}</div>
        </div>
        <div className="flex justify-between dark:text-gray-200">
          <div>Final balance after {days} days:</div>
          <div>${finalUsd.toFixed(2)}</div>
        </div>
        <div className="flex justify-between dark:text-gray-200">
          <div>ROI after {days} days:</div>
          <div>{roi.toFixed(0)}%</div>
        </div>
      </div>
    </main>
  );
};

const Input: VFC<{
  label: string;
  value: DecimalInput;
  onChange: (input: string) => void;
}> = ({ label, value, onChange }) => (
  <label className="block space-y-2 ">
    <div className="dark:text-gray-200 ">{label}</div>
    <input
      className={classes(
        "w-full rounded px-3 py-2",
        value.isValid
          ? "bg-gray-100 dark:bg-gray-700 dark:text-gray-200 "
          : "bg-red-50 text-red-700 dark:bg-red-700 dark:text-gray-200",
      )}
      pattern="[0-9]*"
      inputMode="decimal"
      value={value.input}
      onChange={(e) => onChange(validateEther(e.target.value))}
    />
  </label>
);

export default CalculatorPage;
