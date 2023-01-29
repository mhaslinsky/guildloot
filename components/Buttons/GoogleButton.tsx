import { Button, ButtonProps } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons";

export function GoogleButton({ onClick, ...props }: { onClick: (e: any) => void } & ButtonProps) {
  return <Button onClick={onClick} leftIcon={<IconBrandGoogle />} variant='default' color='gray' {...props} />;
}
