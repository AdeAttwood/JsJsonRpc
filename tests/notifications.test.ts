import { JsonRpcClient } from "../src/client";
import { JsonRpcService } from "../src/service";

const notifyMe = jest.fn();
const notificationService = new JsonRpcService({ notifyMe });

const client = new JsonRpcClient<(typeof notificationService)["methodMap"]>();
client.sender = function (request) {
  notificationService.handel(request);
};

afterEach(() => {
  notifyMe.mockReset();
});

it("will send a notification", async () => {
  const result = client.notify("notifyMe");
  expect(result).toBeUndefined();
  expect(notifyMe).toBeCalledTimes(1);
});
