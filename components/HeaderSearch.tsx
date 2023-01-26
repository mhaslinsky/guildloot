import { createStyles, Header, Autocomplete, Group, Burger, MediaQuery, Image, Flex, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useGlobalFilterStore, useNavBarStore } from "../utils/store/store";
import { useGrabLoot } from "../utils/hooks/useGrabLoot";
import { forwardRef, useEffect, useState } from "react";
import { useDebouncedState } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  inner: {
    height: 56,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}));

interface HeaderSearchProps {
  links?: { link: string; label: string }[];
}

export function HeaderSearch({ links }: HeaderSearchProps) {
  const { classes } = useStyles();
  const isNavBarOpen = useNavBarStore((state) => state.isNavBarOpen);
  const toggle = useNavBarStore((state) => state.toggleNavBar);
  const { data } = useGrabLoot();
  const [autoCompleteData, setAutoCompleteData] = useState<any>([]);
  const setGlobalFilter = useGlobalFilterStore((state) => state.setGlobalFilter);
  const [value, setValue] = useDebouncedState("", 500);

  useEffect(() => {
    setGlobalFilter(value);
  }, [setGlobalFilter, value]);

  useEffect(() => {
    // if (!data) return;
    // const newData = data.map((item) => {
    //   return { key: item.id, value: item.player, label: item.response, item: item.itemName };
    // });
    // console.log(newData);
    // setAutoCompleteData(newData);
  }, [data]);

  const AutoCompleteItem = (props: any) => (
    <div>
      <Group noWrap>
        <div>
          <Text>{props.value}</Text>
          <Text size='xs' color='dimmed'>
            {props.item}
          </Text>
          <Text size='xs' color='dimmed'>
            {props.label}
          </Text>
        </div>
      </Group>
    </div>
  );

  return (
    <Header height={56} className={classes.header} mb={120}>
      <div className={classes.inner}>
        <Flex w={275} p='none' align='center'>
          <MediaQuery largerThan='sm' styles={{ display: "none" }}>
            <Burger opened={isNavBarOpen} onClick={toggle} size='sm' mr='xl' />
          </MediaQuery>
          <MediaQuery smallerThan='sm' styles={{ display: "none" }}>
            <Image pt='md' withPlaceholder src={null} alt='placeholder logo' />
          </MediaQuery>
        </Flex>
        <Group>
          <Autocomplete
            itemComponent={AutoCompleteItem}
            placeholder='Search'
            icon={<IconSearch size={16} stroke={1.5} />}
            data={autoCompleteData}
            onChange={(value) => setValue(value)}
          />
        </Group>
      </div>
    </Header>
  );
}
