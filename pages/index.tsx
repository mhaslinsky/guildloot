import { Flex, Card, Button } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { RCLootItem } from "../utils/types";
import Table from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { useGrabLoot } from "../utils/hooks/useGrabLoot";
import { useSession } from "next-auth/react";
import { HeroTitle } from "../components/HeroTitle";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import { useGuildStore } from "../utils/store/store";

const Home: NextPage<{ lootHistory: RCLootItem[] }> = (props) => {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const { data, isFetching } = useGrabLoot();
  const { data: session, status } = useSession();
  const { data: userData } = useGrabUserInfo();

  const [setAvailableGuilds] = useGuildStore((state) => [state.setAvailableGuilds]);

  useEffect(() => {
    if (userData) {
      const guilds = userData.guildAdmin.concat(userData.guildOfficer).concat(userData.guildMember);
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
    }
  }, [setAvailableGuilds, userData]);

  useEffect(() => {
    setInitialRenderComplete(true);
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
          {initialRenderComplete && session && <Table columns={columns} loading={isFetching} data={data || []} />}
        </Card>
      </Flex>
    </>
  );
};

export default Home;
