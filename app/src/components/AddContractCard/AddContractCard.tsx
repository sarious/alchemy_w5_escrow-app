import { FC, useRef } from "react";
import { AddContractCardProps } from ".";
import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Flex,
  InputGroup,
  Input,
  Button,
} from "@chakra-ui/react";
import { useEscrowActionsContext } from "../../providers/EscrowListProvider";
import { getEscrowContract } from "../../providers/getSigner";
import { IEscrow } from "../EscrowContractCard";
import { useOperationHandling } from "../../hooks/useOperationHandling";

export const AddContractCard: FC<AddContractCardProps> = () => {
  const { addEscrow } = useEscrowActionsContext();

  const addressRef = useRef<HTMLInputElement>(null);

  const { loading, invoke } = useOperationHandling(
    getEscrowContract,
    "Error while adding contract."
  );

  const handleAddingContract = async (e: any) => {
    e.preventDefault();

    const contractAddress = addressRef.current?.value;
    if (!contractAddress) return;

    const escrow: IEscrow | undefined = await invoke(contractAddress);
    if (!escrow) return;

    addEscrow(escrow);

    if (addressRef.current) {
      // @ts-ignore (us this comment if typescript raises an error)
      addressRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Add Contract</Heading>
      </CardHeader>
      <CardBody as={Flex} direction="column" gap={4}>
        <InputGroup>
          <Input ref={addressRef} size="md" placeholder="Contract Address" />
        </InputGroup>

        <Button
          isLoading={loading}
          loadingText="Adding Contract"
          onClick={handleAddingContract}
        >
          Add Contract
        </Button>
      </CardBody>
    </Card>
  );
};
