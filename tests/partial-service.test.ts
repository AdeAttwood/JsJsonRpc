import { JsonRpcPartialService } from "../src/partial-service";

const service = new JsonRpcPartialService({
  async sayHello({ name }: { name: string }) {
    return { text: `Hello ${name}` };
  },
});

it("will return undefined when a method is not found", async () => {
  const response = await service.handel({ jsonrpc: "2.0", id: 1, method: "notfound", params: {} });
  expect(response).toBeUndefined();
});
