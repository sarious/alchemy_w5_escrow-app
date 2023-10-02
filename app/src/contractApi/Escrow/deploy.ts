import { ethers } from "ethers";
import Escrow from "../../artifacts/contracts/Escrow.sol/Escrow.json";
import { Interface } from "ethers/lib/utils";

export default async function deployEscrowContract(
  signer: ethers.Signer | undefined,
  arbiter: string,
  beneficiary: string,
  value: ethers.BigNumber
): Promise<ethers.Contract> {
  const factory = getEscrowContractFactory(signer);

  return factory.deploy(arbiter, beneficiary, { value });
}

export async function getDeployedEscrowContractByAddress(
  address: string,
  signer: ethers.Signer | undefined
): Promise<ethers.Contract> {
  const factory = getEscrowContractFactory(signer);

  return factory.attach(address).deployed();
}

function getEscrowContractFactory(signer: ethers.Signer | undefined) {
  return new ethers.ContractFactory(Escrow.abi, Escrow.bytecode, signer);
}
