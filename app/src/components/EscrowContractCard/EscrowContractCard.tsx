import { FC, useState } from "react";
import { EscrowContractCardProps } from ".";
import {
  Card,
  CardHeader,
  Flex,
  CloseButton,
  CardBody,
  Button,
  Text,
} from "@chakra-ui/react";
import { approve, getWalletSigner } from "../../providers/getSigner";
import { useEscrowActionsContext } from "../../providers/EscrowListProvider";

export const EscrowContractCard: FC<EscrowContractCardProps> = ({
  arbiter,
  beneficiary,
  value,
  isApproved,
  escrowContract,
}) => {
  const { removeEscrow } = useEscrowActionsContext();
  const [approved, setApproved] = useState(isApproved);
  const [loading, setLoading] = useState(false);

  const handleApproveClick = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    escrowContract.once("Approved", () => {
      setApproved(true);
      setLoading(false);
    });

    try {
      const signer = await getWalletSigner();
      await approve(escrowContract, signer);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert((error as any).message);
      return;
    }
  };

  const deleteEscrowContract = () => {
    removeEscrow(escrowContract.address);
  };

  return (
    <Card>
      <CardHeader as={Flex} justifyContent="space-between" alignItems="center">
        <Text as="b">Contract {escrowContract.address}</Text>
        <CloseButton onClick={deleteEscrowContract} size="md" />
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
};
