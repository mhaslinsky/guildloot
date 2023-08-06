import { NextPage } from "next";
import FloatingDBLabelTextarea from "../components/FloatingDBLabelTextarea";
import { useEffect, useRef, useState } from "react";
import { useGuildStore } from "../utils/store/store";
import {
  Badge,
  Button,
  Card,
  Group,
  JsonInput,
  Modal,
  Stack,
  Tabs,
  TabsValue,
  Text,
  Switch,
  Flex,
} from "@mantine/core";
import { useGrabUserInfo } from "../utils/hooks/queries/useUserInfo";
import { useLogLoot } from "../utils/hooks/mutations/useLogLoot";
import theme from "../styles/theme";
import { useElementSize } from "@mantine/hooks";
import { formattedGargulData } from "./api/loot/[lgid]";
import { RCLootItem } from "../utils/types";

const Log: NextPage = () => {
  const textAreaRef = useRef(null);
  const [activeTab, setActiveTab] = useState<TabsValue>("RCLootCouncil");
  const [lootData, setLootData] = useState<string | undefined>("");
  const [checked, setChecked] = useState(true);
  const [raidSize, setRaidSize] = useState<10 | 25>(25);
  const { data: userData } = useGrabUserInfo();
  const [setCurrentGuildID, setCurrentGuildName, setAvailableGuilds, roleInCurrentGuild] = useGuildStore(
    (state) => [
      state.setCurrentGuildID,
      state.setCurrentGuildName,
      state.setAvailableGuilds,
      state.roleinCurrentGuild,
    ]
  );
  const { data, mutate: logloot, isSuccess, isLoading } = useLogLoot();
  const [opened, setOpened] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const { ref: cardRef, width: cardWidth, height: cardHeight } = useElementSize();

  //setting guild dropdown list to guilds that user is admin or officer of
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
      if (!(roleInCurrentGuild === "admin" || roleInCurrentGuild === "officer")) {
        setCurrentGuildID(guildsWithValues[0]?.value || null);
        setCurrentGuildName(guildsWithValues[0]?.name || null);
      }
    }
  }, [roleInCurrentGuild, setAvailableGuilds, setCurrentGuildID, setCurrentGuildName, userData]);

  //handling modal popup if there are some, but not all, bad items
  useEffect(() => {
    let modalCont;
    if (data?.badItems) {
      if (data.badItems.length === 0) return;
      if (activeTab === "RCLootCouncil") {
        modalCont = data.badItems.map((item: RCLootItem) => {
          return (
            <Card key={item.id} mb={theme.spacing.xs}>
              <Text>RCLC id: {item.id}</Text>
              <Text>itemID: {item.itemID}</Text>
              <Text> Item Name: {item.itemName}</Text>
              <Text>Owner: {item.player}</Text>
            </Card>
          );
        });
      } else if (activeTab === "Gargul") {
        modalCont = data.badItems.map((item: formattedGargulData | number) => {
          if (typeof item === "number")
            return (
              <Card key={item} mb={theme.spacing.xs}>
                <Text>id: {item} Not found in database</Text>
              </Card>
            );
          else {
            return (
              <Card key={item.trackerId} mb={theme.spacing.xs}>
                <Text>id: {item.trackerId}</Text>
                <Text> Item Name: {item.itemName}</Text>
                <Text>Owner: {item.player}</Text>
              </Card>
            );
          }
        });
      }
      setModalContent(modalCont);
      setOpened(true);
    }
    if (isSuccess) {
      setLootData("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            uploaded already, and that the itemIDs are valid.
          </Text>
          {modalContent}
        </>
      </Modal>
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value='RCLootCouncil'>
            RCLootCouncil <Badge>Preferred</Badge>
          </Tabs.Tab>
          <Tabs.Tab value='Gargul'>Gargul</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='Gargul' pt='xs'>
          <Stack justify='center' align='center' w='100%' h='100%'>
            <Card p={theme.spacing.sm} ref={cardRef} h='100%' w='100%'>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  logloot({ lootData, addon: activeTab, raidSize });
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
                <Flex justify='space-between' align='center' mt='xs'>
                  <Switch
                    checked={checked}
                    onChange={(event) => {
                      setChecked(event.target.checked);
                      setRaidSize(event.target.checked ? 25 : 10);
                    }}
                    onLabel='25'
                    offLabel='10'
                    size='xl'
                  />
                  <Button type='submit'>Submit</Button>
                </Flex>
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
                  logloot({ lootData, addon: activeTab });
                }}
              >
                <JsonInput
                  value={lootData}
                  onChange={(value) => inputChangeHandler(String(value))}
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
                  minRows={20}
                  maxRows={50}
                />
                <Group position='right' mt='xs'>
                  <Button type='submit'>{isLoading ? "Submitting" : "Submit"}</Button>
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
