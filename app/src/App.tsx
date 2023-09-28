import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import deploy from "./deploy";
import Escrow, { IEscrow } from "./Escrow";
import {
  Button,
  Card,
  Col,
  Input,
  InputRef,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons/lib/icons";
// export { ReactComponent as EthIcon } from "../public/eth-logo.svg";
import { ReactComponent as EthIcon } from "./icons/eth-logo.svg";
import styles from "./App.module.css";

const provider = new ethers.providers.Web3Provider((window as any).ethereum);

function App() {
  const [escrows, setEscrows] = useState<IEscrow[]>([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [loading, setLoading] = useState(false);

  const arbiterAddressRef = useRef<InputRef>(null);
  const beneficiaryAddressRef = useRef<InputRef>(null);
  const amountRef = useRef<InputRef>(null);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = beneficiaryAddressRef.current?.input?.value;
    const arbiter = arbiterAddressRef.current?.input?.value;
    const amount = amountRef.current?.input?.value;

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
      {/* <Row gutter={24} style={{ margin: 16 }}>
       <Col span={12}> */}
      <Card title="New Contract" className={styles.deployContractCard}>
        <Input
          pattern="^0[xX][0-9a-fA-f]+$"
          ref={arbiterAddressRef}
          size="large"
          placeholder="Arbiter Address"
          prefix={<UserOutlined />}
        />
        <br />
        <br />
        <Input
          ref={beneficiaryAddressRef}
          size="large"
          placeholder="Beneficiary Address"
          prefix={<UserOutlined />}
        />
        <br />
        <br />

        <Input
          ref={amountRef}
          size="large"
          placeholder="Amount"
          prefix={<EthIcon height={24} />}
          suffix="ETH"
        />
        <br />
        <br />

        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleDeployContract}
        >
          Deploy
        </Button>
      </Card>
      {/* </Col>
       <Col span={12}> */}
      <Space direction="vertical">
        <Typography.Title level={5}>Existing Contracts</Typography.Title>
        <Space size="large" align="center" wrap>
          {escrows.map((escrow: IEscrow) => {
            return (
              <Escrow
                className={styles.escrowCard}
                key={escrow.escrowContract.address}
                {...escrow}
              />
            );
          })}
        </Space>
      </Space>
      {/* </Col>
    </Row> */}
    </>
  );
}

export default App;
