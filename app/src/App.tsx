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

const provider = new ethers.providers.Web3Provider((window as any).ethereum);

function App() {
  const [escrows, setEscrows] = useState<IEscrow[]>([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [loading, setLoading] = useState(false);

  const arbiterAddressRef = useRef<HTMLInputElement>(null);
  const beneficiaryAddressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

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

    const escrow: IEscrow = {
      arbiter,
      beneficiary,
      value: amount.toString(),
      escrowContract,
    };
    setLoading(false);

    setEscrows([...escrows, escrow]);
  }

  const handleDeployContract = async (e: any) => {
    e.preventDefault();

    await newContract();
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

          <Button isLoading={loading} onClick={handleDeployContract}>
            Deploy
          </Button>
        </CardBody>
      </Card>
      <Flex direction="column" m={4}>
        <Heading size="md" mb={4}>
          Existing Contracts
        </Heading>
        <Grid gap={4} templateColumns="repeat(auto-fill, minmax(550px , 1fr))">
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
