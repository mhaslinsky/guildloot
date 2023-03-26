import { useColumnFiltersStore } from "../../utils/store/store";
import { Group, Text } from "@mantine/core";

export function ColumnFilterDisplay() {
  const [columnFiltersSub, setColumnFiltersSub] = useColumnFiltersStore((state) => [
    state.columnFilters,
    state.setColumnFilters,
  ]);

  const displayFilters = columnFiltersSub.map((filter) => (
    <Text
      onClick={() => {
        setColumnFiltersSub(columnFiltersSub.filter((f) => f.id !== filter.id));
      }}
      key={filter.id}
    >
      {filter.id}: {filter.value as string}
    </Text>
  ));

  return <Group>{displayFilters}</Group>;
}
