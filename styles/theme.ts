import { MantineTheme, createStyles } from "@mantine/core";

//@ts-ignore
const theme: MantineTheme = {
  colorScheme: "dark",
  fontFamily: "Lato, sans-serif",
};

export const useStyles = createStyles((theme) => ({
  tHeader: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default theme;
