import { ethers, network } from "hardhat";
import { TestMoney } from "../typechain-types";

async function deploy(): Promise<TestMoney> {
  const TestMoney = await ethers.getContractFactory("TestMoney");
  const testMoney = await TestMoney.deploy();

  const contract = await testMoney.deployed();

  console.log("deploy contract:", contract.address);

  return contract;
}

async function connectAt(address: string): Promise<TestMoney> {
  const TestMoney = await ethers.getContractFactory("TestMoney");
  return TestMoney.attach(address);
}

export async function getContract() {
  const address =
    network.name === "opal" ? process.env.TEST_ADDRESS : undefined;

  return address ? await connectAt(address) : await deploy();
}
