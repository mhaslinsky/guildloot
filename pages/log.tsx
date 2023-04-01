import { NextPage } from "next";
import FloatingDBLabelTextarea from "../components/FloatingDBLabelTextarea";
import { useEffect, useRef, useState } from "react";
import { useGuildStore } from "../utils/store/store";
import { Button, Card, Group, Modal, Stack, Text, Textarea, Title } from "@mantine/core";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import { useLogLoot } from "../utils/hooks/useLogLoot";
import theme from "../styles/theme";
import { rcLootItem } from "@prisma/client";
import { useElementSize, useViewportSize } from "@mantine/hooks";

const Log: NextPage = () => {
  const textAreaRef = useRef(null);
  const [rowAdjustment, setRowAdjustment] = useState(0);
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
  const { ref: cardRef, width: cardWidth, height: cardHeight } = useElementSize();

  const [rows, setRows] = useState(10);

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
    if (data?.badItems) {
      if (data.badItems.length === 0) return;
      const formattedItems = data.badItems.map(({ id, itemName, player }: rcLootItem) => ({
        id,
        itemName,
        player,
      }));
      const modalCont = formattedItems.map((item: { id: any; itemName: any; player: any }) => {
        return (
          <Card key={item.id} mb={theme.spacing.xs}>
            <Text>id: {item.id}</Text>
            <Text> Item Name: {item.itemName}</Text>
            <Text>Owner: {item.player}</Text>
          </Card>
        );
      });
      setModalContent(modalCont);
      setOpened(true);
    }
    if (isSuccess) {
      setLootData("");
    }
  }, [isSuccess, data]);

  const inputChangeHandler = (value: string) => {
    setLootData(value);
  };

  useEffect(() => {
    if (cardHeight > 795) setRowAdjustment(0);
    if (cardHeight < 795) setRowAdjustment(1);
    if (cardHeight < 530) setRowAdjustment(2);
    if (cardHeight < 266) setRowAdjustment(3);

    const lineHeight = parseInt(getComputedStyle(cardRef.current!).lineHeight);
    const rows = Math.floor(cardHeight / lineHeight);
    setRows(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardRef, cardHeight, cardWidth]);

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
      <Stack justify='center' align='center' w='100%' h='100%'>
        <Card p={theme.spacing.sm} ref={cardRef} h='100%' w='100%'>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              logloot(lootData);
            }}
          >
            <FloatingDBLabelTextarea
              forwardedRef={textAreaRef}
              debounce={500}
              minRows={rows - rowAdjustment}
              maxRows={rows - rowAdjustment}
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
