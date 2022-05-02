import { z } from "zod";
import { ok, Result } from "./util";

export interface CallOptions {
  from?: string;
  to: string;
  gas?: string;
  gasPrice?: string;
  value?: string;
  data?: string;
}

export async function call(
  endpoint: string,
  options: CallOptions,
  block: "latest" | "earliest" | "pending" = "latest",
): Promise<Result<string, RpcErrorCode>> {
  const body = {
    jsonrpc: "2.0",
    id: null,
    method: "eth_call",
    params: [options, block],
  };
  return fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  }).then(
    (value) => ok(z.string().parse(value)),
    (err) => err(z.nativeEnum(RpcErrorCode).parse(err)),
  );
}

export enum RpcErrorCode {
  /** Invalid JSON (standard) */
  InvalidJson = -32700,

  /** JSON is not a valid request object (standard) */
  InvalidRequest = -32600,

  /** Method does not exist (standard) */
  MethodNotFound = -32601,

  /** Invalid method parameters (standard) */
  InvalidParams = -32602,

  /** Internal JSON-RPC error	(standard) */
  InternalError = -32603,

  /** Missing or invalid parameters (non-standard) */
  InvalidInput = -32000,

  /** Requested resource not found (non-standard) */
  ResourceNotFound = -32001,

  /** Requested resource not available (non-standard) */
  ResourceUnavailable = -32002,

  /** Transaction creation failed	(non-standard) */
  TransactionRejected = -32003,

  /** Method is not implemented (non-standard) */
  MethodNotSupported = -32004,

  /** Request exceeds defined limit (non-standard) */
  LimitExceeded = -32005,

  /** Version of JSON-RPC protocol is not supported (non-standard) */
  RpcVersionUnsupported = -32006,
}
