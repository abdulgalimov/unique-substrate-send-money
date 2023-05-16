import { Keyring } from "@polkadot/keyring";
import { KeyringPair } from "@polkadot/keyring/types";
import { u8aToHex } from "@polkadot/util";
import { HexString } from "@polkadot/util/types";

const seed = process.env.OPAL_SUBSTRATE_SEED!;

export async function sign(signerPayloadHex: string): Promise<HexString> {
  const keyring = new Keyring({
    type: "sr25519",
  });
  const keyringPair: KeyringPair = keyring.addFromMnemonic(seed);

  const signature = await keyringPair.sign(signerPayloadHex, {
    withType: true,
  });

  return u8aToHex(signature);
}
