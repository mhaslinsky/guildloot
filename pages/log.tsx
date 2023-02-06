import { NextPage } from "next";
import FloatingDBLabelTextarea from "../components/FloatingDBLabelTextarea";
import { showNotification } from "@mantine/notifications";
import { ExclamationMark } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { queryClient } from "../utils/queryClient";
import axios from "axios";
import { useGuildStore } from "../utils/store/store";
import { Button, Card, Group, Stack } from "@mantine/core";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";

const Log: NextPage = (props) => {
  const [sendLoot, setSendLoot] = useState<string | undefined>("");
  const { data: userData } = useGrabUserInfo();
  const [currentGuild, setCurrentGuild, setAvailableGuilds] = useGuildStore((state) => [
    state.currentGuild,
    state.setCurrentGuild,
    state.setAvailableGuilds,
  ]);

  useEffect(() => {
    if (userData) {
      const guilds = userData.guildAdmin.concat(userData.guildOfficer);
      const guildsWithValues = guilds.map((guild: any) => {
        return {
          value: guild.id,
          label: guild.name,
          image: guild.image,
          name: guild.name,
          adminId: guild.adminId,
          id: guild.id,
        };
      });
      setAvailableGuilds(guildsWithValues);
      setCurrentGuild(guildsWithValues[0]);
    }
  }, [setAvailableGuilds, setCurrentGuild, userData]);

  const inputChangeHandler = (value: string) => {
    setSendLoot(value);
  };

  const onSubmit = async (rcLootData: string | undefined) => {
    if (!rcLootData) {
      showNotification({
        title: "Error",
        message: "Please enter some loot",
        color: "red",
        icon: <ExclamationMark />,
      });
      return;
    } else if (!currentGuild) {
      showNotification({
        title: "Error",
        message: "Please select a guild",
        color: "red",
        icon: <ExclamationMark />,
      });
      return;
    }
    axios
      .post("/api/loot/post", { rcLootData, currentGuild })
      .then((res) => {
        setSendLoot("");
        queryClient.invalidateQueries(["loot", currentGuild]);
        // grabLoot();
      })
      .catch((err) => {
        console.log(err);
        showNotification({
          title: "Error",
          message: err.response.data.message,
          color: "red",
          icon: <ExclamationMark />,
        });
      });
  };
  return (
    <Stack justify='center' align='center' w='100%'>
      <Card w='100%'>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            onSubmit(sendLoot);
          }}
        >
          <FloatingDBLabelTextarea
            debounce={500}
            minRows={6}
            maxRows={20}
            value={sendLoot}
            onChange={(value) => inputChangeHandler(String(value))}
            placeholder='Paste your RCLootCouncil JSON data here'
            label='RCLootCouncil JSON'
          />
          <Group position='right' mt='xs'>
            <Button type='submit'>Submit</Button>
          </Group>
        </form>
      </Card>
    </Stack>
  );
};

export default Log;
