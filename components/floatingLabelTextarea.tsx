import { useState } from "react";
import { createStyles, Textarea } from "@mantine/core";
import type { TextareaProps } from "@mantine/core";
import { forwardRef } from "react";

type AppProps = {
  inputValueChange: (change: string) => void;
};

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

function FloatingLabelTextarea(props: AppProps & TextareaProps, ref: React.ForwardedRef<HTMLTextAreaElement>) {
  const { children, ...otherProps } = props;
  const [focused, setFocused] = useState(false);
  //sends a true or false to the useStyles function based on the value of the input/focus
  const valueCheck = props.value ? props.value : "";
  //@ts-ignore
  const { classes } = useStyles({ floating: valueCheck.trim().length !== 0 || focused });

  function inputValueChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    props.inputValueChange(event.currentTarget.value);
  }

  return (
    <Textarea
      ref={ref}
      {...otherProps}
      classNames={classes}
      value={props.value}
      onChange={(event) => inputValueChangeHandler(event)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      mt='md'
    />
  );
}

export default forwardRef(FloatingLabelTextarea);
