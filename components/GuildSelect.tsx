import { Group, Avatar, Text, Select, createStyles } from "@mantine/core";
import { forwardRef } from "react";
import { useGuildStore, useNavBarStore } from "../utils/store/store";

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
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, name, adminId, id, ...others }: ItemProps, ref) => (
    <div key={id} ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />
        <Text size='sm'>{name}</Text>
      </Group>
    </div>
  )
);

export default function GuildSelect() {
  const { classes } = useStyles();
  const [currentGuildID, availableGuilds, setCurrentGuildID, setCurrentGuildName] = useGuildStore((state) => [
    state.currentGuildID,
    state.availableGuilds,
    state.setCurrentGuildID,
    state.setCurrentGuildName,
  ]);
  const [setNavBar] = useNavBarStore((state) => [state.setNavBar]);

  return (
    <>
      <Select
        onChange={(value) => {
          setCurrentGuildID(value);
          const selectedGuild = availableGuilds.find((guild: any) => guild.id === value);
          localStorage.setItem("currentGuild", JSON.stringify(selectedGuild));
          setCurrentGuildName(selectedGuild!.name);
        }}
        onClick={() => setNavBar(false)}
        value={currentGuildID}
        classNames={{ input: classes.input }}
        placeholder='Select a Guild'
        nothingFound='No guilds found'
        data={(availableGuilds as any) || []}
        itemComponent={SelectItem}
        styles={(theme) => ({
          item: {
            // applies styles to selected item
            "&[data-selected]": {
              "&, &:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors[theme.primaryColor][7]
                    : theme.colors[theme.primaryColor][1],
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
