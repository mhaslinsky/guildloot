import { NextPage } from "next";
import FloatingDBLabelTextarea from "../components/FloatingDBLabelTextarea";
import { useEffect, useState } from "react";
import { useGuildStore } from "../utils/store/store";
import { Button, Card, Divider, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import { useLogLoot } from "../utils/hooks/useLogLoot";
import theme from "../styles/theme";
import { rcLootItem } from "@prisma/client";

const Log: NextPage = () => {
  const [lootData, setLootData] = useState<string | undefined>("");
  const { data: userData } = useGrabUserInfo();
  const [setCurrentGuildID, setCurrentGuildName, setAvailableGuilds] = useGuildStore((state) => [
    state.setCurrentGuildID,
    state.setCurrentGuildName,
    state.setAvailableGuilds,
  ]);
  const { data, mutate: logloot, isSuccess } = useLogLoot();
  const [opened, setOpened] = useState(false);
  const [modalContent, setModalContent] = useState([]);

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
    console.log(data);
    if (data) {
      if (data.badItems.length === 0) return;
      const formattedItems = data.badItems.map(({ id, itemName, player }: rcLootItem) => ({
        id,
        itemName,
        player,
      }));
      const MC = formattedItems.map((item: { id: any; itemName: any; player: any }) => {
        return (
          <Card key={item.id} mb={theme.spacing.xs}>
            <Text>id: {item.id}</Text>
            <Text> Item Name: {item.itemName}</Text>
            <Text>Owner: {item.player}</Text>
          </Card>
        );
      });
      console.log(MC);
      setModalContent(MC);
      setOpened(true);
    }
    if (isSuccess) {
      setLootData("");
    }
  }, [isSuccess, data]);

  const inputChangeHandler = (value: string) => {
    setLootData(value);
  };

  return (
    <>
      <Modal centered withCloseButton={false} opened={opened} onClose={() => setOpened(false)}>
        <>
          <Text weight={700} pb={theme.spacing.md}>
            There were problems with the following items, please check their formatting, or that they were not
            uploaded already.
          </Text>
          {modalContent}
        </>
      </Modal>
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
    </>
  );
};

export default Log;
