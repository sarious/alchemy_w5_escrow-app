import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { IEscrow } from "../components/EscrowContractCard";

interface IEscrowListActions {
  addEscrow: (escrow: IEscrow) => void;
  removeEscrow: (contractAddress: string) => void;
}

const EscrowListContext = createContext([] as IEscrow[]);
const EscrowListActionContext = createContext({} as IEscrowListActions);

export function EscrowListContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [escrowsList, setEscrowsList] = useState<IEscrow[]>([]);

  const addEscrow = (escrow: IEscrow) => {
    setEscrowsList((escrows: IEscrow[]) => {
      const index = escrows.findIndex(
        (value) =>
          value.escrowContract.address === escrow.escrowContract.address
      );
      if (index >= 0) {
        return [
          escrow,
          ...escrows.slice(0, index),
          ...escrows.slice(index + 1, escrows.length),
        ];
      }
      return [escrow, ...escrows];
    });
  };

  const removeEscrow = (contractAddress: string) => {
    setEscrowsList((escrows: IEscrow[]) => {
      const index = escrows.findIndex(
        (value) => value.escrowContract.address === contractAddress
      );

      if (index >= 0) {
        return [
          ...escrows.slice(0, index),
          ...escrows.slice(index + 1, escrows.length),
        ];
      }

      return escrows;
    });
  };

  const actions = useMemo(() => {
    return {
      addEscrow,
      removeEscrow,
    } as IEscrowListActions;
  }, []);

  return (
    <EscrowListActionContext.Provider value={actions}>
      <EscrowListContext.Provider value={escrowsList}>
        {children}
      </EscrowListContext.Provider>
    </EscrowListActionContext.Provider>
  );
}

export const useEscrowListContext = () => useContext(EscrowListContext);
export const useEscrowActionsContext = () =>
  useContext(EscrowListActionContext);
