import { JsonRpcClient } from "../src/client";
import { JsonRpcService } from "../src/service";

const echoService = new JsonRpcService({
  ping() {
    return { text: "pong" };
  },
  hasParams({ name }: { name: string }, context: { prefix: string }) {
    return { text: `${context.prefix} ${name}` };
  },
});

const client = new JsonRpcClient<(typeof echoService)["methodMap"]>();
client.sender = async (request) => {
  const result = await echoService.handel(request, { prefix: "Hello" });
  if (result) client.revive(result);
};

it("will send and receive messages", async () => {
  const { text } = await client.call("ping");
  expect(text).toBe("pong");
});

it("can call a method with a context", async () => {
  const { text } = await client.call("hasParams", { name: "Taylor" });
  expect(text).toBe("Hello Taylor");
});

it("will handel a method not found", async () => {
  try {
    await client.call("notfound" as any, { name: "Taylor" });
  } catch (e: any) {
    expect(e.message).toBe("Method not found");
    expect(e.code).toBe(-32601);
  }

  expect.assertions(2);
});

it("will not crash with a response is is not waiting for", async () => {
  client.revive({ jsonrpc: "2.0", id: 99999, result: { text: "pong" } });
});
