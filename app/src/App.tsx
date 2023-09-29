import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import deploy from "./deploy";
import Escrow, { IEscrow } from "./Escrow";

import { ReactComponent as EthIcon } from "./icons/eth-logo.svg";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/react";
import { getContract } from "./deploy";

const provider = new ethers.providers.Web3Provider((window as any).ethereum);

function App() {
  const [escrows, setEscrows] = useState<IEscrow[]>([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [loading, setLoading] = useState(false);

  const arbiterAddressRef = useRef<HTMLInputElement>(null);
  const beneficiaryAddressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = beneficiaryAddressRef.current?.value;
    const arbiter = arbiterAddressRef.current?.value;
    const amount = amountRef.current?.value;

    if (!beneficiary || !arbiter || !amount) return;

    const value = ethers.utils.parseEther(amount);

    setLoading(true);
    let escrowContract: ethers.Contract | undefined = undefined;
    try {
      escrowContract = await deploy(signer, arbiter, beneficiary, value);
    } catch (error) {
      console.log(error);
      alert((error as any).message);
      setLoading(false);
      return;
    }
    setLoading(false);

    if (!escrowContract) return;

    const escrow: IEscrow = {
      arbiter,
      beneficiary,
      value: amount.toString(),
      isApproved: false,
      escrowContract,
    };

    setEscrows((escrows) => [escrow, ...escrows]);
  }

  const handleDeployContract = async (e: any) => {
    e.preventDefault();

    await newContract();
  };

  const handleAddingContract = async (e: any) => {
    e.preventDefault();

    const contractAddress = addressRef.current?.value;
    if (!contractAddress) return;

    const escrowContract = await getContract(contractAddress, signer);
    const arbiter = await escrowContract.arbiter();
    const beneficiary = await escrowContract.beneficiary();
    const isApproved = await escrowContract.isApproved();
    const amount = await provider.getBalance(contractAddress);
    const value = ethers.utils.formatEther(amount);
    const escrow: IEscrow = {
      arbiter,
      beneficiary,
      value,
      isApproved,
      escrowContract,
    };

    if (addressRef.current) {
      // @ts-ignore (us this comment if typescript raises an error)
      addressRef.current.value = "";
    }
    setEscrows((escrows) => {
      const index = escrows.findIndex(
        (value) =>
          value.escrowContract.address === escrow.escrowContract.address
      );
      if (index >= 0) {
        return [
          escrow,
          ...escrows.slice(0, index),
          ...escrows.slice(index + 1, escrows.length - 1),
        ];
      }
      return [escrow, ...escrows];
    });
  };

  return (
    <>
      <Card m={4} margin="14px auto" maxWidth="560">
        <CardHeader>
          <Heading size="md">New Contract</Heading>
        </CardHeader>
        <CardBody as={Flex} direction="column" gap={4}>
          <InputGroup>
            <InputLeftAddon children="X" />
            <Input
              ref={arbiterAddressRef}
              size="md"
              placeholder="Arbiter Address"
            />
          </InputGroup>

          <InputGroup>
            <InputLeftAddon children="X" />
            <Input
              ref={beneficiaryAddressRef}
              size="md"
              placeholder="Beneficiary Address"
            />
          </InputGroup>

          <InputGroup>
            <InputLeftAddon children={<EthIcon height={24} />} />
            <Input
              ref={amountRef}
              type="number"
              size="md"
              placeholder="Amount"
            />
            <InputRightAddon children="ETH" />
          </InputGroup>

          <Button
            isLoading={loading}
            loadingText="Deploying"
            onClick={handleDeployContract}
          >
            Deploy
          </Button>
        </CardBody>
      </Card>
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
                as={Escrow}
                key={escrow.escrowContract.address}
                {...escrow}
              />
            );
          })}
        </Grid>
      </Flex>
    </>
  );
}

export default App;
