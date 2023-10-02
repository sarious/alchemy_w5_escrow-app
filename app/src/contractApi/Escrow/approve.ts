import { ethers } from "ethers";

export async function approve(
  escrowContract: ethers.Contract,
  signer: ethers.providers.JsonRpcSigner | undefined
) {
  if (!signer) return;

  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}
