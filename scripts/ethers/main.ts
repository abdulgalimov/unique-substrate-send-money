import { getContract } from "../contract";

export async function main() {
  const contract = await getContract();

  console.log("count1 before", await contract.functions.count1());
  await (await contract.test1()).wait();
  console.log("count1 after", await contract.functions.count1());

  console.log("count2 before", await contract.functions.count2());
  await (await contract.test2({ value: 1 })).wait();
  await (await contract.test2()).wait();
  console.log("count2 after", await contract.functions.count2());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
