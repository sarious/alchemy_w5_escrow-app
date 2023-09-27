import { useState } from "react";
import { ethers } from "ethers";
import { Button, Typography } from "antd";
import Card from "antd/es/card/Card";

export async function approve(
  escrowContract: ethers.Contract,
  signer: ethers.providers.JsonRpcSigner | undefined
) {
  if (!signer) return;

  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export interface IEscrow {
  arbiter: string;
  beneficiary: string;
  value: string;
  escrowContract: ethers.Contract;
}

const provider = new ethers.providers.Web3Provider((window as any).ethereum);

export default function Escrow({
  arbiter,
  beneficiary,
  value,
  escrowContract,
}: IEscrow) {
  const [approved, setApproved] = useState(false);

  const handleApproveClick = async (e: any) => {
    e.preventDefault();

    escrowContract.once("Approved", () => {
      setApproved(true);
    });

    const signer = await provider.getSigner();

    try {
      await approve(escrowContract, signer);
    } catch (error) {
      console.log(error);
      alert((error as any).message);
      return;
    }
  };

  return (
    <Card>
      <Typography.Text strong>Arbiter: </Typography.Text>
      <Typography.Text copyable>{arbiter}</Typography.Text>
      <Typography.Text strong>Beneficiary: </Typography.Text>
      <Typography.Text copyable>{beneficiary}</Typography.Text>
      <Typography.Text strong>Value: </Typography.Text>
      <Typography.Text>{value}</Typography.Text>
      {approved && <div>✓ It's been approved!</div>}
      {!approved && (
        <Button block type="primary" onClick={handleApproveClick}>
          Approve
        </Button>
      )}
    </Card>
  );
}
