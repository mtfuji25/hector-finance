import { Decimal } from "decimal.js";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

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
  initial: string = "",
): [Decimal, DecimalInput, Dispatch<SetStateAction<string>>] {
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
export function asyncEffect(
  callback: (abort: () => boolean) => Promise<void>,
): () => void {
  const status = { abort: false };
  callback(() => status.abort);
  return () => {
    status.abort = true;
  };
}

/** Your typical sleep function, for async tasks. */
export async function sleep(millis: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), millis);
  });
}

// for getting object values from contract
export function getParameter(index: number, value: string): string {
  let offset = 0;
  if (value.startsWith("0x")) {
    offset = 2;
  }
  return "0x" + value.slice(offset + index * 64, offset + (index + 1) * 64);
}

export function prettifySeconds(seconds: Decimal, resolution?: string) {
  if (!seconds.eq(0) && !seconds) {
    return "";
  }

  const d = seconds.div(3600 * 24).floor();
  const h = seconds
    .mod(3600 * 24)
    .div(3600)
    .floor();
  const m = seconds.mod(3600).div(60).floor();

  if (resolution === "day") {
    return d + (d.eq(1) ? " day" : " days");
  }

  const dDisplay = d.greaterThan(0) ? d + (d.eq(1) ? " day, " : " days, ") : "";
  const hDisplay = h.greaterThan(0) ? h + (h.eq(1) ? " hr, " : " hrs, ") : "";
  const mDisplay = m.greaterThan(0) ? m + (m.eq(1) ? " min" : " mins") : "";

  let result = dDisplay + hDisplay + mDisplay;
  if (mDisplay === "") {
    result = result.slice(0, result.length - 2);
  }

  return result;
}

export function formatCurrency(c: number, precision = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
}

export function assertExists<T>(
  value: T | null | undefined,
): asserts value is T {
  if (value == undefined) {
    throw new Error("unexpected null value");
  }
}
