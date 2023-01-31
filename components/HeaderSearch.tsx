import { createStyles, Header, Autocomplete, Group, Burger, MediaQuery, Image, Flex, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useGlobalFilterStore, useNavBarStore, useAutoCompleteDataStore } from "../utils/store/store";
import { useEffect } from "react";
import { useDebouncedState } from "@mantine/hooks";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import GuildSelect from "./GuildSelect";

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
  const setGlobalFilter = useGlobalFilterStore((state) => state.setGlobalFilter);
  const autoCompleteData = useAutoCompleteDataStore((state) => state.autoCompleteData);
  const [value, setValue] = useDebouncedState("", 500);

  useEffect(() => {
    setGlobalFilter(value);
  }, [setGlobalFilter, value]);

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
          <GuildSelect />
          <Autocomplete
            transition='scale-y'
            transitionDuration={180}
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
