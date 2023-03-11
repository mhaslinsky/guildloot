import { createStyles, Avatar, Text, Flex, Card } from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import { signOut } from "next-auth/react";
import { useGuildStore } from "../utils/store/store";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    icon: {
      color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5],
    },

    name: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
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
  phone?: string;
  email?: string;
}

export function UserBadge({ avatar, guild, username, phone, email }: UserInfoIconsProps) {
  const { classes } = useStyles();
  const currentGuildName = useGuildStore((state) => state.currentGuildName);

  return (
    <Card p={10}>
      <Flex
        sx={(theme) => ({
          position: "relative",
          overflow: "hidden",
        })}
        justify='space-between'
        align='center'
      >
        <div>
          <Text size='xs' sx={{ textTransform: "uppercase" }} weight={650} color='dimmed'>
            {currentGuildName ? `<${currentGuildName}>` : null}
          </Text>

          <Text size='lg' weight={500} className={classes.name}>
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
            <span>Logout</span>
          </a>
        </div>

        <Avatar size={70} alt='avatar' style={{ borderRadius: "5px" }} src={avatar} />
      </Flex>
    </Card>
  );
}
