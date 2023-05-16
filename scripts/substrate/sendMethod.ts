import { ApiPromise } from "@polkadot/api";
import { contractInterface, ethAddress, substrateAddress } from "./base";
import { build } from "./build";
import { sign } from "./sign";
import { submit } from "./submit";

export async function sendMethod(
  api: ApiPromise,
  address: string,
  name: string,
  money: number,
  ...values: any[]
) {
  const encodeData = contractInterface.encodeFunctionData(name, ...values);

  const maxFeePerGasSafe = (await api.rpc.eth.gasPrice()).toNumber();

  const sendData = {
    address: substrateAddress,
    args: [
      ethAddress,
      address,
      encodeData,
      money || 0,
      2_500_000,
      maxFeePerGasSafe,
      null,
      null,
      [],
    ],
  };
  const { signerPayloadHex, signerPayloadJSON } = await build(sendData, api);

  const signature = await sign(signerPayloadHex);

  await submit(api, signerPayloadJSON, signature);
}
