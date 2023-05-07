import { NextPage } from "next";

import { Card, createStyles, ColorPicker, Text, Stack, Avatar, Title, Input, TextInput } from "@mantine/core";
import { useGrabUserInfo } from "../utils/hooks/queries/useUserInfo";
import { useResizeObserver } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "../utils/store/store";

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
}));

const Profile: NextPage = () => {
  const { theme } = useStyles();
  const { data } = useGrabUserInfo();
  const { classes } = useStyles();
  const [value, setValue] = useState("");
  const [username, setUsername] = useState(data?.name);
  const [ref, rect] = useResizeObserver();
  const nameRef = useRef<HTMLInputElement>(null);

  const [setPrimaryColor, primaryColor] = useThemeStore((state) => [state.setPrimaryColor, state.primaryColor]);

  // useEffect(() => {
  //   const color = localStorage.getItem("accentColor");
  //   if (color) {
  //     setValue(color);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    const cachedColor = localStorage.getItem("accentColor");
    console.log("cachedColor", cachedColor);
    setPrimaryColor(cachedColor || "blue");
    switch (value) {
      case "#1A1B1E":
        setPrimaryColor("dark");
        break;
      case "#495057":
        setPrimaryColor("gray");
        break;
      case "#F03E3E":
        setPrimaryColor("red");
        break;
      case "#D6336C":
        setPrimaryColor("pink");
        break;
      case "#AE3EC9":
        setPrimaryColor("grape");
        break;
      case "#7048E8":
        setPrimaryColor("violet");
        break;
      case "#4263EB":
        setPrimaryColor("indigo");
        break;
      case "#1C7ED6":
        setPrimaryColor("blue");
        break;
      case "#1098AD":
        setPrimaryColor("cyan");
        break;
      case "#0CA678":
        setPrimaryColor("teal");
        break;
      case "#37B24D":
        setPrimaryColor("green");
        break;
      case "#74B816":
        setPrimaryColor("lime");
        break;
      case "#F59F00":
        setPrimaryColor("yellow");
        break;
      case "#F76707":
        setPrimaryColor("orange");
        break;
      default:
        break;
    }
    localStorage.setItem("accentColor", primaryColor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Card ref={ref} h='100%' w='100%'>
      <Stack align='center' h='100%'>
        <Title color={theme.fn.variant({ variant: "subtle", color: theme.primaryColor }).color} order={2}>
          Profile Picture:
        </Title>
        <Avatar radius='xl' size={rect.width / 5} src={data?.image || undefined}></Avatar>
        <Title color={theme.fn.variant({ variant: "subtle", color: theme.primaryColor }).color} order={2}>
          Display Name:
        </Title>
        <TextInput
          ref={nameRef}
          onBlur={() => {
            if (nameRef.current?.value !== data?.name) {
              console.log("fire mutation");
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
          value={value}
          onChange={setValue}
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
  );
};

export default Profile;
