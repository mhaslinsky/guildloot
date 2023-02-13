import { NextPage } from "next";
import { Text } from "@mantine/core";
import { UsersRolesTable } from "../components/UserRolesTable";
import { useGrabGuildMembers } from "../utils/hooks/useGrabGuildMembers";
import { User } from "../utils/types";

const createIdentifiedArray = (arr: User[] | User, identifier: string) => {
  if (Array.isArray(arr)) {
    return arr.map((member) => ({ name: member, identifier }));
  } else {
    return [{ name: arr, identifier }];
  }
};

const ManageUsers: NextPage = () => {
  const { data: currentGuildMembers, isLoading, fetchStatus, status } = useGrabGuildMembers();

  if (status == "loading" && fetchStatus == "idle") return <div>Select a guild above</div>;
  if (isLoading) return <div>Loading...</div>;
  else {
    console.table("admins: " + currentGuildMembers?.Admin);
    console.table("officers: " + currentGuildMembers?.officers);
    console.table("members: " + currentGuildMembers?.members);

    return (
      <>
        <UsersRolesTable data={currentGuildMembers?.Admin} role='Admin' />
        <UsersRolesTable data={currentGuildMembers?.officers} role='Officer' />
        <UsersRolesTable data={currentGuildMembers?.members} role='Member' />
      </>
    );
  }
};
export default ManageUsers;
