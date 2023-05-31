import { JsonRpcService } from "../src/service";

const echoService = new JsonRpcService({
  ping() {
    return { text: "pong" };
  },
});

it("will call an echo service", async () => {
  const result = await echoService.handel({
    jsonrpc: "2.0",
    id: 1,
    method: "ping",
    params: {},
  });

  expect(result).toStrictEqual({
    jsonrpc: "2.0",
    id: 1,
    result: {
      text: "pong",
    },
  });
});

it("will call handleMethod", async () => {
  const result = await echoService.handleMethod("ping", 1);
  expect(result).toStrictEqual({
    jsonrpc: "2.0",
    id: 1,
    result: {
      text: "pong",
    },
  });
});

it("will handel method not found", async () => {
  const result = await echoService.handel({
    jsonrpc: "2.0",
    id: 1,
    method: "nono",
    params: {},
  });

  expect(result).toStrictEqual({
    jsonrpc: "2.0",
    id: 1,
    error: {
      code: -32601,
      message: "Method not found",
    },
  });
});
