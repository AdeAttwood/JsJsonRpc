import { JsonRpcService } from "./service";
import { Request, Response } from "./types";

export class JsonRpcPartialService<T extends { [k: string]: any }> extends JsonRpcService<T> {
  /**
   * Handles a request and returns a response if required. This will not return
   * any errors when there are missing methods. For this you should use the
   * `JsonRpcService`
   */
  async handel<Context, Input, Output>(
    request: Request<Input>,
    context?: Context
  ): Promise<Response<Output> | undefined> {
    if (typeof this.methodMap[request.method] !== "undefined") {
      if (request.id === null) return;
      const result = await this.methodMap[request.method](request.params, context);
      return typeof result === "undefined" ? undefined : { jsonrpc: "2.0", id: request.id, result };
    }
  }
}

export default JsonRpcPartialService;
