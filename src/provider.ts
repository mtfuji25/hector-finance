import { z } from "zod";
import { ok, err, Result } from "src/util";
import { RpcErrorCode } from "./rpc";

/** Returns the balance of an address in wei */
export async function getBalanceAtBlock(
  provider: Provider,
  address: string,
  block: "latest" | "earliest" | "pending" = "latest",
): Promise<Result<string, ProviderRpcError>> {
  return provider
    .request({
      method: "eth_getBalance",
      params: [address, block],
    })
    .then(
      (_balance) => {
        const balance = z.string().parse(_balance);
        return ok(balance);
      },
      (e) => err(ProviderRpcError.parse(e)),
    );
}

export async function getBalance(
  provider: Provider,
  address: string,
): Promise<Result<string, ProviderRpcError>> {
  return getBalanceAtBlock(provider, address, "latest");
}

/** Returns the number of the most recent block seen by this client */
export async function getBlockNumber(
  provider: Provider,
): Promise<Result<string, ProviderRpcError>> {
  return provider.request({ method: "eth_blockNumber" }).then(
    (_block) => {
      const block = z.string().parse(_block);
      return ok(block);
    },
    (e) => err(ProviderRpcError.parse(e)),
  );
}

export async function getChain(
  provider: Provider,
): Promise<Result<string, ProviderRpcError>> {
  return provider.request({ method: "eth_chainId" }).then(
    (chain) => ok(z.string().parse(chain)),
    (e) => err(ProviderRpcError.parse(e)),
  );
}

/** Returns a list of addresses owned by client.  */
export async function getAccount(
  provider: Provider,
): Promise<Result<string[], ProviderRpcError>> {
  return provider.request({ method: "eth_accounts" }).then(
    (_addresses) => {
      const addresses = z.array(z.string()).max(1).parse(_addresses);
      return ok(addresses);
    },
    (e) => err(ProviderRpcError.parse(e)),
  );
}

/** Requests that the user provides an Ethereum address to be identified by.
 * @returns Current address.
 */
export async function getAccountsPermission(
  provider: Provider,
): Promise<Result<string[], ProviderRpcError>> {
  return provider.request({ method: "eth_requestAccounts" }).then(
    (_addresses) => {
      // eth_requestAccounts is currently defined to return a single element array of strings.
      // It should be no more and no less than a single element.
      const addresses = z.array(z.string()).max(1).parse(_addresses);
      return ok(addresses);
    },
    (e) => err(ProviderRpcError.parse(e)),
  );
}

/** Creates a confirmation asking the user to add the specified chain to MetaMask.
 * The user may choose to switch to the chain once it has been added.
 *
 * As with any method that causes a confirmation to appear, wallet_addEthereumChain
 * should only be called as a result of direct user action, such as the click of a button.
 *
 * MetaMask stringently validates the parameters for this method, and will reject the
 * request if any parameter is incorrectly formatted. In addition, MetaMask will
 * automatically reject the request under the following circumstances:
 * - If the RPC endpoint doesn't respond to RPC calls.
 * - If the RPC endpoint returns a different chain ID when eth_chainId is called.
 * - If the chain ID corresponds to any default MetaMask chains.
 *
 * MetaMask does not yet support chains with native currencies that do not have 18 decimals
 * , but may do so in the future.
 */
export async function addEthereumChain(
  provider: Provider,
  /** A 0x-prefixed hexadecimal string */
  chainId: string,
  chainName: string,
  tokenName: string,
  /** 2-6 characters long */
  tokenSymbol: string,
  tokenDecimals: number,
  rpcUrls: string[],
  blockExplorerUrls?: string[],
): Promise<Result<null, ProviderRpcError>> {
  return provider
    .request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId,
          chainName,
          nativeCurrency: {
            name: tokenName,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
          rpcUrls,
          blockExplorerUrls,
        },
      ],
    })
    .then(
      (value) => ok(z.null().parse(value)),
      (e) => err(ProviderRpcError.parse(e)),
    );
}

export async function switchEthereumChain(
  provider: Provider,
  /** Chain to switch to, by `0x`-prefixed hexadecimal chain id. */
  chainId: string,
): Promise<Result<null, ProviderRpcError>> {
  return provider
    .request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    })
    .then(
      (value) => ok(z.null().parse(value)),
      (e) => err(ProviderRpcError.parse(e)),
    );
}

/** Registers the requesting site with MetaMask as the initiator of onboarding.
 * Returns a Promise that resolves to true, or rejects if there's an error.
 *
 * This method is intended to be called after MetaMask has been installed,
 * but before the MetaMask onboarding has completed. You can use this method to
 * inform MetaMask that you were the one that suggested installing MetaMask.
 * This lets MetaMask redirect the user back to your site after onboarding has completed.
 */
export async function registerOnboarding(
  provider: Provider,
): Promise<Result<boolean, ProviderRpcError>> {
  return provider.request({ method: "wallet_registerOnboarding" }).then(
    (isOk) => ok(z.boolean().parse(isOk)),
    (e) => err(ProviderRpcError.parse(e)),
  );
}

/** Requests that the user tracks the token in MetaMask.
 * Returns a boolean indicating if the token was successfully added.
 */
