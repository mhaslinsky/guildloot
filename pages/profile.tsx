import { NextPage } from "next";
import { z } from "zod";
import {
  Card,
  createStyles,
  ColorPicker,
  Stack,
  Avatar,
  Title,
  Modal,
  TextInput,
  Button,
  Group,
  Flex,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useGrabUserInfo } from "../utils/hooks/queries/useUserInfo";
import { useResizeObserver } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "../utils/store/store";
import { useUpdateUserProfile } from "../utils/hooks/mutations/useUpdateUserProfile";

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: "60%",
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
  root: {
    width: "60%",
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
  input: {
    fontWeight: 600,
  },
  avaRoot: {
    width: "16rem",
    height: "16rem",
    "&:hover": {
      cursor: "pointer",
    },
    [theme.fn.smallerThan("sm")]: {
      width: "8rem",
      height: "8rem",
    },
  },
}));

const Profile: NextPage = () => {
  const { theme } = useStyles();
  const [opened, setOpened] = useState(false);
  const { mutate: updateProfile } = useUpdateUserProfile();
  const { data } = useGrabUserInfo();
  const { classes } = useStyles();
  const [colorValue, setColorValue] = useState("");
  const [username, setUsername] = useState(data?.name);
  const [ref, rect] = useResizeObserver();
  const nameRef = useRef<HTMLInputElement>(null);

  const imageSchema = z.object({
    imageValue: z.string().url({ message: "Please enter a valid URL." }),
  });

  const form = useForm({
    initialValues: { imageValue: data?.image },
    validate: zodResolver(imageSchema),
  });

  const [setPrimaryColor] = useThemeStore((state) => [state.setPrimaryColor]);

  useEffect(() => {
    if (colorValue == "") return;
    switch (colorValue) {
      case "#1A1B1E" || "dark":
        setPrimaryColor("dark");
        break;
      case "#495057" || "gray":
        setPrimaryColor("gray");
        break;
      case "#F03E3E" || "red":
        setPrimaryColor("red");
        break;
      case "#D6336C" || "pink":
        setPrimaryColor("pink");
        break;
      case "#AE3EC9" || "grape":
        setPrimaryColor("grape");
        break;
      case "#7048E8" || "violet":
        setPrimaryColor("violet");
        break;
      case "#4263EB" || "indigo":
        setPrimaryColor("indigo");
        break;
      case "#1C7ED6" || "blue":
        setPrimaryColor("blue");
        break;
      case "#1098AD" || "cyan":
        setPrimaryColor("cyan");
        break;
      case "#0CA678" || "teal":
        setPrimaryColor("teal");
        break;
      case "#37B24D" || "green":
        setPrimaryColor("green");
        break;
      case "#74B816" || "lime":
        setPrimaryColor("lime");
        break;
      case "#F59F00" || "yellow":
        setPrimaryColor("yellow");
        break;
      case "#F76707" || "orange":
        setPrimaryColor("orange");
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorValue]);

  return (
    <>
      <Modal size='lg' withCloseButton={false} opened={opened} onClose={() => setOpened(false)}>
        <form
          onSubmit={form.onSubmit((values) => {
            updateProfile({ propToChange: "image", value: values.imageValue });
            setOpened(false);
          })}
        >
          <Flex gap={2} w='100%' justify='space-between'>
            <TextInput
              w='100%'
              {...form.getInputProps("imageValue")}
              placeholder='https://i.imgur.com/5uD4VGu.jpeg'
            />
            <Button type='submit'>Submit</Button>
          </Flex>
        </form>
      </Modal>
      <Card ref={ref} h='100%' w='100%'>
        <Stack align='center' h='100%'>
          <Title color={theme.fn.variant({ variant: "subtle", color: theme.primaryColor }).color} order={2}>
            Profile Picture:
          </Title>
          <Avatar
            onClick={() => {
              setOpened(true);
            }}
            radius='xl'
            classNames={{
              root: classes.avaRoot,
            }}
            src={data?.image || undefined}
          ></Avatar>
          <Title color={theme.fn.variant({ variant: "subtle", color: theme.primaryColor }).color} order={2}>
            Display Name:
          </Title>
          <TextInput
            ref={nameRef}
            onBlur={() => {
              if (nameRef.current?.value !== data?.name) {
                updateProfile({ propToChange: "username", value: nameRef.current?.value });
              } else {
                console.log("no change");
              }
            }}
            classNames={{
              root: classes.root,
              input: classes.input,
            }}
            size='lg'
            value={username}
            onChange={(e) => {
              setUsername(e.currentTarget.value);
            }}
            placeholder='username'
          />
          <Title color={theme.fn.variant({ variant: "subtle", color: theme.primaryColor }).color} order={2}>
            Accent Color:
          </Title>
          <ColorPicker
            classNames={{
              wrapper: classes.wrapper,
            }}
            format='hex'
            swatchesPerRow={7}
            value={colorValue}
            onChange={setColorValue}
            withPicker={false}
            swatches={[
              "#1A1B1E",
              "#495057",
              "#F03E3E",
              "#D6336C",
              "#AE3EC9",
              "#7048E8",
              "#4263EB",
              "#1C7ED6",
              "#1098AD",
              "#0CA678",
              "#37B24D",
              "#74B816",
              "#F59F00",
              "#F76707",
            ]}
          />
        </Stack>
      </Card>
    </>
  );
};

export default Profile;
