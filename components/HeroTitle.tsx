import { createStyles, Container, Text, Button, Group, Modal } from "@mantine/core";
import { useState } from "react";
import { AuthenticationForm } from "./AuthForm";

const BREAKPOINT = "@media (max-width: 755px)";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    boxSizing: "border-box",
  },

  inner: {
    position: "relative",
    paddingTop: 200,
    paddingBottom: 120,

    [BREAKPOINT]: {
      paddingBottom: 80,
      paddingTop: 80,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,

    [BREAKPOINT]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,

    [BREAKPOINT]: {
      fontSize: 18,
    },
  },

  controls: {
    marginTop: theme.spacing.xl * 2,

    [BREAKPOINT]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: 54,
    paddingLeft: 38,
    paddingRight: 38,

    [BREAKPOINT]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1,
    },
  },
}));

export function HeroTitle() {
  const { classes } = useStyles();
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <>
      <Modal style={{ padding: 0 }} opened={modalOpened} withCloseButton={false} onClose={() => setModalOpened(false)}>
        <AuthenticationForm />
      </Modal>
      <div className={classes.wrapper}>
        <Container size={750} className={classes.inner}>
          <h1 className={classes.title}>
            A{" "}
            <Text component='span' variant='gradient' gradient={{ from: "purple", to: "violet" }} inherit>
              simple and powerful
            </Text>{" "}
            loot tracker for World of Warcraft
          </h1>

          <Text className={classes.description} color='dimmed'>
            With a sleek and user-friendly interface, you can easily sort, categorize, and keep track of all your loot.
            See what dropped when and who it was rewarded to within a few clicks
          </Text>

          <Group className={classes.controls}>
            <Button
              size='xl'
              onClick={() => {
                setModalOpened(true);
              }}
              className={classes.control}
              variant='gradient'
              gradient={{ from: "purple", to: "violet" }}
            >
              Get started
            </Button>
          </Group>
        </Container>
      </div>
    </>
  );
}
