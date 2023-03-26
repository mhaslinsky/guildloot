import { useEffect, useState } from "react";
import {
  createStyles,
  Navbar,
  Group,
  MediaQuery,
  Modal,
  Card,
  Flex,
  UnstyledButton,
  Stack,
  Title,
  ScrollArea,
  Text,
} from "@mantine/core";
import { IconLogout, IconBallpen, IconPlus, IconSubtask, IconListSearch } from "@tabler/icons";
import { useNavBarStore, guildModalStore, useGuildStore } from "../../utils/store/store";
import { useSession } from "next-auth/react";
import { UserBadge } from "../UserBadge";
import { AuthenticationForm } from "../AuthForm";
import Link from "next/link";
import { GuildCreateForm } from "../GuildCreateForm";
import { useRouter } from "next/router";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.lg}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
        [`& .${icon}`]: {
          color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
        },
      },
    },
  };
});

export function NavbarSimple() {
  const [avalinks, setAvaLinks] = useState<any[]>([]);
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("none");
  const [modalOpened, setModalOpened] = useState(false);
  const [isNavBarOpen, toggleNavBar, setNavBar] = useNavBarStore((state) => [
    state.isNavBarOpen,
    state.toggleNavBar,
    state.setNavBar,
  ]);
  const { data: session } = useSession();
  const router = useRouter();
  const [createGuildModalOpen, setCreateGuildModalOpened] = guildModalStore((state) => [
    state.createGuildModalOpen,
    state.setCreateGuildModalOpen,
  ]);
  const [roleInCurrentGuild] = useGuildStore((state) => [state.roleinCurrentGuild]);

  useEffect(() => {
    if (roleInCurrentGuild == "admin" || roleInCurrentGuild == "officer") {
      setAvaLinks([
        { link: "/manage", label: "Guild Management", icon: IconSubtask },
        { link: "/directory", label: "Browse Guilds", icon: IconListSearch },
        { link: "/log", label: "Log Drops", icon: IconBallpen },
      ]);
    } else if (roleInCurrentGuild == "member") {
      setAvaLinks([
        { link: "/manage", label: "Guild Management", icon: IconSubtask },
        { link: "/directory", label: "Browse Guilds", icon: IconListSearch },
      ]);
    } else {
      setAvaLinks([{ link: "/directory", label: "Browse Guilds", icon: IconListSearch }]);
    }
  }, [roleInCurrentGuild]);

  useEffect(() => {
    if (router.pathname === "/") {
      setActive("none");
    }
  }, [router]);

  const links = avalinks.map((item) => (
    <Link
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      href={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <>
      <Modal
        style={{ padding: 0 }}
        opened={modalOpened}
        withCloseButton={false}
        onClose={() => setModalOpened(false)}
      >
        <AuthenticationForm />
      </Modal>
      <Modal
        style={{ padding: 0 }}
        opened={createGuildModalOpen}
        withCloseButton={false}
        onClose={() => setCreateGuildModalOpened(false)}
      >
        <GuildCreateForm />
      </Modal>
      <Navbar
        styles={(theme) => ({
          root: {
            height: "calc(100svh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))",
          },
        })}
        hidden={!isNavBarOpen}
        width={{ sm: 300 }}
        p='md'
      >
        <Flex
          sx={{
            flexDirection: "column",
            flex: "1",
          }}
        >
          <MediaQuery largerThan='sm' styles={{ display: "none" }}>
            <Group className={classes.header} position='center'>
              <Link onClick={() => {}} style={{ textDecoration: "none", width: "100%" }} href='/'>
                <Card w='100%'>
                  <Flex justify='center'>
                    <Title
                      sx={{ fontFamily: "transducer, sans-serif", whiteSpace: "nowrap", textDecoration: "none" }}
                      order={3}
                    >
                      Archon Loot Tracker
                    </Title>
                  </Flex>
                </Card>
              </Link>
            </Group>
          </MediaQuery>
          {session && (
            <Stack h='100%' justify='space-between'>
              <Stack>{links}</Stack>
              <UnstyledButton
                w='100%'
                className={classes.link}
                onClick={() => {
                  setCreateGuildModalOpened(true);
                }}
              >
                <Group spacing='sm'>
                  <IconPlus />
                  Create New Guild
                </Group>
              </UnstyledButton>
            </Stack>
          )}
        </Flex>
        <Navbar.Section className={classes.footer}>
          {!session && (
            <a href='#' className={classes.link} onClick={() => setModalOpened(true)}>
              <IconLogout className={classes.linkIcon} stroke={1.5} />
              <span>Login</span>
            </a>
          )}
          {session && (
            <>
              <UserBadge avatar={session.user!.image!} username={session.user!.name!} />
            </>
          )}
        </Navbar.Section>
      </Navbar>
    </>
  );
}
