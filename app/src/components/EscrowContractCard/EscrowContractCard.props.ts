import { ethers } from "ethers";

export interface IEscrow {
  arbiter: string;
  beneficiary: string;
  value: string;
  isApproved: boolean;
  escrowContract: ethers.Contract;
}

export interface EscrowContractCardProps extends IEscrow {}
