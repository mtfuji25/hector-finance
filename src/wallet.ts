import { useState, useEffect, useMemo } from "react";
import {
  getProvider,
  getAccount,
  getChain,
  getAccountsPermission,
  Provider,
} from "./provider";

export function useWallet(): Wallet {
  const [provider, setProvider] = useState<Provider>();
  const [address, setAddress] = useState<string>();
  const [network, setNetwork] = useState<string>();

  useEffect(() => {
    (async function () {
      const provider = await getProvider();
      setProvider(provider);
    })();
  }, []);

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
      setNetwork(result.value);
    });

    const onChainChanged = (chainId: string) => {
      setNetwork(chainId);
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

    return { state: WalletState.Connected, address, network, provider };
  }, [provider, address, network]);
}

export enum WalletState {
  NoWallet = "NoWallet",
  Disconnected = "Disconnected",
  Connected = "Connected",
}

export type Wallet =
  | { state: WalletState.NoWallet }
  | { state: WalletState.Disconnected; connect: () => Promise<void> }
  | {
      state: WalletState.Connected;
      address: string;
      network: string;
      provider: Provider;
    };
