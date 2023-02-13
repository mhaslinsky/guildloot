import { Avatar, Badge, Table, Group, Text, Select, ScrollArea } from "@mantine/core";
import { User } from "../utils/types";

interface UsersTableProps {
  data: User[] | User | undefined;
  role: string;
}

const rolesData = ["Admin", "Officer", "Member"];

export function UsersRolesTable({ data, role }: UsersTableProps) {
  if (!data) return <Text></Text>;
  if (!Array.isArray(data)) data = [data];
  const rows = data.map((user) => (
    <tr key={user.name}>
      <td>
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
        <Select data={rolesData} defaultValue={role} variant='unstyled' />
      </td>
      <td>{Math.floor(Math.random() * 6 + 5)} days ago</td>
      <td>
        {Math.random() > 0.5 ? (
          <Badge fullWidth>Active</Badge>
        ) : (
          <Badge color='gray' fullWidth>
            Disabled
          </Badge>
        )}
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing='sm'>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Role</th>
            <th>Last active</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
