import { useState } from "react";
import { createStyles, Textarea } from "@mantine/core";
import type { TextareaProps } from "@mantine/core";
import { useEffect } from "react";

const useStyles = createStyles((theme, { floating }: { floating: boolean }) => ({
  root: {
    position: "relative",
  },

  label: {
    position: "absolute",
    zIndex: 2,
    top: 7,
    left: theme.spacing.sm,
    pointerEvents: "none",
    color: floating
      ? theme.colorScheme === "dark"
        ? theme.white
        : theme.black
      : theme.colorScheme === "dark"
      ? theme.colors.dark[3]
      : theme.colors.gray[5],
    transition: "transform 150ms ease, color 150ms ease, font-size 150ms ease",
    transform: floating ? `translate(-${theme.spacing.sm}px, -28px)` : "none",
    fontSize: floating ? theme.fontSizes.xs : theme.fontSizes.sm,
    fontWeight: floating ? 500 : 400,
  },

  required: {
    transition: "opacity 150ms ease",
    opacity: floating ? 1 : 0,
  },

  input: {
    "&::placeholder": {
      transition: "color 150ms ease",
      color: !floating ? "transparent" : undefined,
    },
  },
}));

function FloatingDBLabelTextarea({
  value: initialValue,
  onChange,
  debounce = 500,
  forwardedRef,
  ...props
}: { onChange: (change: string) => void; debounce?: number; forwardedRef: any } & TextareaProps &
  Omit<TextareaProps, "onChange">) {
  const [focused, setFocused] = useState(false);
  // function inputValueChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
  //   props.inputValueChange(event.currentTarget.value);
  // }
  const [value, setValue] = useState<any>(initialValue);
  const valueCheck = value ? value : "";
  //sends a true or false to the useStyles function based on the value of the input/focus
  const { classes } = useStyles({ floating: valueCheck.trim().length !== 0 || focused });

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, value]);

  return (
    <Textarea
      {...props}
      ref={forwardedRef || undefined}
      autosize
      minRows={props.minRows || undefined}
      maxRows={props.maxRows || undefined}
      placeholder={props.placeholder || undefined}
      label={props.label || undefined}
      classNames={classes}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      mt='md'
    />
  );
}

export default FloatingDBLabelTextarea;
