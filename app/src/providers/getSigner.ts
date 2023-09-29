import { ethers } from "ethers";

export async function getWalletSigner() {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  return signer;
}

export async function getWalletAccount() {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  return accounts[0];
}

export async function getContractBalance(
  contractAddress: string
): Promise<ethers.BigNumber> {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  return await provider.getBalance(contractAddress);
}

export async function approve(
  escrowContract: ethers.Contract,
  signer: ethers.providers.JsonRpcSigner | undefined
) {
  if (!signer) return;

  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}
