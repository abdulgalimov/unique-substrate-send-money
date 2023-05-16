import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.OPAL_RPC) {
  console.log('env variable OPAL_RPC not found');
  process.exit(-1);
}
if (!process.env.OPAL_PRIVATE_KEY) {
  console.log('env variable OPAL_PRIVATE_KEY not found');
  process.exit(-1);
}

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    opal: {
      url: process.env.OPAL_RPC,
      accounts: [process.env.OPAL_PRIVATE_KEY!],
    },
  },
  mocha: {
    timeout: 100000000,
  },
};

export default config;
