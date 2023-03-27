import { MantineTheme, createStyles, Global } from "@mantine/core";

//@ts-ignore
const theme: MantineTheme = {
  // fontFamily: "Lato, sans-serif",
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  breakpoints: { xs: 500, sm: 890, md: 1000, lg: 1200, xl: 1400 },
  primaryShade: 6,
};

export const useStyles = createStyles((theme) => ({
  tHeader: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default theme;
