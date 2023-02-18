import { NextPage } from "next";
import FloatingDBLabelTextarea from "../components/FloatingDBLabelTextarea";
import { useEffect, useState } from "react";
import { useGuildStore } from "../utils/store/store";
import { Button, Card, Group, Stack } from "@mantine/core";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import { useLogLoot } from "../utils/hooks/useLogLoot";

const Log: NextPage = () => {
  const [sendLoot, setSendLoot] = useState<string | undefined>("");
  const { data: userData } = useGrabUserInfo();
  const [setCurrentGuild, setAvailableGuilds] = useGuildStore((state) => [
    state.setCurrentGuild,
    state.setAvailableGuilds,
  ]);
  const { mutate, isSuccess } = useLogLoot();

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
      setCurrentGuild(guildsWithValues[0].value);
    }
  }, [setAvailableGuilds, setCurrentGuild, userData]);

  useEffect(() => {
    if (isSuccess) {
      setSendLoot("");
    }
  }, [isSuccess]);

  const inputChangeHandler = (value: string) => {
    setSendLoot(value);
  };

  return (
    <Stack justify='center' align='center' w='100%'>
      <Card w='100%'>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            mutate(sendLoot);
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
