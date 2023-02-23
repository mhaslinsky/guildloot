import { Flex, Card } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { RCLootItem } from "../utils/types";
import LootTable from "../components/Tables/LootTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useGrabLoot } from "../utils/hooks/useGrabLoot";
import { useSession } from "next-auth/react";
import { HeroTitle } from "../components/HeroTitle";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import { useGuildStore } from "../utils/store/store";

const Home: NextPage = () => {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const { data, isFetching } = useGrabLoot();
  const { data: session, status } = useSession();
  const { data: availableGuilds } = useGrabUserInfo();
  const [setAvailableGuilds, setCurrentGuildName, setCurrentGuildID] = useGuildStore((state) => [
    state.setAvailableGuilds,
    state.setCurrentGuildName,
    state.setCurrentGuildID,
  ]);

  useEffect(() => {
    if (availableGuilds) {
      const guilds = availableGuilds.guildAdmin
        .concat(availableGuilds.guildOfficer)
        .concat(availableGuilds.guildMember);
      const guildsWithValues = guilds.map((guild: any) => {
        return {
          value: guild.id,
          label: guild.name,
          image: guild.image,
          name: guild.name,
          adminId: guild.adminId,
          server: guild.server,
          id: guild.id,
        };
      });
      setAvailableGuilds(guildsWithValues);
    }
  }, [setAvailableGuilds, availableGuilds]);

  useEffect(() => {
    setInitialRenderComplete(true);
    const localstore = localStorage.getItem("currentGuild");
    if (localstore) {
      const lastUseData = JSON.parse(localstore);
      setCurrentGuildID(lastUseData.id);
      setCurrentGuildName(lastUseData.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columnHelper = createColumnHelper<RCLootItem>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.player}`, {
        header: "Player",
        cell: (info) => {
          const name = info.getValue().split("-");
          return name[0];
        },
        footer: "Player",
      }),
      columnHelper.accessor(`itemName`, {
        header: "Item",
        cell: (info) => info.getValue(),
        footer: "Item",
      }),
      columnHelper.accessor((row) => `${row.boss}`, {
        header: "Boss",
        cell: (info) => info.getValue(),
        footer: "Boss",
      }),
      columnHelper.accessor((row) => `${row.instance}`, {
        header: "Instance",
        cell: (info) => {
          const name = info.getValue().split("-");
          const display = `${name[0]} (${name[1]})`;
          return display;
        },
        footer: "Instance",
      }),
      columnHelper.accessor((row) => `${row.response}`, {
        header: "Reason",
        cell: (info) => info.getValue(),
        footer: "Reason",
      }),
      columnHelper.accessor("dateTime", {
        header: "Date",
        cell: (info) => {
          if (!info) return "N/A";
          const date = new Date(info.getValue()!).toLocaleDateString("en-US");
          const time = new Date(info.getValue()!).toLocaleTimeString("en-US");
          return `${date} ${time}`;
        },
        footer: "Date",
      }),
    ],
    [columnHelper]
  );

  return (
    <>
      <Flex justify='center' align='center'>
        <Card w='100%'>
          {!session && status == "unauthenticated" && <HeroTitle />}
          {initialRenderComplete && session && (
            <LootTable columns={columns} loading={isFetching} data={data || []} />
          )}
        </Card>
      </Flex>
    </>
  );
};

export default Home;
