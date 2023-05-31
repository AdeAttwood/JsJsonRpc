import { Request, Response } from "./types";

export function isJsonRpcRequest<T>(maybeRequest: any): maybeRequest is Request<T> {
  return (
    "jsonrpc" in maybeRequest && maybeRequest.jsonrpc === "2.0" && "id" in maybeRequest && "method" in maybeRequest
  );
}

export function isJsonRpcResponse<T>(maybeResponse: any): maybeResponse is Response<T> {
  return (
    "jsonrpc" in maybeResponse &&
    maybeResponse.jsonrpc === "2.0" &&
    "id" in maybeResponse &&
    ("result" in maybeResponse || "error" in maybeResponse)
  );
}
