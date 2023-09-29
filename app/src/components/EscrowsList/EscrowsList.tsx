import { FC } from "react";
import { EscrowsListProps } from ".";
import { GridItem } from "@chakra-ui/react";
import { useEscrowListContext } from "../../providers/EscrowListProvider";
import { IEscrow, EscrowContractCard } from "../EscrowContractCard";

export const EscrowsList: FC<EscrowsListProps> = () => {
  const escrows = useEscrowListContext();

  return (
    <>
      {escrows.map((escrow: IEscrow) => {
        return (
          <GridItem
            as={EscrowContractCard}
            key={escrow.escrowContract.address}
            {...escrow}
          />
        );
      })}
    </>
  );
};
