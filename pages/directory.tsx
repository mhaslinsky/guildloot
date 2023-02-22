import { NextPage } from "next";
import { Flex, Card } from "@mantine/core";
import GuildTable from "../components/Tables/GuildTable";
import { useEffect, useMemo, useState } from "react";
import { useGrabGuilds } from "../utils/hooks/useGrabGuilds";
import { Guild } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { MembershipButton } from "../components/Buttons/MembershipButton";

const Directory: NextPage = (props) => {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const { data, isFetching } = useGrabGuilds();

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  const columnHelper = createColumnHelper<Guild>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.name}`, {
        header: "Guild Name",
        cell: (info) => info.getValue(),
        footer: "Guild Name",
      }),
      columnHelper.accessor((row) => `${row.server}`, {
        header: "Server",
        cell: (info) => info.getValue(),
        enableResizing: false,
        footer: "Server",
      }),
      columnHelper.display({
        header: "Request Membership",
        cell: () => {
          return (
            <Flex justify='end'>
              <MembershipButton />
            </Flex>
          );
        },
        enableResizing: false,
        footer: "Request Membership",
      }),
    ],
    [columnHelper]
  );

  return (
    <>
      <Flex justify='center' align='center'>
        <Card w='100%'>
          {initialRenderComplete && <GuildTable columns={columns} loading={isFetching} data={data || []} />}
        </Card>
      </Flex>
    </>
  );
};

export default Directory;
