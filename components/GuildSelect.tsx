import { Group, Avatar, Text, Select, createStyles } from "@mantine/core";
import { forwardRef, useEffect } from "react";
import { useGuildStore } from "../utils/store/store";

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
  const [currentGuild, availableGuilds, setCurrentGuild] = useGuildStore((state) => [
    state.currentGuild,
    state.availableGuilds,
    state.setCurrentGuild,
  ]);

  return (
    <>
      <Select
        onChange={(value) => {
          setCurrentGuild(value);
        }}
        value={currentGuild}
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
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.violet[9] : theme.colors.violet[1],
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
