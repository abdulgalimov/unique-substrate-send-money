import { ApiPromise } from "@polkadot/api";
import { contractInterface, ethAddress } from "./base";

export async function callMethod(
  api: ApiPromise,
  contractAddress: string,
  name: string,
  money: number,
  ...values: any[]
) {
  console.log(`call method "${name}"`);
  const encodeData = contractInterface.encodeFunctionData(name);

  const callData: any = {
    from: ethAddress,
    to: contractAddress,
    data: encodeData,
  };
  if (money) {
    callData.value = money;
    console.log("call data", callData);
  }

  const result = await api.rpc.eth.call(callData);

  const decodedResult = contractInterface.decodeFunctionResult(
    name,
    result.toHex()
  );

  return decodedResult;
}
