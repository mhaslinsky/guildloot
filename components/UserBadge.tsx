import { createStyles, Avatar, Text, Flex, Card } from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import { signOut } from "next-auth/react";
import { useGuildStore, useThemeStore } from "../utils/store/store";
import router from "next/router";
import { useEffect } from "react";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    icon: {
      color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5],
    },

    name: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      "&:hover": {
        cursor: "pointer",
      },
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
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
    },

    avatar: {
      borderRadius: theme.radius.sm,
    },
  };
});

interface UserInfoIconsProps {
  avatar: string;
  username: string;
  guild?: string;
  email?: string;
}

export function UserBadge({ avatar, guild, username, email }: UserInfoIconsProps) {
  const { classes } = useStyles();
  const currentGuildName = useGuildStore((state) => state.currentGuildName);
  const [setPrimaryColor] = useThemeStore((state) => [state.setPrimaryColor]);

  useEffect(() => {
    const color = localStorage.getItem("accentColor");
    if (color) {
      setPrimaryColor(color);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      sx={(theme) => ({
        backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
      })}
      p={10}
    >
      <Flex
        sx={(theme) => ({
          position: "relative",
          overflow: "hidden",
        })}
        justify='space-between'
        align='center'
      >
        <div>
          <Text size='xs' sx={{ textTransform: "uppercase" }} weight={650}>
            {currentGuildName ? `<${currentGuildName}>` : null}
          </Text>
          <Text
            size='lg'
            weight={500}
            onClick={() => {
              router.push("/profile");
            }}
            className={classes.name}
          >
            {username}
          </Text>
          <a
            href='#'
            className={classes.link}
            onClick={() => {
              localStorage.removeItem("currentGuild");
              signOut();
            }}
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <Text>Logout</Text>
          </a>
        </div>

        <Avatar size={70} alt='avatar' style={{ borderRadius: "5px" }} src={avatar} />
      </Flex>
    </Card>
  );
}
