import { ApiPromise } from "@polkadot/api";
import { HexString } from "@polkadot/util/types";
import { ExtrinsicEra, SignerPayload } from "@polkadot/types/interfaces";
import { hexToU8a, u8aToHex } from "@polkadot/util";
import { SignatureOptions } from "@polkadot/types/types/extrinsic";
import { objectSpread } from "@polkadot/util";
import { SubmittableExtrinsic } from "@polkadot/api/promise/types";
import { SignerPayloadRaw } from "@unique-nft/utils/extension";

const buildSubmittableFromArgs = (
  api: ApiPromise,
  buildArgs: any
): SubmittableExtrinsic => {
  const { args } = buildArgs;

  try {
    return api.tx.evm.call(...args);
  } catch (error) {
    throw error;
  }
};

export async function build(buildArgs: any, api: ApiPromise) {
  const { address } = buildArgs;

  const signingInfo = await api.derive.tx.signingInfo(
    address,
    buildArgs.nonce ?? -1,
    buildArgs.isImmortal ? 0 : undefined
  );

  const { nonce, header, mortalLength } = signingInfo;

  const era = !buildArgs.isImmortal
    ? api.registry.createTypeUnsafe<ExtrinsicEra>("ExtrinsicEra", [
        {
          current: header?.number || 0,
          period: buildArgs.era || mortalLength,
        },
      ])
    : undefined;

  const blockHash = buildArgs.isImmortal
    ? api.genesisHash
    : header?.hash || api.genesisHash;

  const {
    genesisHash,
    runtimeVersion,
    registry: { signedExtensions },
  } = api;

  const signatureOptions: SignatureOptions = {
    nonce,
    blockHash,
    era,
    genesisHash,
    runtimeVersion,
    signedExtensions,
  };

  const { method, version } = buildSubmittableFromArgs(api, buildArgs);

  const signerPayload = api.registry.createTypeUnsafe<SignerPayload>(
    "SignerPayload",
    [
      objectSpread({}, signatureOptions, {
        address,
        blockNumber: header?.number || 0,
        method,
        version,
      }),
    ]
  );

  const signerPayloadJSON = signerPayload.toPayload();
  const signerPayloadRaw = signerPayload.toRaw();
  const signerPayloadHex = getSignerPayloadHex(api, signerPayloadRaw);

  return {
    signerPayloadJSON,
    signerPayloadHex,
  };
}

const getSignerPayloadHex = (
  api: ApiPromise,
  signerPayloadRaw: SignerPayloadRaw
): HexString => {
  const rawPayloadDataU8a = hexToU8a(signerPayloadRaw.data);

  if (rawPayloadDataU8a.length > 256) {
    const payloadHash = api.registry.hash(rawPayloadDataU8a);

    return u8aToHex(payloadHash);
  }

  return signerPayloadRaw.data as HexString;
};
