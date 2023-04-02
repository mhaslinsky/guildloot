import { NextPage } from "next";
import FloatingDBLabelTextarea from "../components/FloatingDBLabelTextarea";
import { useEffect, useRef, useState } from "react";
import { useGuildStore } from "../utils/store/store";
import { Button, Card, Group, JsonInput, Modal, Stack, Tabs, TabsValue, Text } from "@mantine/core";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import { useLogLoot } from "../utils/hooks/useLogLoot";
import theme from "../styles/theme";
import { rcLootItem } from "@prisma/client";
import { useElementSize, useViewportSize } from "@mantine/hooks";

const Log: NextPage = () => {
  const textAreaRef = useRef(null);
  const [activeTab, setActiveTab] = useState<TabsValue>("RCLootCouncil");
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
  // const [rows, setRows] = useState(10);
  // const [rowAdjustment, setRowAdjustment] = useState(0);

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

  // useEffect(() => {
  //   if (cardHeight > 795) setRowAdjustment(0);
  //   if (cardHeight < 795) setRowAdjustment(1);
  //   if (cardHeight < 530) setRowAdjustment(2);
  //   if (cardHeight < 266) setRowAdjustment(3);

  //   const lineHeight = parseInt(getComputedStyle(cardRef.current!).lineHeight);
  //   const rows = Math.floor(cardHeight / lineHeight);
  //   setRows(rows);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cardRef, cardHeight, cardWidth]);

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
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value='RCLootCouncil'>RCLootCouncil (Preferred)</Tabs.Tab>
          <Tabs.Tab value='Gargul'>Gargul</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='Gargul' pt='xs'>
          <Stack justify='center' align='center' w='100%' h='100%'>
            <Card p={theme.spacing.sm} ref={cardRef} h='100%' w='100%'>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  logloot({ rcLootData: lootData, addon: activeTab });
                }}
              >
                <FloatingDBLabelTextarea
                  forwardedRef={textAreaRef}
                  debounce={500}
                  value={lootData}
                  onChange={(value) => inputChangeHandler(String(value))}
                  placeholder={`Example:
                  dateTime,character,itemID,offspec,id
                  2021-02-21,Tawd,45471,0,78275561525316826270
                  2023-03-21,_disenchanted,45492,0,10458818492771563854`}
                  label='Gargul Export, (Default Settings)'
                  minRows={10}
                />
                <Group position='right' mt='xs'>
                  <Button type='submit'>Submit</Button>
                </Group>
              </form>
            </Card>
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value='RCLootCouncil' pt='xs'>
          <Stack justify='center' align='center' w='100%' h='100%'>
            <Card p={theme.spacing.sm} ref={cardRef} h='100%' w='100%'>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  logloot({ rcLootData: lootData, addon: activeTab });
                }}
              >
                <JsonInput
                  label='Your JSON data, exported from the RCLootCouncil addon'
                  placeholder={` Example:
                  [{ "player": "Todd-Skyfury",
                  "date": "2/21/23",
                  "time": "23:06:31",
                  "id": "1677056791-36",
                  "itemID": 45471,
                  "itemString": "item:45471::::::::80",
                  "response": "Best in Slot",
                  "votes": 1,
                  "class": "PALADIN",
                  "instance": "Ulduar-25 Player",
                  "boss": "Thorim",
                  "gear1": "[Signet of the Impregnable Fortress]",
                  "gear2": "[Signet of Winter]",
                  "responseID": "1",
                  "isAwardReason": "false",
                  "rollType": "normal",
                  "subType": "Miscellaneous",
                  "equipLoc": "Finger",
                  "note": "",
                  "owner": "Thorim",
                  "itemName": "Fates Clutch"
                },{
                  "player": "Vongor-Skyfury",
                  "date": "2/21/23",
                  "time": "23:49:03",
                  "id": "1677059343-46",
                  "itemID": 36443,
                  "itemString": "item:36443::::::-19:28573754:80",
                  "response": "Disenchant",
                  "votes": 0,
                  "class": "WARLOCK",
                  "instance": "Ulduar-25 Player",
                  "boss": "Mimiron",
                  "gear1": "",
                  "gear2": "",
                  "responseID": "1",
                  "isAwardReason": "true",
                  "rollType": "normal",
                  "subType": "Miscellaneous",
                  "equipLoc": "Neck",
                  "note": "",
                  "owner": "Vongor-Skyfury",
                  "itemName": "Platinum Medallion of Intellect"
                }...]`}
                  validationError='Invalid json'
                  formatOnBlur
                  autosize
                  minRows={10}
                />
                <Group position='right' mt='xs'>
                  <Button type='submit'>Submit</Button>
                </Group>
              </form>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default Log;
