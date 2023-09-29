import { FC, useEffect, useState } from "react";
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

  useEffect(() => {
    if (!approved) {
      escrowContract.once("Approved", () => {
        setApproved(true);
        setLoading(false);
      });
    }
  }, []);

  const handleApproveClick = async (e: any) => {
    e.preventDefault();
    setLoading(true);

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
    <Card bgColor={approved ? "green.100" : "red.100"}>
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
            bgColor="transparent"
            disabled
            _hover={{ bhColor: "tranparent" }}
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
