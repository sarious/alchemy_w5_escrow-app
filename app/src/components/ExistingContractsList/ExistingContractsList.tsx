import { FC, useRef } from "react";
import { ExistingContractsListProps } from ".";
import { getContractBalance, getWalletSigner } from "../../providers/getSigner";
import { getContract } from "../../deploy";
import { ethers } from "ethers";
import {
  Flex,
  Heading,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  InputGroup,
  InputLeftAddon,
  Input,
  Button,
} from "@chakra-ui/react";
import { EscrowContractCard, IEscrow } from "../EscrowContractCard";
import {
  useEscrowActionsContext,
  useEscrowListContext,
} from "../../providers/EscrowListProvider";

export const ExistingContractsList: FC<ExistingContractsListProps> = () => {
  const { addEscrow } = useEscrowActionsContext();
  const escrows = useEscrowListContext();
  const addressRef = useRef<HTMLInputElement>(null);

  const handleAddingContract = async (e: any) => {
    e.preventDefault();

    const contractAddress = addressRef.current?.value;
    if (!contractAddress) return;

    const signer = await getWalletSigner();
    const escrowContract = await getContract(contractAddress, signer);
    const arbiter = await escrowContract.arbiter();
    const beneficiary = await escrowContract.beneficiary();
    const isApproved = await escrowContract.isApproved();
    const amount = await getContractBalance(contractAddress);
    const value = ethers.utils.formatEther(amount);
    const escrow: IEscrow = {
      arbiter,
      beneficiary,
      value,
      isApproved,
      escrowContract,
    };

    addEscrow(escrow);

    if (addressRef.current) {
      // @ts-ignore (us this comment if typescript raises an error)
      addressRef.current.value = "";
    }
  };

  return (
    <Flex direction="column" m={4}>
      <Heading size="md" mb={4}>
        Existing Contracts
      </Heading>
      <Grid gap={4} templateColumns="repeat(auto-fill, minmax(550px , 1fr))">
        <GridItem as={Card}>
          <CardHeader>
            <Heading size="md">Add Contract</Heading>
          </CardHeader>
          <CardBody as={Flex} direction="column" gap={4}>
            <InputGroup>
              <InputLeftAddon children="X" />
              <Input
                ref={addressRef}
                size="md"
                placeholder="Contract Address"
              />
            </InputGroup>

            <Button onClick={handleAddingContract}>Add Contract</Button>
          </CardBody>
        </GridItem>
        {escrows.map((escrow: IEscrow) => {
          return (
            <GridItem
              as={EscrowContractCard}
              key={escrow.escrowContract.address}
              {...escrow}
            />
          );
        })}
      </Grid>
    </Flex>
  );
};
