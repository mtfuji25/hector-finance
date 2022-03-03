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
