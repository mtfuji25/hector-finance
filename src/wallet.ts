import {
  useState,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import {
  getProvider,
  getAccount,
  getChain,
  getAccountsPermission,
  Provider,
  changeAccounts,
} from "./provider";
import { useAsyncEffect } from "./util";

export function useWallet(): Wallet {
  const [provider, setProvider] = useState<Provider>();
  const [address, setAddress] = useState<string>();
  const [network, setNetwork] = useState<number>();

  useAsyncEffect(() => getProvider().then(setProvider), []);

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
      setNetwork(parseInt(result.value, 16));
    });

    const onChainChanged = (chainId: string) => {
      setNetwork(parseInt(chainId, 16));
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
      return { state: WalletState.NoWallet };
    }

    if (network !== 0xfa) {
      return {
        state: WalletState.SwitchFantomChain,
        switchToFantom: async () => {
          const fantomChain = 0xfa;
          return provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + fantomChain.toString(16) }],
          });
        },
      };
    }
    if (!network || !address) {
      return {
        state: WalletState.Disconnected,
        connect: async () => {
          const accounts = await getAccountsPermission(provider);
          if (!accounts.isOk) {
            return;
          }
          setAddress(accounts.value[0]);
        },
      };
    }

    return {
      state: WalletState.Connected,
      changeAccounts: async () => {
        const accounts = await changeAccounts(provider);
        console.log(accounts);
        if (!accounts.isOk) {
          return;
        }
        setAddress(accounts.value[0]);
      },
      address,
      network,
      provider,
    };
  }, [provider, address, network]);
}

/**
 * Wrapper for `useState` that resets to the given `initialState` whenever the wallet changes.
 *
 * You always want `useWalletState` instead of `useState` when displaying
 * wallet-related data like balances and transactions!
 */
export function useWalletState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<SetStateAction<S>>] {
  const wallet = useWallet();
  const ref = useRef(initialState); // Using a ref to save the initialState forever
  const [state, setState] = useState(initialState);
  useEffect(() => {
    setState(ref.current);
  }, [wallet]);
  return useMemo(() => [state, setState], [state, setState]);
}

export type Wallet =
  | MissingWallet
  | DisconnectedWallet
  | ConnectedWallet
  | SwitchFantomChainWallet;
export type MissingWallet = { state: WalletState.NoWallet };
export type DisconnectedWallet = {
  state: WalletState.Disconnected;
  connect: () => Promise<void>;
};
export type ConnectedWallet = {
  state: WalletState.Connected;
  address: string;
  network: number;
  provider: Provider;
  changeAccounts: () => Promise<void>;
};
export type SwitchFantomChainWallet = {
  state: WalletState.SwitchFantomChain;
  switchToFantom: () => Promise<void>;
};

export enum WalletState {
  NoWallet,
  Disconnected,
  Connected,
  SwitchFantomChain,
}
