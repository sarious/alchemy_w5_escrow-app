import { ethers } from "ethers";
import { getDeployedEscrowContractByAddress } from "./deploy";
import { IEscrow } from "../../components/EscrowContractCard";
import { getContractBalance } from "../../providers/getContractBalance";
import { getWalletSigner } from "../../providers/getSigner";
import { IEscrowContract } from "./IEscrowContract";

function toEscrowInterface(contract: ethers.Contract): IEscrowContract {
  return contract as any as IEscrowContract;
}

export async function getEscrowContract(contractAddress: string) {
  const signer = await getWalletSigner();
  const escrowContract = await getDeployedEscrowContractByAddress(
    contractAddress,
    signer
  );
  const escrowInterface = toEscrowInterface(escrowContract);
  const [arbiter, beneficiary, isApproved, amount] = await Promise.all([
    escrowInterface.arbiter(),
    escrowInterface.beneficiary(),
    escrowInterface.isApproved(),
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
