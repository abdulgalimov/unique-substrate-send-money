import { cryptoWaitReady } from "@polkadot/util-crypto";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { getContract } from "../contract";
import { callMethod } from "./callMethod";
import { sendMethod } from "./sendMethod";

async function createApi() {
  await cryptoWaitReady();

  const provider: WsProvider = new WsProvider(process.env.OPAL_WS);

  const api = new ApiPromise({
    provider,
  });

  await api.isReady;

  return api;
}

export async function main() {
  const contract = await getContract();

  const api = await createApi();

  /*
  let count1 = await callMethod(api, contract.address, "count1");
  console.log("count before", count1);

  await sendMethod(api, contract.address, "test1", 0);

  count1 = await callMethod(api, contract.address, "count1");
  console.log("count after", count1);
  */

  let count2 = await callMethod(api, contract.address, "count2", 0);
  console.log("count before", count2);

  // await sendMethod(api, contract.address, "test2", 1);
  await callMethod(api, contract.address, "test2", 1);

  count2 = await callMethod(api, contract.address, "count2", 0);
  console.log("count after", count2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
