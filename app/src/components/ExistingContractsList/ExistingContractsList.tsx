import { FC } from "react";
import { ExistingContractsListProps } from ".";
import { Flex, Heading, Grid, GridItem } from "@chakra-ui/react";
import { AddContractCard } from "../AddContractCard";
import { EscrowsList } from "../EscrowsList";

export const ExistingContractsList: FC<ExistingContractsListProps> = () => {
  return (
    <Flex direction="column" m={4}>
      <Heading size="md" mb={4}>
        Existing Contracts
      </Heading>
      <Grid gap={4} templateColumns="repeat(auto-fill, minmax(550px , 1fr))">
        <GridItem as={AddContractCard} />

        <EscrowsList />
      </Grid>
    </Flex>
  );
};
