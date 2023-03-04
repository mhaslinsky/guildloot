import { NextPage } from "next";
import { Title, Text, Stack, Divider, Button, Flex, Loader } from "@mantine/core";
import { UsersRolesTable } from "../components/UserRolesTable";
import { useGrabGuildMembers } from "../utils/hooks/useGrabGuildMembers";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import { useGuildStore } from "../utils/store/store";
import { useEffect } from "react";
import { useUpdateGuildMembers } from "../utils/hooks/useUpdateGuildMembers";
import { openConfirmModal } from "@mantine/modals";
import { useDeleteGuild } from "../utils/hooks/useDeleteGuild";

const ManageUsers: NextPage = () => {
  const { data: currentGuildMembers, isLoading, fetchStatus, status } = useGrabGuildMembers();
  const { mutate: updateGuildMember } = useUpdateGuildMembers();
  const { mutate: deleteGuild } = useDeleteGuild();
  const { data: availableGuilds } = useGrabUserInfo();
  const [setAvailableGuilds, currentGuildID] = useGuildStore((state) => [
    state.setAvailableGuilds,
    state.currentGuildID,
  ]);
  const { data: userData } = useGrabUserInfo();

  useEffect(() => {
    if (availableGuilds) {
      const guilds = availableGuilds.guildAdmin
        .concat(availableGuilds.guildOfficer)
        .concat(availableGuilds.guildMember);
      const guildsWithValues = guilds.map((guild) => {
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
        <Stack>
          <Title pt='md' pb='-1rem' order={3}>
            Current Members
          </Title>
          <UsersRolesTable data={currentGuildMembers?.Admin} role='Admin' />
          {currentGuildMembers?.officers.length! > 0 && (
            <UsersRolesTable data={currentGuildMembers?.officers} role='Officer' />
          )}
          {currentGuildMembers?.members.length! > 0 && (
            <UsersRolesTable data={currentGuildMembers?.members} role='Member' />
          )}
          {currentGuildMembers?.pending.length! > 0 && (
            <>
              <Title pt='lg' order={3}>
                Pending Requests
              </Title>
              <UsersRolesTable data={currentGuildMembers?.pending} role='Pending' />
            </>
          )}
        </Stack>
        <Stack>
          <Divider />
          <Flex justify='space-between' w='100%'>
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
            <Button
              variant='subtle'
              onClick={() => {
                openConfirmModal({
                  title: "Are you sure?",
                  children: (
                    <Text size='sm'>
                      Are you sure you want to quit this guild? If you wish to rejoin, you will need to reapply in
                      the guild directory and an admin or officer will have to reapprove your membership.
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
                  },
                  onCancel: () => {},
                });
              }}
            >
              Leave Guild
            </Button>
          </Flex>
        </Stack>
      </Stack>
    );
  }
};
export default ManageUsers;
