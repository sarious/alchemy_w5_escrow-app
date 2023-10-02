import { ethers } from "ethers";
import { getContract } from "../deploy";
import { IEscrow } from "../components/EscrowContractCard";

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
  return provider.getBalance(contractAddress);
}

export async function approve(
  escrowContract: ethers.Contract,
  signer: ethers.providers.JsonRpcSigner | undefined
) {
  if (!signer) return;

  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export async function getEscrowContract(contractAddress: string) {
  const signer = await getWalletSigner();
  const escrowContract = await getContract(contractAddress, signer);
  const [arbiter, beneficiary, isApproved, amount] = await Promise.all([
    escrowContract.arbiter(),
    escrowContract.beneficiary(),
    escrowContract.isApproved(),
    getContractBalance(contractAddress),
  ]);
  const value = ethers.utils.formatEther(amount);
  const escrow: IEscrow = {
    arbiter,
    beneficiary,
    value,
    isApproved,
    escrowContract,
  };
  return escrow;
}
