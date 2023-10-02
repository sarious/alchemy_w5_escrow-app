import { ethers } from "ethers";

export async function getContractBalance(
  contractAddress: string
): Promise<ethers.BigNumber> {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  return provider.getBalance(contractAddress);
}
