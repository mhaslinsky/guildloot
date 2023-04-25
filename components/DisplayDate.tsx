import { lootItem } from "@prisma/client";
import { CellContext } from "@tanstack/react-table";
import { Text, Tooltip } from "@mantine/core";

export function DisplayDate(props: { date: CellContext<lootItem, Date | null> }) {
  if (!props.date.getValue()) return <Text>None</Text>;
  const date = new Date(props.date.getValue()!);

  const displayDate = new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);

  const displayTime = new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  if (props.date.row.original.source === "RC")
    return (
      <Tooltip label={displayTime}>
        <Text>{displayDate}</Text>
      </Tooltip>
    );
  else {
    return <Text>{displayDate}</Text>;
  }
}
