import { Card, Text, Group, Button, Tooltip, Flex } from "@mantine/core";
import { useNumTablesStore } from "../../utils/store/store";
import theme from "../../styles/theme";

export default function NumofTableSelector() {
  const [numTables, incrementNumTables, decrementNumTables] = useNumTablesStore((state) => [
    state.numTables,
    state.incrementNumTables,
    state.decrementNumTables,
  ]);

  return (
    <Card p={0}>
      <Flex gap={theme.spacing.md} align='center' dir='row'>
        <Button
          variant={numTables == 1 ? "light" : "filled"}
          size='xs'
          onClick={() => {
            if (numTables > 1) decrementNumTables();
          }}
        >
          -
        </Button>
        <Text weight='bolder'>{numTables}</Text>
        <Tooltip openDelay={1000} label={"No more than 3 tables at once"}>
          <Button
            variant={numTables == 3 ? "light" : "filled"}
            size='xs'
            onClick={() => {
              if (numTables < 3) incrementNumTables();
            }}
          >
            +
          </Button>
        </Tooltip>
      </Flex>
    </Card>
  );
}