export async function watchAsset(
  provider: Provider,
  address: string,
  symbol: string,
  decimals: number,
  image: string,
): Promise<Result<boolean, ProviderRpcError>> {
  return provider
    .request({
      method: "wallet_watchAsset",
      params: {
        /** In the future, other standards will be supported */
        type: "ERC20",
        options: {
          /** The address of the token contract */
          address,
          /** A ticker symbol or shorthand, up to 5 characters */
          symbol,
          /** The number of token decimals */
          decimals,
          /** A string url of the token logo. **Don't use data urls!** */
          image,
        },
      },
    })
    .then(
      (isOk) => ok(z.boolean().parse(isOk)),
      (e) => err(ProviderRpcError.parse(e)),
    );
}

export interface CallOptions {
  from?: string;
  to: string;
  gas?: string;
  gasPrice?: string;
  value?: string;
  data?: string;
}

export async function call(
  provider: Provider,
  options: CallOptions,
  block: "latest" | "earliest" | "pending" = "latest",
): Promise<Result<string, ProviderRpcError>> {
  return provider
    .request({
      method: "eth_call",
      params: [options, block],
    })
    .then(
      (data) => ok(z.string().parse(data)),
      (e) => err(ProviderRpcError.parse(e)),
    );
}

export interface TransactionOptions {
  /** transaction sender */
  from: string;
  /** transaction recipient */
  to?: string;
  /** gas provided for transaction execution */
  gas?: string;
  /** price in wei of each gas used */
  gasPrice?: string;
  /** value in wei sent with this transaction */
  value?: string;
  /** contract code or a hashed method call with encoded args */
  data?: string;
  /** unique number identifying this transaction */
  nonce?: string;
}

/** Creates, signs, and sends a new transaction to the network. */
export async function sendTransaction(
  provider: Provider,
  options: TransactionOptions,
): Promise<Result<TransactionAddress, ProviderRpcError>> {
  return provider
    .request({ method: "eth_sendTransaction", params: [options] })
    .then(
      (data) => ok(z.string().parse(data)),
      (e) => err(ProviderRpcError.parse(e)),
    );
}

export interface Provider {
  /**
   * Note that this method has nothing to do with the user's accounts.
   *
   * You may often encounter the word "connected" in reference to whether a web3
   * site can access the user's accounts. In the provider interface, however,
   * "connected" and "disconnected" refer to whether the provider can make
   * RPC requests to the current chain.
   */
  isConnected: () => boolean;

  /** Submit RPC requests to Ethereum via MetaMask. Returns the result of the RPC call.
   * @throws ProviderRpcError
   */
  request: <T>(args: {
    method: string;
    params?: unknown[] | object;
  }) => Promise<T>;

  on: <K extends keyof ProviderEventMap>(
    eventName: K,
    listener: ProviderEventMap[K],
  ) => void;

  removeListener: <K extends keyof ProviderEventMap>(
    eventName: K,
    listener: ProviderEventMap[K],
  ) => void;

  /** Property set by MetaMask. Non-standard. */
  isMetaMask?: boolean;
}

/** Get the Ethereum provider (most likely MetaMask).
 *
 * Why is this a promise? There's a high chance that a provider isn't loaded
 * by the time this is called. Using `getProvider` will ensure you get the provider
 * when it's actually ready.
 */
export async function getProvider(): Promise<Provider> {
  return new Promise((resolve) => {
    function _getProvider(): void {
      if (window.ethereum != undefined) {
        resolve(window.ethereum);
      } else {
        setTimeout(_getProvider, 350);
      }
    }
    _getProvider();
  });
}

// File-local override of `Window` which includes the Web3 declaration.
declare const window: { ethereum?: Provider } & Window;

interface ProviderEventMap {
  /**
   * The Provider emits connect when it:
   * - first connects to a chain after being initialized.
   * - first connects to a chain, after the disconnect event was emitted.
   */
  connect: (info: { chainId: string }) => void;

  /**
   * The Provider emits disconnect when it becomes disconnected from all chains.
   */
  disconnect: (error: ProviderRpcError) => void;

  /**
   * The Provider emits chainChanged when connecting to a new chain.
   */
  chainChanged: (chainID: string) => void;

  /**
   * The Provider emits accountsChanged if the accounts returned from
   * the Provider (eth_accounts) change.
   */
  accountsChanged: (accounts: [AccountAddress] | []) => void;

  /**
   * The Provider emits message to communicate arbitrary messages to the consumer.
   * Messages may include JSON-RPC notifications, GraphQL subscriptions, and/or any
   * other event as defined by the Provider.
   */
  message: (message: { type: string; data: unknown }) => void;
}

/** Address of a transaction. This isn't very type-safe, so be careful. */
export type TransactionAddress = string;

/** Address of an ERC20 token. This isn't very type-safe, so be careful. */
export type TokenAddress = string;

/** Address of an account. This isn't very type-safe, so be careful! */
export type AccountAddress = string;

enum ProviderErrorCode {
  /** The user rejected the request. */
  UserRejectedRequest = 4001,

  /** The requested method and/or account has not been authorized by the user. */
  Unauthorized = 4100,

  /** The Provider does not support the requested method. */
  UnsupportedMethod = 4200,

  /** The Provider is disconnected from all chains. */
  Disconnected = 4900,

  /** The Provider is not connected to the _requested_ chain, but is connected to _other_ chain(s). */
  ChainDisconnected = 4901,
}

const ProviderRpcError = z.object({
  message: z.string(),
  code: z.nativeEnum(ProviderErrorCode).or(z.nativeEnum(RpcErrorCode)),
  data: z.optional(z.unknown()),
  stack: z.optional(z.string()),
});

export type ProviderRpcError = z.infer<typeof ProviderRpcError>;
