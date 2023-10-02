import { FC, useRef, useState } from "react";
import { DeployContractCardProps } from ".";
import { ethers } from "ethers";
import deployEscrowContract from "../../contractApi/Escrow/deploy";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/react";
import { ReactComponent as EthIcon } from "../../icons/eth-logo.svg";
import { getWalletSigner } from "../../providers/getSigner";
import { IEscrow } from "../EscrowContractCard";
import { useEscrowActionsContext } from "../../providers/EscrowListProvider";
import { useOperationHandling } from "../../hooks/useOperationHandling";

const deployContract = async (
  arbiter: string,
  beneficiary: string,
  value: ethers.BigNumber
) => {
  const signer = await getWalletSigner();
  return deployEscrowContract(signer, arbiter, beneficiary, value);
};

export const DeployContractCard: FC<DeployContractCardProps> = (props) => {
  const { addEscrow } = useEscrowActionsContext();

  const { loading, invoke } = useOperationHandling(
    deployContract,
    "Error while deploying contract."
  );

  const arbiterAddressRef = useRef<HTMLInputElement>(null);
  const beneficiaryAddressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  async function newContract() {
    const arbiter = arbiterAddressRef.current?.value;
    const beneficiary = beneficiaryAddressRef.current?.value;
    const amount = amountRef.current?.value;

    if (!beneficiary || !arbiter || !amount) return;

    const value = ethers.utils.parseEther(amount);
    const escrowContract = await invoke(arbiter, beneficiary, value);
    if (!escrowContract) return;

    const escrow: IEscrow = {
      arbiter,
      beneficiary,
      value: amount.toString(),
      isApproved: false,
      escrowContract,
    };

    addEscrow(escrow);
  }

  const handleDeployContract = async (e: any) => {
    e.preventDefault();

    await newContract();
  };

  return (
    <Card m={4} margin="14px auto" maxWidth="560">
      <CardHeader>
        <Heading size="md">New Contract</Heading>
      </CardHeader>
      <CardBody as={Flex} direction="column" gap={4}>
        <InputGroup>
          <Input
            ref={arbiterAddressRef}
            size="md"
            placeholder="Arbiter Address"
          />
        </InputGroup>
        <InputGroup>
          <Input
            ref={beneficiaryAddressRef}
            size="md"
            placeholder="Beneficiary Address"
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon children={<EthIcon height={24} />} />
          <Input ref={amountRef} type="number" size="md" placeholder="Amount" />
          <InputRightAddon children="ETH" />
        </InputGroup>
        <Button
          type="submit"
          isLoading={loading}
          loadingText="Deploying"
          onClick={handleDeployContract}
        >
          Deploy
        </Button>
      </CardBody>
    </Card>
  );
};
