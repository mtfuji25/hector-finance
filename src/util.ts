import { Decimal } from "decimal.js";
import { useEffect, useMemo, useState } from "react";
import { TokenAddress } from "./provider";

/**
 * Build a class string from a list of valid classes.
 * Using this method, you can toggle classes on/off from state.
 *
 * ```tsx
 * const isBlinking = true;
 * const isStop = false;
 * <div class={classes(
 *     "traffic-light",
 *     isBlinking && "blink",
 *     isStop && "red"
 * )}/>
 * ```
 *
 * Would render:
 * ```html
 * <div class="traffic-light blink"/>
 * ```
 */
export function classes(
  ..._classes: (string | false | undefined | null)[]
): string {
  return _classes.filter((c) => c && c.length > 0).join(" ");
}

export type Result<Value, Error> =
  | { isOk: true; value: Value }
  | { isOk: false; error: Error };

export function ok<T, E>(value: T): Result<T, E> {
  return { isOk: true, value };
}

export function err<E, T>(error: E): Result<T, E> {
  return { isOk: false, error };
}

export function validateEther(value: string): string {
  return trimDecimalsPast(18, value);
}

export function validateMwei(value: string): string {
  return trimDecimalsPast(6, value);
}

function trimDecimalsPast(max: number, value: string): string {
  const decimal = value.indexOf(".");
  if (decimal === -1) {
    return value;
  }
  return value.slice(0, decimal + 1 + max);
}

export interface DecimalInput {
  isValid: boolean;
  input: string;
}

export function useDecimalInput(
  initial: string,
): [Decimal, DecimalInput, (value: string) => void] {
  const [input, setInput] = useState(initial);
  return useMemo(() => {
    const { isValid, decimal } = decimalFromInput(input);
    return [decimal, { isValid, input }, setInput];
  }, [input, setInput]);
}

/**
 * Transform raw user input into a decimal.
 *
 * There are many inputs that are valid to humans but can't
 * be processed by `Decimal`. This method is useful for adding
 * some human-friendly leniency to the input parsing.
 *
 * You'd definitely expect commas to work in inputs, for example.
 */
function decimalFromInput(input: string): {
  isValid: boolean;
  decimal: Decimal;
} {
  const INVALID_DECIMAL = { isValid: false, decimal: new Decimal("0") };

  input = input.trim();

  if (input === "." || input.length === 0) {
    // A single decimal point is perfectly valid in my book!
    // We can interpret it as zero.
    return { isValid: true, decimal: new Decimal("0") };
  }

  if (input[0] === ",") {
    // Decimals can't contain leading commas.
    return INVALID_DECIMAL;
  }

  if (input.match(/[^0-9,\.]/)) {
    // First ensure only valid characters exist in the input.
    return INVALID_DECIMAL;
  }

  let digitsBetweenCommas = 0;
  let hasDecimal = false;
  let hasCommas = false;
  for (const c of input) {
    if (hasDecimal) {
      if (c === ",") {
        // Commas shouldn't appear after decimals.
        return INVALID_DECIMAL;
      }
      if (c === ".") {
        // Decimals cannot contain more than a single decimal point.
        return INVALID_DECIMAL;
      }
    } else {
      if (c === ".") {
        if (hasCommas && digitsBetweenCommas != 3) {
          // There must be 3 digits between commas and decimal points.
          return INVALID_DECIMAL;
        }
        hasDecimal = true;
      } else if (c === ",") {
        if (hasCommas) {
          if (digitsBetweenCommas != 3) {
            // There must be 3 digits between commas and decimal points.
            return INVALID_DECIMAL;
          }
        } else {
          if (digitsBetweenCommas > 3) {
            // There must be 3 digits between commas and decimal points.
            return INVALID_DECIMAL;
          }
          hasCommas = true;
        }
        digitsBetweenCommas = 0;
      } else {
        digitsBetweenCommas += 1;
      }

      if (hasCommas && digitsBetweenCommas > 3) {
        return INVALID_DECIMAL;
      }
    }
  }

  // Remove all commas because they can't be processed by `Decimal`.
  input = input.replace(/,/g, "");

  return { isValid: true, decimal: new Decimal(input) };
}

/**
 * Replace all characters between a `left` and `right` index with ellipsis.
 * Very useful for shortening addresses!
 *
 * For example:
 * ```ts
 * ellipsisBetween(6, 4, "0x2F354A88651B1C9F84") === "0x2F35...9F84";
 * ```
 */
export function ellipsisBetween(
  charsFromLeft: number,
  charsFromRight: number,
  str: string,
): string {
  if (charsFromLeft + charsFromRight >= str.length) {
    return str;
  }
  const left = str.slice(0, charsFromLeft);
  const right = str.slice(str.length - charsFromRight);
  return `${left}...${right}`;
}

/**
 * This is a rough estimate of the Fantom block time.
 * You should use this when polling the blockchain for changes!
 */
// TODO: Block times can vary based on chain and congestion.
// Polling could be made more efficient if the `BLOCK_TIME` was
// dynamically updated. There's no reason to poll more often than
// the blocks are actually produced.
export const FANTOM_BLOCK_TIME: number = 2_000;

export interface Erc20Token {
  symbol: string;
  address: TokenAddress;

  /**
   * The number of decimal places this token can represent.
   * Otherwise known as _precision_.
   *
   * Most tokens are 18 decimals, some are not.
   *
   * Don't use this property for converting to/from wei. Use {@link wei} for that.
   */
  decimals: number;

  /**
   * The amount of wei in a single token. You should use this
   * when converting to/from values used by the blockchain!
   * ```ts
   * balance.mul(token.wei); // From tokens to wei
   * balance.div(token.wei); // From wei to tokens
   * ```
   */
  wei: Decimal;
}

export const FANTOM_DAI: Erc20Token = {
  symbol: "DAI",
  address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

export const FANTOM_USDC: Erc20Token = {
  symbol: "USDC",
  address: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
  decimals: 6,
  wei: new Decimal(10 ** 6),
};

export const FANTOM_TOR: Erc20Token = {
  symbol: "TOR",
  address: "0x74E23dF9110Aa9eA0b6ff2fAEE01e740CA1c642e",
  decimals: 18,
  wei: new Decimal(10 ** 18),
};

/**
 * Use this inside `useEffect`s that need to run some async functions.
 * If `abort` is ever true, you should immediately clean up and exit
 * the function.
 *
 * ```ts
 * useEffect(() => {
 *   return asyncEffect(async (signal) => {
 *     // Imagine this fetch takes a while...
 *     const response = await fetch(url);
 *     if (signal.abort) {
 *       // `abort` was set while the fetch was happening.
 *       // You should do nothing else; return immediately!
 *       return;
 *     }
 *     setStatus(response.status);
 *   });
 * }, [url]); // Update every time the url changes
 * ```
 */
function asyncEffect(
  callback: (signal: { abort: boolean }) => Promise<void>,
): () => void {
  const status = { abort: false };
  callback(status);
  return () => {
    status.abort = true;
  };
}

/**
 * Intended as a convenient alternative to `useEffect` for async functions.
 *
 * **!! IMPORTANT !!**
 * - You MUST return as soon as possible when `signal.abort` is `true`.
 * - You MUST NOT destructure `signal` in the `callback` parameter.
 */
export function useAsyncEffect(
  callback: (signal: { abort: boolean }) => Promise<void>,
  deps: React.DependencyList,
) {
  return useEffect(() => asyncEffect(callback), deps);
}

/** Your typical sleep function, for async tasks. */
export async function sleep(millis: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), millis);
  });
}
