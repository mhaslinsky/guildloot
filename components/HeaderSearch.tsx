import { createStyles, Header, Autocomplete, Group, Burger, MediaQuery, Image, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons";
import { useNavBarStore } from "../utils/store/store";

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

  //   const items = links
  //     ? links.map((link) => (
  //         <a key={link.label} href={link.link} className={classes.link} onClick={(event) => event.preventDefault()}>
  //           {link.label}
  //         </a>
  //       ))
  //     : null;

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
            placeholder='Search'
            icon={<IconSearch size={16} stroke={1.5} />}
            data={["React", "Angular", "Vue", "Next.js", "Riot.js", "Svelte", "Blitz.js"]}
          />
        </Group>
      </div>
    </Header>
  );
}
