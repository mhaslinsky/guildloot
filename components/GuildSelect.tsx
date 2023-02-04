import { Group, Avatar, Text, Select, createStyles } from "@mantine/core";
import { useEffect, useState, forwardRef } from "react";
import { useGrabUserInfo } from "../utils/hooks/useUserInfo";
import { useCurrentGuildStore } from "../utils/store/store";

const useStyles = createStyles((theme) => ({
  input: { fontSize: theme.fontSizes.xl },
}));

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
  const { classes } = useStyles();
  const { data: userData } = useGrabUserInfo();
  const [availableGuilds, setAvailableGuilds] = useState([]);
  const setCurrentGuild = useCurrentGuildStore((state) => state.setCurrentGuild);

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
  }, [userData]);

  return (
    <>
      <Select
        onChange={(value) => {
          setCurrentGuild(value);
        }}
        classNames={{ input: classes.input }}
        placeholder='Select Guild'
        nothingFound='No guilds found'
        data={availableGuilds}
        itemComponent={SelectItem}
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
    </>
  );
}
