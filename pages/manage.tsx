import { NextPage } from "next";
import { Title, Text, Stack, Divider, Button, Flex, Loader, Group, Select, Box } from "@mantine/core";
import { UsersRolesTable } from "../components/UserRolesTable";
import { useGrabGuildMembers } from "../utils/hooks/queries/useGrabGuildMembers";
import { useGrabUserInfo } from "../utils/hooks/queries/useUserInfo";
import { useGuildStore } from "../utils/store/store";
import { useEffect, useState } from "react";
import { useUpdateGuildMembers } from "../utils/hooks/mutations/useUpdateGuildMembers";
import { openConfirmModal } from "@mantine/modals";
import { useDeleteGuild } from "../utils/hooks/mutations/useDeleteGuild";
import { useRouter } from "next/router";
import { serverList } from "../components/GuildCreateForm";
import { useEditGuild } from "../utils/hooks/mutations/useEditGuild";

const ManageUsers: NextPage = () => {
  const { data: guildInfo, isLoading, fetchStatus, status } = useGrabGuildMembers();
  const { mutate: updateGuildMember } = useUpdateGuildMembers();
  const { mutate: editGuild } = useEditGuild();
  const { mutate: deleteGuild } = useDeleteGuild();
  const [guildServer, setGuildServer] = useState(guildInfo?.server || null);
  const { data: availableGuilds } = useGrabUserInfo();
  const [setCurrentGuildID, setCurrentGuildName, setAvailableGuilds, currentGuildID, roleInCurrentGuild] =
    useGuildStore((state) => [
      state.setCurrentGuildID,
      state.setCurrentGuildName,
      state.setAvailableGuilds,
      state.currentGuildID,
      state.roleinCurrentGuild,
    ]);
  const { data: userData } = useGrabUserInfo();
  const router = useRouter();

  useEffect(() => {
    if (availableGuilds) {
      const guilds = availableGuilds.guildAdmin
        .map((guild) => ({ ...guild, role: "admin" }))
        .concat(availableGuilds.guildOfficer.map((guild) => ({ ...guild, role: "officer" })))
        .concat(availableGuilds.guildMember.map((guild) => ({ ...guild, role: "member" })));
      const guildsWithValues = guilds.map((guild) => {
        return {
          ...guild,
          value: guild.id,
          label: guild.name,
        };
      });
      setAvailableGuilds(guildsWithValues);
    }
  }, [setAvailableGuilds, availableGuilds]);

  if (status == "loading" && fetchStatus == "idle")
    return (
      <Text fw={700} fz='xl' ta='center'>
        Select a guild above
      </Text>
    );
  if (isLoading)
    return (
      <Flex justify='center' align='center' w='100%' h='100%'>
        <Loader />
      </Flex>
    );
  else {
    return (
      <Stack justify='space-between' h='100%'>
        <Stack justify='space-between' h='100%'>
          <Box>
            <Title pt='md' pb='-1rem' order={3}>
              Current Members
            </Title>
            <UsersRolesTable data={guildInfo?.Admin} role='Admin' />
            {guildInfo?.officers.length! > 0 && <UsersRolesTable data={guildInfo?.officers} role='Officer' />}
            {guildInfo?.members.length! > 0 && <UsersRolesTable data={guildInfo?.members} role='Member' />}
            {(roleInCurrentGuild == "admin" || roleInCurrentGuild == "officer") &&
              guildInfo?.pending.length! > 0 && (
                <>
                  <Title pt='lg' order={3}>
                    Pending Requests
                  </Title>
                  <UsersRolesTable data={guildInfo?.pending} role='Pending' />
                </>
              )}
          </Box>
          <Group>
            {(roleInCurrentGuild == "admin" || roleInCurrentGuild == "officer") && (
              <>
                <Text>Server: </Text>
                <Select
                  searchable
                  data={serverList}
                  placeholder={guildInfo?.server || "Select a server"}
                  defaultValue={guildInfo?.server}
                  onChange={(value) => {
                    if (value !== guildInfo?.server && value !== null) {
                      editGuild({ server: value });
                    }
                  }}
                />
              </>
            )}
          </Group>
        </Stack>
        <Stack>
          <Divider />
          <Flex justify='space-between' w='100%'>
            {roleInCurrentGuild == "admin" && (
              <Button
                variant='subtle'
                onClick={() => {
                  openConfirmModal({
                    title: "Are you sure?",
                    children: (
                      <Text size='sm'>
                        Are you sure you want to delete this guild? This action cannot be undone.
                      </Text>
                    ),
                    labels: {
                      confirm: "Yes, We about to head out",
                      cancel: "No, cancel",
                    },
                    confirmProps: {
                      color: "red",
                    },
                    onConfirm: () => {
                      deleteGuild({ gid: currentGuildID });
                    },
                    onCancel: () => {},
                  });
                }}
              >
                Delete Guild
              </Button>
            )}
            {roleInCurrentGuild !== "admin" && (
              <Button
                variant='subtle'
                onClick={() => {
                  openConfirmModal({
                    title: "Are you sure?",
                    children: (
                      <Text size='sm'>
                        Are you sure you want to quit this guild? If you wish to rejoin, you will need to reapply
                        in the guild directory and an admin or officer will have to reapprove your membership.
                      </Text>
                    ),
                    labels: {
                      confirm: "Yes, I'mma bout to head out",
                      cancel: "No, cancel",
                    },
                    confirmProps: {
                      color: "red",
                    },
                    onConfirm: () => {
                      updateGuildMember({ role: "Quit", userID: userData!.id });
                      setCurrentGuildID(null);
                      setCurrentGuildName(null);
                      router.push(`/`);
                    },
                    onCancel: () => {},
                  });
                }}
              >
                Leave Guild
              </Button>
            )}
          </Flex>
        </Stack>
      </Stack>
    );
  }
};
export default ManageUsers;
