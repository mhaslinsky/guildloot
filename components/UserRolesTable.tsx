import { Avatar, Table, Group, Text, Select, MediaQuery } from "@mantine/core";
import TimeAgo from "javascript-time-ago";
import { useUpdateGuildMembers } from "../utils/hooks/mutations/useUpdateGuildMembers";
import { openConfirmModal } from "@mantine/modals";
import { useMediaQuery } from "@mantine/hooks";

interface UserObj {
  id: string;
  name: string;
  image: string | null;
  lastSignedIn: Date | null;
}

interface UsersTableProps {
  data: UserObj[] | UserObj | undefined;
  role: string;
}

const rolesData = ["Admin", "Officer", "Member", "Remove"];

export function UsersRolesTable({ data, role }: UsersTableProps) {
  const { mutate: updateGuildMember } = useUpdateGuildMembers();
  const isMobile = useMediaQuery("(max-width: 890px)");
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
          </div>
        </Group>
      </td>
      <td>
        <Select
          onChange={(value) => {
            if (value == "Admin") {
              openConfirmModal({
                title: "Are you sure?",
                children: (
                  <Text size='sm'>
                    Are you sure you want to promote this user to admin? This action is only reversable by the
                    incoming admin and you will have to contact support to recover your guild if given to the wrong
                    user.
                  </Text>
                ),
                labels: {
                  confirm: "Yes, promote",
                  cancel: "No, cancel",
                },
                confirmProps: {
                  color: "red",
                },
                onConfirm: () => {
                  updateGuildMember({ role: value, userID: user.id });
                },
                onCancel: () => {},
              });
            } else if (value == "Remove") {
              openConfirmModal({
                title: "Are you sure?",
                children: <Text size='sm'>Are you sure you want to remove this user?</Text>,
                labels: {
                  confirm: "Yes, get em out of here",
                  cancel: "No, cancel",
                },
                confirmProps: {
                  color: "red",
                },
                onConfirm: () => {
                  updateGuildMember({ role: value, userID: user.id });
                },
                onCancel: () => {},
              });
            } else {
              updateGuildMember({ role: value, userID: user.id });
            }
          }}
          data={rolesData}
          defaultValue={role}
        />
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

  return (
    <Table verticalSpacing='sm' horizontalSpacing='sm'>
      <thead>
        <tr>
          <th></th>
          <th></th>
          {role == "Admin" ? isMobile ? <th></th> : <th>Last active</th> : <th></th>}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
