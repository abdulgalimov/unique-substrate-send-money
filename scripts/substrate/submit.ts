import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/promise/types";
import { HexString } from "@polkadot/util/types";
import { ISubmittableResult } from "@polkadot/types/types/extrinsic";

async function buildSignedSubmittable(
  api: ApiPromise,
  signerPayloadJSON: any,
  signature: HexString
): Promise<SubmittableExtrinsic> {
  const { method, version, address } = signerPayloadJSON;

  // todo 'Extrinsic' -> enum ExtrinsicTypes {} ?
  const extrinsic = api.registry.createType("Extrinsic", {
    method,
    version,
  });

  const submittable = api.tx(extrinsic);

  submittable.addSignature(address, signature, signerPayloadJSON);

  return submittable;
}

export async function submit(
  api: ApiPromise,
  signerPayloadJSON: any,
  signature: HexString
) {
  const submittable = await buildSignedSubmittable(
    api,
    signerPayloadJSON,
    signature
  );

  return new Promise((resolve) => {
    submittable.send((nextTxResult: ISubmittableResult) => {
      if (nextTxResult.isCompleted) {
        resolve(nextTxResult);
      }
    });
  });
}
