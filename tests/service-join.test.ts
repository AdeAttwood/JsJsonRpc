import { JsonRpcService } from "../src/service";

const internalService = new JsonRpcService({
  internalMethod() {
    return { text: "internal" };
  },
});

const externalService = new JsonRpcService({
  externalMethod() {
    return { text: "external" };
  },
});

const server = new JsonRpcService({}).join("internal", internalService).join("external", externalService);

it("you can jon services to gether", async () => {
  const result = await server.handleMethod("internal.internalMethod", 1);
  expect(result).toStrictEqual({ jsonrpc: "2.0", id: 1, result: { text: "internal" } });
});
