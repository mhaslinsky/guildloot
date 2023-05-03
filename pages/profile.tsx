import { NextPage } from "next";

import { Card, createStyles, ColorPicker, Text, Stack, Avatar, Title, Input, TextInput } from "@mantine/core";
import { useGrabUserInfo } from "../utils/hooks/queries/useUserInfo";
import { useResizeObserver } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useThemeStore } from "../utils/store/store";

const useStyles = createStyles((theme) => ({
  root: {
    display: "flex",
    backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${
      theme.colors[theme.primaryColor][7]
    } 100%)`,
    padding: `calc(${theme.spacing.xl} * 1.5)`,
    borderRadius: theme.radius.md,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },
}));

interface StatsGroupProps {
  data: { title: string; stats: string; description: string }[];
}

const Profile: NextPage = () => {
  const { data } = useGrabUserInfo();
  const { classes } = useStyles();
  const [value, onChange] = useState("");
  const [username, setUsername] = useState(data?.name);
  const [ref, rect] = useResizeObserver();

  const [setPrimaryColor, primaryColor] = useThemeStore((state) => [state.setPrimaryColor, state.primaryColor]);

  useEffect(() => {
    const color = localStorage.getItem("accentColor");
    console.log("stored color: ", color);
    if (color) {
      onChange(color);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(value);
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
        setPrimaryColor("blue");
        break;
    }
    localStorage.setItem("accentColor", value);
  }, [primaryColor, setPrimaryColor, value]);

  return (
    <Card ref={ref} h='100%' w='100%'>
      <Stack align='center' h='100%'>
        <Title order={2}>Profile Pic:</Title>
        <Avatar radius='xl' size={rect.width / 5} src={data?.image || undefined}></Avatar>
        <Title order={2}>Display Name:</Title>
        <TextInput
          value={username}
          onChange={(e) => {
            setUsername(e.currentTarget.value);
          }}
          w='50%'
          placeholder='username'
        ></TextInput>
        <Title order={2}>Accent Color:</Title>
        <ColorPicker
          format='hex'
          value={value}
          onChange={onChange}
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
        <Text align='center' style={{ marginTop: 5 }}>
          {value}
        </Text>
      </Stack>
    </Card>
  );
};

export default Profile;
