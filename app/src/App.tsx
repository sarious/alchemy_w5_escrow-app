import { DeployContractCard } from "./components/DeployContractCard";
import { ExistingContractsList } from "./components/ExistingContractsList";
import { EscrowListContextProvider } from "./providers/EscrowListProvider";

function App() {
  return (
    <EscrowListContextProvider>
      <DeployContractCard />

      <ExistingContractsList />
    </EscrowListContextProvider>
  );
}

export default App;
