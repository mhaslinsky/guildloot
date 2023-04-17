import { Card, TextInput, Box, Group, Autocomplete, Button, Flex } from "@mantine/core";
import { lootItem } from "@prisma/client";
import { Table } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import theme from "../styles/theme";

export function EditForm(props: { table: Table<lootItem> }) {
  const [massEditMode, setMassEditMode] = useState<boolean>();
  const [playerValue, setPlayerValue] = useState<string>();
  const [instanceValue, setInstanceValue] = useState<string | undefined>();
  const [bossValue, setBossValue] = useState<string | undefined>();
  const [reasonValue, setReasonValue] = useState<string | undefined>();

  const playerValues = useMemo(
    () =>
      Array.from(
        props.table
          .getAllFlatColumns()
          .find((c) => c.id === "Player")!
          .getFacetedUniqueValues()
          .keys()
      ).sort(),
    [props.table]
  );

  const instanceValues = useMemo(
    () =>
      Array.from(
        props.table
          .getAllFlatColumns()
          .find((c) => c.id === "Instance")!
          .getFacetedUniqueValues()
          .keys()
      ).sort(),
    [props.table]
  );

  const bossValues = useMemo(
    () =>
      Array.from(
        props.table
          .getAllFlatColumns()
          .find((c) => c.id === "Boss")!
          .getFacetedUniqueValues()
          .keys()
      ).sort(),
    [props.table]
  );

  const reasonValues = useMemo(
    () =>
      Array.from(
        props.table
          .getAllFlatColumns()
          .find((c) => c.id === "Reason")!
          .getFacetedUniqueValues()
          .keys()
      ).sort(),
    [props.table]
  );

  const schema = z.object({
    player: z.string().min(1, { message: "Select a Player" }),
    reason: z
      .string()
      .min(2, { message: "Must be over 2 characters" })
      .max(24, { message: "Must be under 24 characters" }),
    boss: z.string().min(1, { message: "Select a Realm" }),
    instance: z.string().min(1, { message: "Select a Realm" }),
  });

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      player: "",
      instance: "",
      boss: "",
      reason: "",
    },
  });

  useEffect(() => {
    if (props.table?.getSelectedRowModel().flatRows.length > 1) {
      setMassEditMode(true);
      setPlayerValue(undefined);
      setInstanceValue(undefined);
      setBossValue(undefined);
      setReasonValue(undefined);
    } else {
      setMassEditMode(false);
      setPlayerValue(props.table.getSelectedRowModel().flatRows[0]?.original.player || undefined);
      setInstanceValue(props.table.getSelectedRowModel().flatRows[0]?.original.instance || undefined);
      setBossValue(props.table.getSelectedRowModel().flatRows[0]?.original.boss || undefined);
      setReasonValue(props.table.getSelectedRowModel().flatRows[0]?.original.response || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.table.getSelectedRowModel().flatRows]);

  if (props.table?.getSelectedRowModel().flatRows.length > 1) {
    console.log("multiple items selected");
  } else if (props.table?.getSelectedRowModel().flatRows.length === 0) {
    console.log("no items selected");
  } else {
    console.log("single item selected");
    console.log(props.table.getSelectedRowModel().flatRows[0].original);
  }
  return (
    <Box mx={16} h='100%'>
      {props.table?.getSelectedRowModel().flatRows.length > 1 ? (
        <Flex h='100%' justify='space-between' align='center'>
          <Group>
            <Autocomplete placeholder='Player' value={playerValue} onChange={setPlayerValue} data={playerValues} />
            <Autocomplete placeholder='Reason' value={reasonValue} onChange={setReasonValue} data={reasonValues} />
            <Autocomplete placeholder='Boss' value={bossValue} onChange={setBossValue} data={bossValues} />
            <Autocomplete
              placeholder='Instance'
              value={instanceValue}
              onChange={setInstanceValue}
              data={instanceValues}
            />
          </Group>
          <Group>
            <Button>Mass Edit ({`${props.table?.getSelectedRowModel().flatRows.length}`})</Button>
            <Button variant='subtle' color='red.7'>
              Delete All
            </Button>
          </Group>
        </Flex>
      ) : (
        <Flex h='100%' justify='space-between' align='center'>
          <Group>
            <Autocomplete placeholder='Player' value={playerValue} onChange={setPlayerValue} data={playerValues} />
            <Autocomplete placeholder='Reason' value={reasonValue} onChange={setReasonValue} data={reasonValues} />
            <Autocomplete placeholder='Boss' value={bossValue} onChange={setBossValue} data={bossValues} />
            <Autocomplete
              placeholder='Instance'
              value={instanceValue}
              onChange={setInstanceValue}
              data={instanceValues}
            />
          </Group>
          <Group>
            <Button>Edit</Button>
            <Button variant='subtle' color='red.7'>
              Delete
            </Button>
          </Group>
        </Flex>
      )}
    </Box>
  );
}
