import { NextPage } from "next";
import { Text } from "@mantine/core";
import { UsersRolesTable } from "../components/UserRolesTable";
import { useGrabGuildMembers } from "../utils/hooks/useGrabGuildMembers";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import { useGuildStore } from "../utils/store/store";
import { useEffect } from "react";

const ManageUsers: NextPage = () => {
  const { data: currentGuildMembers, isLoading, fetchStatus, status } = useGrabGuildMembers();
  const { data: availableGuilds } = useGrabUserInfo();
  const [setAvailableGuilds] = useGuildStore((state) => [state.setAvailableGuilds]);

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
  if (isLoading) return <div>Loading...</div>;
  else {
    return (
      <>
        <UsersRolesTable data={currentGuildMembers?.Admin} role='Admin' />
        {currentGuildMembers?.officers.length! > 0 && (
          <UsersRolesTable data={currentGuildMembers?.officers} role='Officer' />
        )}
        {currentGuildMembers?.members.length! > 0 && (
          <UsersRolesTable data={currentGuildMembers?.members} role='Member' />
        )}
      </>
    );
  }
};
export default ManageUsers;
