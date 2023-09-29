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

export const AddContractCard: FC<AddContractCardProps> = () => {
  const { addEscrow } = useEscrowActionsContext();

  const addressRef = useRef<HTMLInputElement>(null);

  const handleAddingContract = async (e: any) => {
    e.preventDefault();

    const contractAddress = addressRef.current?.value;
    if (!contractAddress) return;

    const escrow: IEscrow = await getEscrowContract(contractAddress);
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

        <Button onClick={handleAddingContract}>Add Contract</Button>
      </CardBody>
    </Card>
  );
};
