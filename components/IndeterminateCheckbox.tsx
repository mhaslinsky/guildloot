import { useListState, randomId } from "@mantine/hooks";
import { Checkbox } from "@mantine/core";
import { ChangeEventHandler, useEffect } from "react";
import { Table } from "@tanstack/react-table";

export function IndeterminateCheckbox(props: {
  onChange: () => ChangeEventHandler<HTMLInputElement> | undefined;
  indeterminate: boolean;
  checked: boolean;
  disabled?: boolean;
  table?: Table<any>;
}) {
  // console.log(props.table?.getSelectedRowModel().flatRows);

  return (
    <Checkbox
      disabled={props.disabled}
      checked={props.checked}
      indeterminate={props.indeterminate}
      transitionDuration={4}
      onChange={props.onChange()}
    />
  );
}
