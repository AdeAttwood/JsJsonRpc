import { Request, Response, Requests, Responses, Noop } from "./types";

/**
 * Internal helper type to merge to other object types together. This gives you
 * a better output when using templates that unioning the two types with `&`.
 *
 * @example
 * type A = { a: string };
 * type B = { b: string };
 * type C = Merge<A, B>; // This is now { a: string; b: string; }
 */
type Merge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof A & keyof B
    ? A[K] | B[K]
    : K extends keyof B
    ? B[K]
    : K extends keyof A
    ? A[K]
    : never;
};

export class JsonRpcService<T extends { [k: string]: any }> {
  /**
   * The internal map of all the methods that the service can handle. The key
   * is the method name and the value is the function that will handle the
   * request.
   */
  protected methodMap: T;
  /**
   * Initializes the service with the base methods that it can handle.
   */
  constructor(baseMethods: T) {
    this.methodMap = baseMethods;
  }
  /**
   * Handles a request and returns a response. This will take a raw request
   * object and will handle method not found errors. This can be used to pass
   * the raw request in from the server to keep your application code clean.
   */
  async handel<Context, Input, Output>(
    request: Request<Input>,
    context?: Context
  ): Promise<Response<Output> | undefined> {
    if (typeof this.methodMap[request.method] === "undefined") {
      // TODO(AdeAttwood): Find out if we need to send a not found error for a notification
      return {
        jsonrpc: "2.0",
        id: request.id || 0,
        error: {
          code: -32601,
          message: "Method not found",
        },
      };
    }

    const result = await this.methodMap[request.method](request.params, context);
    return typeof result === "undefined" || request.id === null
      ? undefined
      : { jsonrpc: "2.0", id: request.id, result };
  }
  /**
   * Handles a method call and returns a response. This will take a method name
   * and params separately, relies on typescript to ensure that the method
   * exists and the params are correct for the method.
   */
  async handleMethod<Method extends keyof T>(
    method: Method,
    id: number,
    params?: Requests<T>[Method]
  ): Promise<Responses<T>[Method]> {
    const result = await this.methodMap[method](...(params || []));
    return { jsonrpc: "2.0", id, result };
  }
  /**
   * Join another service to this service. This will take another service all
   * methods in that service will be prefixed with the `prefix`. This can be
   * used to namespace you rpc services and keep them organized.
   */
  join<In extends Record<string, Noop>, P extends string>(
    prefix: P,
    service: JsonRpcService<In>
  ): JsonRpcService<Merge<T, { [M in keyof In as `${P & string}.${M & string}`]: In[M] }>> {
    for (const method in service.methodMap) {
      (this.methodMap as any)[`${prefix}.${method}`] = service.methodMap[method];
    }

    return this as JsonRpcService<Merge<T, { [M in keyof In as `${P & string}.${M & string}`]: In[M] }>>;
  }
}
