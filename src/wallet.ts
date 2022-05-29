import {
  useState,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import { Chain } from "./chain";
import {
  getAccount,
  getChain,
  getAccountsPermission,
  WalletProvider,
  changeAccounts,
  ProviderRpcError,
  addEthereumChain,
  getProvider,
} from "./provider";
import { hexString, Result } from "./util";

export function useWallet(txChain?: Chain): Wallet {
  const provider = useProvider();
  const [address, setAddress] = useState<string>();
  const [chain, setChain] = useState<number>();

  useEffect(() => {
    if (!provider) {
      return;
    }

    getAccount(provider).then((result) => {
      if (!result.isOk) {
        return;
      }
      setAddress(result.value[0]);
    });

    getChain(provider).then((result) => {
      if (!result.isOk) {
        return;
      }
      setChain(parseInt(result.value, 16));
    });

    const onChainChanged = (chainId: string) => {
      setChain(parseInt(chainId, 16));
    };

    const onAccountsChanged = (accounts: string[]) => {
      setAddress(accounts[0]);
    };

    provider.on("chainChanged", onChainChanged);
    provider.on("accountsChanged", onAccountsChanged);
    return () => {
      provider.removeListener("chainChanged", onChainChanged);
      provider.removeListener("accountsChanged", onAccountsChanged);
    };
  }, [provider]);

  return useMemo(() => {
    if (!provider) {
      return {
        state: WalletState.NoWallet,
        connected: false,
      };
    }

    if (!chain || !address) {
      return {
        state: WalletState.Locked,
        connected: false,
        connect: async () => {
          const accounts = await getAccountsPermission(provider);
          if (!accounts.isOk) {
            return;
          }
          setAddress(accounts.value[0]);
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

function useProvider(): WalletProvider | undefined {
  const [provider, setProvider] = useState<WalletProvider>();
  useEffect(() => {
    getProvider().then(setProvider);
  }, []);
  return provider;
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

export type Wallet = MissingWallet | LockedWallet | ReadWallet | WriteWallet;
export type ConnectedWallet = ReadWallet | WriteWallet;

export type MissingWallet = {
  state: WalletState.NoWallet;
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
  NoWallet,
  Locked,
  CanRead,
  CanWrite,
}
