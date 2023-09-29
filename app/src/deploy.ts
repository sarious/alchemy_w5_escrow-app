import { ethers } from "ethers";
import Escrow from "./artifacts/contracts/Escrow.sol/Escrow.json";

export default async function deploy(
  signer: ethers.Signer | undefined,
  arbiter: string,
  beneficiary: string,
  value: ethers.BigNumber
): Promise<ethers.Contract> {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );

  return factory.deploy(arbiter, beneficiary, { value });
}

export async function getContract(
  address: string,
  signer: ethers.Signer | undefined
): Promise<ethers.Contract> {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );

  return factory.attach(address).deployed();
}
