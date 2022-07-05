import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { z } from "zod";
import {
  ProviderErrorCode,
  ProviderRpcError,
  WalletConnectErrorCode,
  WalletProvider,
} from "./providerEip1193";
import { hexString } from "./util";

enum WalletConnectEvent {
  SessionUpdate = "session_update",
  Disconnect = "disconnect",
  Connect = "connect",
}

const ConnectEvent = z.object({
  event: z.literal(WalletConnectEvent.Connect),
  params: z
    .object({
      peerId: z.string(),
      chainId: z.number(),
      accounts: z.string().array().nonempty(),
    })
    .array()
    .nonempty(),
});

const DisconnectEvent = z.object({
  event: z.literal(WalletConnectEvent.Disconnect),
  message: z.string(),
});

const SessionUpdateEvent = z.object({
  event: z.literal(WalletConnectEvent.SessionUpdate),
  params: z
    .object({
      chainId: z.number(),
      accounts: z.string().array(),
    })
    .array()
    .nonempty(),
});

export async function getProvider(): Promise<WalletProvider | undefined> {
  const wc = new WalletConnect({
    bridge: "https://bridge.walletconnect.org",
    qrcodeModal: QRCodeModal,
    clientMeta: {
      name: "Hector Finance",
      description: "A financial center on the Fantom Opera Chain and beyond.",
      icons: ["https://app.hector.finance/favicon.ico"],
      url: "https://hector.finance",
    },
  });

  try {
    await wc.connect(); // this can block forever
  } catch {
    return undefined;
  }

  return {
    isConnected: () => wc.connected,
    removeListener: (event) => {
      wc.off(event);
    },
    on: (event, listener): void => {
      switch (event) {
        case "connect":
          wc.on(WalletConnectEvent.Connect, (_, payload) => {
            const connect = ConnectEvent.parse(payload);
            // @ts-ignore
            listener({ chainId: hexString(connect.params[0].chainId) });
          });
          break;
        case "disconnect":
          wc.on(WalletConnectEvent.Disconnect, (_, payload) => {
            const disconnect = DisconnectEvent.parse(payload);
            const error: ProviderRpcError = {
              code: ProviderErrorCode.Disconnected,
              message: disconnect.message,
            };
            // @ts-ignore
            listener(error);
          });
          break;
        case "chainChanged":
          wc.on(WalletConnectEvent.SessionUpdate, (_, payload) => {
            const update = SessionUpdateEvent.parse(payload);
            // @ts-ignore
            listener(hexString(update.params[0].chainId));
          });
          break;
        case "accountsChanged":
          wc.on(WalletConnectEvent.SessionUpdate, (_, payload) => {
            const update = SessionUpdateEvent.parse(payload);
            // @ts-ignore
            listener(update.params[0].accounts);
          });
          break;
      }
    },
    request: async (args) => {
      try {
        const response = await wc.sendCustomRequest({
          method: args.method,
          // @ts-ignore
          params: args.params,
          id: Math.floor(Math.random() * 2_147_483_647),
          jsonrpc: "2.0",
        });
        return response;
      } catch (e) {
        let message = "Unknown WalletConnectError";
        if (e instanceof Error) {
          if (e.message) {
            message = e.message;
          }
        }
        const error: ProviderRpcError = {
          code: WalletConnectErrorCode.Error,
          message,
        };
        throw error;
      }
    },
  };
}
