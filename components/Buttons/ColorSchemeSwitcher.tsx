import { useMantineColorScheme, ActionIcon, Group } from "@mantine/core";
import { SunHigh, Moon } from "tabler-icons-react";

export function ColorSchemeSwitcher() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group position='center' my='xl'>
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size='lg'
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
          color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.blue[6],
        })}
      >
        {colorScheme === "dark" ? <SunHigh size='1.2rem' /> : <Moon size='1.2rem' />}
      </ActionIcon>
    </Group>
  );
}
