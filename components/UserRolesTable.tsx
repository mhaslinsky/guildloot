import { Avatar, Badge, Table, Group, Text, Select, ScrollArea, MediaQuery } from "@mantine/core";
import { User } from "../utils/types";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

interface UsersTableProps {
  data: User[] | User | undefined;
  role: string;
}

const rolesData = ["Admin", "Officer", "Member"];

const onSubmit = async () => {};

export function UsersRolesTable({ data, role }: UsersTableProps) {
  const timeAgo = new TimeAgo("en-US");
  if (!data) return <Text></Text>;
  if (!Array.isArray(data)) data = [data];
  const rows = data.map((user) => (
    <tr key={user.name}>
      <td style={{ width: "30%" }}>
        <Group spacing='sm'>
          <Avatar size={40} src={user.image} radius={40} />
          <div>
            <Text size='sm' weight={500}>
              {user.name}
            </Text>
            <Text size='xs' color='dimmed'>
              {user.email}
            </Text>
          </div>
        </Group>
      </td>
      <td>
        <Select data={rolesData} defaultValue={role} />
      </td>
      {
        <MediaQuery smallerThan='sm' styles={{ display: "none" }}>
          {user.lastSignedIn ? (
            <td style={{ width: "20%" }}>{timeAgo.format(new Date(user.lastSignedIn))}</td>
          ) : (
            <td style={{ width: "20%" }}>
              <Text>Never</Text>
            </td>
          )}
        </MediaQuery>
      }
    </tr>
  ));

  console.log(rows);

  return (
    <Table horizontalSpacing='sm'>
      <thead>
        <tr>
          <th></th>
          <th></th>
          {
            <MediaQuery smallerThan='sm' styles={{ display: "none" }}>
              <th>Last active</th>
            </MediaQuery>
          }
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
