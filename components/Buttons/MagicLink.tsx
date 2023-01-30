import { Button, ButtonProps } from "@mantine/core";
import { IconMailbox } from "@tabler/icons";

export function MagicLinkButton({ onClick, ...props }: { onClick: (e: any) => void } & ButtonProps) {
  return <Button onClick={onClick} leftIcon={<IconMailbox />} variant='default' color='gray' {...props} />;
}
