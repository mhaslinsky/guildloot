import { useState } from "react";
import { createStyles, Navbar, Group, Image, MediaQuery, Modal } from "@mantine/core";
import { IconBellRinging, IconLogout } from "@tabler/icons";
import { useNavBarStore } from "../utils/store/store";
import { signIn, useSession } from "next-auth/react";
import { UserBadge } from "./UserBadge";
import { AuthenticationForm } from "./AuthForm";

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
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
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

const data = [{ link: "", label: "Notifications", icon: IconBellRinging }];

export function NavbarSimple() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Billing");
  const [modalOpened, setModalOpened] = useState(false);
  const isNavBarOpen = useNavBarStore((state) => state.isNavBarOpen);
  const { data: session, status } = useSession();

  const links = data.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <>
      <Modal style={{ padding: 0 }} opened={modalOpened} withCloseButton={false} onClose={() => setModalOpened(false)}>
        <AuthenticationForm />
      </Modal>
      <Navbar hidden={!isNavBarOpen} width={{ sm: 300 }} p='md'>
        <Navbar.Section grow>
          <MediaQuery largerThan='sm' styles={{ display: "none" }}>
            <Group className={classes.header} position='apart'>
              <Image
                styles={(theme) => ({
                  root: { paddingTop: "0rem" },
                })}
                withPlaceholder
                src={null}
                alt='placeholder logo'
              />
            </Group>
          </MediaQuery>
          {links}
        </Navbar.Section>
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
