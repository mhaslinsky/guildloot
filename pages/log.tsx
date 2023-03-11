import { NextPage } from "next";
import FloatingDBLabelTextarea from "../components/FloatingDBLabelTextarea";
import { useEffect, useState } from "react";
import { useGuildStore } from "../utils/store/store";
import { Button, Card, Group, Stack } from "@mantine/core";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import { useLogLoot } from "../utils/hooks/useLogLoot";

const Log: NextPage = () => {
  const [lootData, setLootData] = useState<string | undefined>("");
  const { data: userData } = useGrabUserInfo();
  const [setCurrentGuildID, setCurrentGuildName, setAvailableGuilds] = useGuildStore((state) => [
    state.setCurrentGuildID,
    state.setCurrentGuildName,
    state.setAvailableGuilds,
  ]);
  const { mutate: logloot, isSuccess } = useLogLoot();

  useEffect(() => {
    if (userData) {
      const guilds = userData.guildAdmin
        .map((guild) => ({ ...guild, role: "admin" }))
        .concat(userData.guildOfficer.map((guild) => ({ ...guild, role: "officer" })));
      const guildsWithValues = guilds.map((guild) => {
        return {
          ...guild,
          value: guild.id,
          label: guild.name,
        };
      });
      setAvailableGuilds(guildsWithValues || []);
      setCurrentGuildID(guildsWithValues[0]?.value || null);
      setCurrentGuildName(guildsWithValues[0]?.name || null);
    }
  }, [setAvailableGuilds, setCurrentGuildID, setCurrentGuildName, userData]);

  useEffect(() => {
    if (isSuccess) {
      setLootData("");
    }
  }, [isSuccess]);

  const inputChangeHandler = (value: string) => {
    setLootData(value);
  };

  return (
    <Stack justify='center' align='center' w='100%'>
      <Card w='100%'>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            logloot(lootData);
          }}
        >
          <FloatingDBLabelTextarea
            debounce={500}
            minRows={6}
            maxRows={20}
            value={lootData}
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
