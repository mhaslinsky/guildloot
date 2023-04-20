// /* eslint-disable */
import { Card, TextInput, Box, Group, Autocomplete, Button, Flex, Select, createStyles } from "@mantine/core";
import { lootItem } from "@prisma/client";
import { Table } from "@tanstack/react-table";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useEditLoot } from "../utils/hooks/mutations/useEditLoot";

export type formValues = {
  player: string | undefined;
  instance: string | undefined;
  size: string | undefined;
  boss: string | undefined;
  reason: string | undefined;
};

const useStyles = createStyles((theme) => ({
  error: {
    position: "absolute",
  },
  wrapper: {
    positon: "relative",
  },
  root: {
    position: "relative",
  },
  invalid: {
    border: "solid blue",
  },
}));

export function EditForm(props: { table: Table<lootItem> }) {
  const [massEditMode, setMassEditMode] = useState<boolean>();
  const { mutate: editLoot } = useEditLoot();
  const { classes } = useStyles();

  const getValuesForId = useCallback(
    (id: string) => {
      return Array.from(
        Array.from(
          props.table
            .getAllFlatColumns()
            .find((c) => c.id === id)!
            .getFacetedUniqueValues()
            .keys()
        ).sort()
      );
    },
    [props.table]
  );

  const playerValues = useMemo(() => getValuesForId("Player"), [getValuesForId]);
  const instanceValues = useMemo(() => getValuesForId("Instance"), [getValuesForId]);
  const bossValues = useMemo(() => getValuesForId("Boss"), [getValuesForId]);
  const reasonValues = useMemo(() => getValuesForId("Reason"), [getValuesForId]);
  const sizeValues = ["10", "25"];

  const schema = z.object({
    player: z
      .string()
      .min(2, { message: "Must be over 2 characters" })
      .max(12, { message: "Must be under 12 characters" })
      .optional()
      .or(z.literal("")),
    reason: z
      .string()
      .min(2, { message: "Must be over 2 characters" })
      .max(24, { message: "Must be under 24 characters" })
      .optional()
      .or(z.literal("")),
    boss: z
      .string()
      .min(2, { message: "Must be over 2 characters" })
      .max(24, { message: "Must be under 24 characters" })
      .optional()
      .or(z.literal("")),
    instance: z
      .string()
      .min(2, { message: "Must be over 2 characters" })
      .max(24, { message: "Must be under 24 characters" })
      .optional()
      .or(z.literal("")),
    size: z.enum(["10", "25"]).optional().or(z.literal("")),
  });

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      player: "",
      instance: "",
      size: "",
      boss: "",
      reason: "",
    },
  });

  useEffect(() => {
    if (props.table?.getSelectedRowModel().flatRows.length > 1) {
      setMassEditMode(true);
      form.setValues({
        boss: undefined,
        instance: undefined,
        player: undefined,
        reason: undefined,
        size: undefined,
      });
    } else {
      form.setValues({
        boss: props.table.getSelectedRowModel().flatRows[0]?.original.boss || undefined,
        instance: props.table.getSelectedRowModel().flatRows[0]?.original.instance || undefined,
        player: props.table.getSelectedRowModel().flatRows[0]?.original.player || undefined,
        reason: props.table.getSelectedRowModel().flatRows[0]?.original.response || undefined,
        size:
          props.table.getSelectedRowModel().flatRows[0]?.original.raidSize == "TWENTY_FIVE"
            ? "25"
            : "10" || undefined,
      });
      setMassEditMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.table.getSelectedRowModel().flatRows]);

  return (
    <Box mx={16} h='100%'>
      <form
        style={{ height: "100%" }}
        onSubmit={form.onSubmit(
          (values, _event) => {
            const rows = props.table?.getSelectedRowModel().flatRows.map((r) => r.original);
            editLoot({ lootRows: rows, values });
          }
          // (validationErrors, _values, _event) => {
          //   console.log(validationErrors, _values, _event);
          // }
        )}
      >
        <Flex h='100%' justify='space-between' align='center' pb={2}>
          <Group>
            <Autocomplete
              classNames={{
                wrapper: classes.wrapper,
                error: classes.error,
                root: classes.root,
              }}
              placeholder='Player'
              data={playerValues}
              {...form.getInputProps("player")}
            />
            <Autocomplete
              classNames={{
                wrapper: classes.wrapper,
                error: classes.error,
              }}
              variant='default'
              placeholder='Reason'
              data={reasonValues}
              {...form.getInputProps("reason")}
            />
            <Autocomplete
              classNames={{
                wrapper: classes.wrapper,
                error: classes.error,
              }}
              placeholder='Boss'
              data={bossValues}
              {...form.getInputProps("boss")}
            />
            <Autocomplete
              classNames={{
                wrapper: classes.wrapper,
                error: classes.error,
              }}
              placeholder='Instance'
              data={instanceValues}
              {...form.getInputProps("instance")}
            />
            <Select placeholder='Size' data={sizeValues} {...form.getInputProps("size")} />
          </Group>
          <Group>
            {props.table?.getSelectedRowModel().flatRows.length > 1 ? (
              <>
                <Button type='submit'>
                  Mass Edit ({`${props.table?.getSelectedRowModel().flatRows.length}`})
                </Button>
                <Button variant='subtle' color='red.7'>
                  Delete All
                </Button>
              </>
            ) : (
              <>
                <Button type='submit'>Edit</Button>
                <Button variant='subtle' color='red.7'>
                  Delete
                </Button>
              </>
            )}
          </Group>
        </Flex>
      </form>
    </Box>
  );
}
