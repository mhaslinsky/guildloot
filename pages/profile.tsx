import { NextPage } from "next";

import { Card, createStyles, ColorPicker, Text, Stack, Avatar, Title, Input } from "@mantine/core";
import { useGrabUserInfo } from "../utils/hooks/queries/useUserInfo";
import { useResizeObserver } from "@mantine/hooks";
import { useEffect, useState } from "react";

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
  const { classes } = useStyles();
  const [value, onChange] = useState("");
  const { data } = useGrabUserInfo();
  const [ref, rect] = useResizeObserver();

  useEffect(() => {
    console.log(rect);
  }, [rect]);

  return (
    <Card ref={ref} h='100%' w='100%'>
      <Stack align='center' h='100%'>
        <Title order={2}>Profile Pic:</Title>
        <Avatar radius='xl' size={rect.width / 5} src={data?.image || undefined}></Avatar>
        <Title order={2}>Display Name:</Title>
        <Input w='50%' placeholder='username'></Input>
        <Title order={2}>Accent Color:</Title>
        <ColorPicker
          format='hex'
          value={value}
          onChange={onChange}
          withPicker={false}
          fullWidth
          swatches={[
            "#25262b",
            "#868e96",
            "#fa5252",
            "#e64980",
            "#be4bdb",
            "#7950f2",
            "#4c6ef5",
            "#228be6",
            "#15aabf",
            "#12b886",
            "#40c057",
            "#82c91e",
            "#fab005",
            "#fd7e14",
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
