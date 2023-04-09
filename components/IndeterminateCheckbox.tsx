import { useListState, randomId } from "@mantine/hooks";
import { Checkbox } from "@mantine/core";
import { ChangeEventHandler, useEffect } from "react";

export function IndeterminateCheckbox(props: {
  onChange: () => ChangeEventHandler<HTMLInputElement> | undefined;
  indeterminate: boolean;
  checked: boolean;
  disabled?: boolean;
}) {
  //   useEffect(() => {
  //     console.log(props.checked, props.indeterminate, props.disabled);
  //   }, [props]);

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
