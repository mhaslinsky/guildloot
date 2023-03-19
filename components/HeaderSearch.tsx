import {
  createStyles,
  Header,
  Burger,
  MediaQuery,
  Flex,
  Title,
  Card,
  NavLink,
  Button,
  Group,
} from "@mantine/core";
import { useGuildStore, useNavBarStore, useThemeStore } from "../utils/store/store";
import GuildSelect from "./GuildSelect";
import Link from "next/link";
import theme from "../styles/theme";
import { useEffect, useState } from "react";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import { ColorSchemeSwitcher } from "./Buttons/ColorSchemeSwitcher";

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

  link: {
    "&:hover": {
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
      transition: "400ms",
    },
  },
}));

export function HeaderSearch() {
  const { classes } = useStyles();
  const isNavBarOpen = useNavBarStore((state) => state.isNavBarOpen);
  const toggle = useNavBarStore((state) => state.toggleNavBar);
  const { data: availableGuilds } = useGrabUserInfo();
  const [currentGuildID, setAvailableGuilds, setCurrentGuildName, setCurrentGuildID] = useGuildStore((state) => [
    state.currentGuildID,
    state.setAvailableGuilds,
    state.setCurrentGuildName,
    state.setCurrentGuildID,
  ]);
  const [toggleColorScheme] = useThemeStore((state) => [state.toggleColorScheme]);

  useEffect(() => {
    if (availableGuilds) {
      const guilds = availableGuilds.guildAdmin
        .map((guild) => ({ ...guild, role: "admin" }))
        .concat(availableGuilds.guildOfficer.map((guild) => ({ ...guild, role: "officer" })))
        .concat(availableGuilds.guildMember.map((guild) => ({ ...guild, role: "member" })));
      const guildsWithValues = guilds.map((guild) => {
        return {
          ...guild,
          value: guild.id,
          label: guild.name,
        };
      });
      setAvailableGuilds(guildsWithValues);
    }
  }, [setAvailableGuilds, availableGuilds]);

  useEffect(() => {
    const localstore = localStorage.getItem("currentGuild");
    if (localstore && !currentGuildID) {
      const lastUseData = JSON.parse(localstore);
      setCurrentGuildID(lastUseData.id);
      setCurrentGuildName(lastUseData.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Header pl={0} height={56} className={classes.header} mb={120}>
      <div className={classes.inner}>
        <Flex p='none' align='center'>
          <MediaQuery largerThan='sm' styles={{ display: "none" }}>
            <Burger pl={theme.spacing.md} opened={isNavBarOpen} onClick={toggle} size='sm' mr='xl' />
          </MediaQuery>
          <MediaQuery smallerThan='sm' styles={{ display: "none" }}>
            <Link style={{ textDecoration: "none" }} href='/'>
              <Card w={300}>
                <Flex justify='center'>
                  <Title
                    className={classes.link}
                    underline={false}
                    sx={{ fontFamily: "transducer, sans-serif", whiteSpace: "nowrap" }}
                    order={3}
                  >
                    Archon Loot Tracker
                  </Title>
                </Flex>
              </Card>
            </Link>
          </MediaQuery>
        </Flex>
        <Flex w='100%' justify='space-between'>
          <div />
          <Group>
            <ColorSchemeSwitcher />
            <GuildSelect />
          </Group>
        </Flex>
      </div>
    </Header>
  );
}
