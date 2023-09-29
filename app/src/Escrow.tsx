import { useState } from "react";
import { ethers } from "ethers";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Text,
} from "@chakra-ui/react";

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
  isApproved: boolean;
  escrowContract: ethers.Contract;
}

const provider = new ethers.providers.Web3Provider((window as any).ethereum);

export default function Escrow({
  arbiter,
  beneficiary,
  value,
  isApproved,
  escrowContract,
}: IEscrow & { className?: string }) {
  const [approved, setApproved] = useState(isApproved);
  const [loading, setLoading] = useState(false);

  const handleApproveClick = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    escrowContract.once("Approved", () => {
      setApproved(true);
      setLoading(false);
    });

    const signer = provider.getSigner();

    try {
      await approve(escrowContract, signer);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert((error as any).message);
      return;
    }
  };

  return (
    <Card>
      <CardHeader as={Flex}>
        <Text as="b">Contract {escrowContract.address}</Text>
      </CardHeader>
      <CardBody as={Flex} direction="column" gap={2} pt={0}>
        <Flex gap={2}>
          <Text as="b">Arbiter: </Text>
          <Text>{arbiter}</Text>
        </Flex>

        <Flex gap={2}>
          <Text as="b">Beneficiary: </Text>
          <Text>{beneficiary}</Text>
        </Flex>

        <Flex gap={2}>
          <Text as="b">Value: </Text>
          <Text>{value} ETH</Text>
        </Flex>

        {approved && (
          <Button
            bgColor="green.100"
            disabled
            _hover={{ bhColor: "green.100" }}
          >
            ✓ It's been approved!
          </Button>
        )}
        {!approved && (
          <Button
            isLoading={loading}
            loadingText="Approving"
            onClick={handleApproveClick}
          >
            Approve
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
