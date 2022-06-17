import {
  useState,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
  useRef,
  useContext,
} from "react";
import { Chain } from "./chain";
import {
  getAccountsPermission,
  WalletProvider,
  changeAccounts,
  ProviderRpcError,
  addEthereumChain,
  ProviderContext,
} from "./provider";
import { hexString, Result } from "./util";

export function useWallet(txChain?: Chain): Wallet {
  const { provider, address, chain } = useContext(ProviderContext);
  return useMemo(() => {
    if (!provider) {
      return {
        state: WalletState.Missing,
        connected: false,
      };
    }

    if (chain == undefined || !address) {
      return {
        state: WalletState.Locked,
        connected: false,
        connect: async () => {
          const accounts = await getAccountsPermission(provider);
          if (!accounts.isOk) {
            return;
          }
        },
      };
    }

    if (chain !== txChain?.id) {
      return {
        state: WalletState.CanRead,
        connected: true,
        address,
        chain,
        changeAccounts: async () => {
          await changeAccounts(provider);
        },
        switchChain: txChain
          ? async () =>
              addEthereumChain(provider, {
                chainId: hexString(txChain.id),
                chainName: txChain.longName,
                nativeCurrency: {
                  name: txChain.token.name,
                  decimals: txChain.token.decimals,
                  symbol: txChain.token.symbol,
                },
                rpcUrls: txChain.rpc,
                blockExplorerUrls: txChain.explorers,
              })
          : undefined,
      };
    }

    return {
      state: WalletState.CanWrite,
      connected: true,
      address,
      chain,
      provider,
      changeAccounts: async () => {
        await changeAccounts(provider);
      },
    };
  }, [txChain, provider, address, chain]);
}

/**
 * Wrapper for `useState` that resets to the given `initialState` whenever the wallet changes.
 *
 * You always want `useWalletState` instead of `useState` when displaying
 * wallet-related data like balances and transactions!
 */
export function useWalletState<S>(
  wallet: Wallet,
  initialState: (() => S) | S,
): [S, Dispatch<SetStateAction<S>>] {
  const ref = useRef(initialState); // Using a ref to save the initialState forever
  const [state, setState] = useState(initialState);
  useEffect(() => {
    setState(ref.current);
  }, [wallet]);
  return useMemo(() => [state, setState], [state, setState]);
}

export type Wallet = NoWallet | LockedWallet | ReadWallet | WriteWallet;
export type ConnectedWallet = ReadWallet | WriteWallet;

export type NoWallet = {
  state: WalletState.Missing;
  connected: false;
};

export type LockedWallet = {
  state: WalletState.Locked;
  connected: false;
  connect: () => Promise<void>;
};

export type ReadWallet = {
  state: WalletState.CanRead;
  connected: true;
  address: string;
  chain: number;
  changeAccounts: () => Promise<void>;
  switchChain?: () => Promise<Result<null, ProviderRpcError>>;
};

export type WriteWallet = {
  state: WalletState.CanWrite;
  connected: true;
  address: string;
  chain: number;
  changeAccounts: () => Promise<void>;
  provider: WalletProvider;
};

export enum WalletState {
  Missing,
  Locked,
  CanRead,
  CanWrite,
}
