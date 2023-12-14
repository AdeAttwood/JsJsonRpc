import { IfMaybeUndefined, Noop, Request, Requests, Response, Responses } from "./types";

/**
 * The callback function that will be called to send the request to the server.
 * It will take a request and is responsible for sending it to the server via
 * the correct protocol.
 */
export type Handler = (request: Request<any>) => void;

export class JsonRpcClient<T extends { [k: string]: any }> {
  /**
   * The current request id. It will be incremented after each request.
   */
  private id = 0;
  /**
   * The internal store of all the pending requests the client is waiting for a
   * response for. The key of the map is the request id and the value is a
   * tuple of the resolve and reject functions from the promise that is
   * awaiting the response.
   */
  private responseMap = new Map<string | number, [Noop, Noop]>();
  /**
   * The function that will send the request to the server. It will be defined
   * by the developer using the client to send the request via the correct
   * protocol.
   */
  sender: Handler = () => {
    /* Do nothing */
  };
  /**
   * A handler function to receive the response from the server. It will
   * resolve the promise captured by the `call` method.
   */
  revive<T>(response: Response<T>) {
    const responseMap = this.responseMap.get(response.id);
    if (typeof responseMap !== "undefined") {
      const [resolve, reject] = responseMap;
      response.error ? reject(response.error) : resolve(response.result);
    }
  }
  /**
   * Calls a rpc method on the server. It will return a promise that will
   * resolve when a response is received.
   */
  call<Method extends keyof T>(
    method: Method,
    ...[params]: IfMaybeUndefined<
      Requests<T>[Method][0],
      [params?: Requests<T>[Method][0]],
      [params: Requests<T>[Method][0]]
    >
  ): Promise<NonNullable<Responses<T>[Method]["result"]>> {
    const requestData = { jsonrpc: "2.0", id: this.id++, method: method.toString(), params } as const;
    return new Promise<NonNullable<Responses<T>[Method]["result"]>>((resolve, reject) => {
      this.responseMap.set(requestData.id, [resolve, reject]);
      this.sender(requestData);
    });
  }
  /**
   * Sends a notification to the service.
   */
  notify<Method extends keyof T>(method: Method, params?: Requests<T>[Method][0]): void {
    const requestData = { jsonrpc: "2.0", id: null, method: method.toString(), params } as const;
    this.sender(requestData);
  }
}
