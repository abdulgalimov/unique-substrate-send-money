import { Address } from "@unique-nft/utils";
import fs from "fs";
import { ethers } from "hardhat";

const artifact = JSON.parse(
  fs.readFileSync("artifacts/contracts/TestMoney.sol/TestMoney.json").toString()
);

export const substrateAddress = process.env.OPAL_SUBSTRATE_ADDRESS!;
export const ethAddress = Address.mirror.substrateToEthereum(substrateAddress);
export const abi = artifact.abi;
export const contractInterface = new ethers.utils.Interface(abi);
