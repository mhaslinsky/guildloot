import { Button, ButtonProps } from "@mantine/core";
import { IconBrandDiscord } from "@tabler/icons";

export function DiscordButton({ onClick, ...props }: { onClick: (e: any) => void } & ButtonProps) {
  return (
    <Button
      onClick={onClick}
      leftIcon={<IconBrandDiscord size={16} />}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? "#5865F2" : "#5865F2",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.fn.lighten("#5865F2", 0.05) : theme.fn.darken("#5865F2", 0.05),
        },
      })}
      {...props}
    />
  );
}
