import { Group, Avatar, Text, Select } from "@mantine/core";
import { getServerSession } from "next-auth";
import { GetSessionParams } from "next-auth/react";
import { useEffect, useState, forwardRef } from "react";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  name: string;
  adminId: string;
  id: string;
}

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ image, name, adminId, id, ...others }: ItemProps, ref) => (
  <div key={id} ref={ref} {...others}>
    <Group noWrap>
      <Avatar src={image} />
      <div>
        <Text size='sm'>{name}</Text>
      </div>
    </Group>
  </div>
));

export default function GuildSelect() {
  const { data: userData } = useGrabUserInfo();
  const [availableGuilds, setAvailableGuilds] = useState([]);
  const [selectedGuild, setSelectedGuild] = useState();

  useEffect(() => {
    if (userData) {
      const guilds = userData.guildAdmin.concat(userData.guildOfficer).concat(userData.guildMember);
      const guildsWithValues = guilds.map((guild: any) => {
        return {
          value: guild.name,
          image: guild.image,
          name: guild.name,
          adminId: guild.adminId,
          id: guild.id,
        };
      });
      console.log(guildsWithValues);
      setAvailableGuilds(guildsWithValues);
    }
  }, [userData]);

  return (
    <Select
      placeholder='Select Guild'
      itemComponent={SelectItem}
      nothingFound='No guilds found'
      value={selectedGuild}
      data={availableGuilds}
      styles={(theme) => ({
        item: {
          // applies styles to selected item
          "&[data-selected]": {
            "&, &:hover": {
              backgroundColor: theme.colorScheme === "dark" ? theme.colors.teal[9] : theme.colors.teal[1],
              color: theme.colorScheme === "dark" ? theme.white : theme.colors.teal[9],
            },
          },

          // applies styles to hovered item (with mouse or keyboard)
          "&[data-hovered]": {},
        },
      })}
    />
  );
}
