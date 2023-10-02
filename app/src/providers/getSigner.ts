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
