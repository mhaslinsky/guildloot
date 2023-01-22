import { MantineTheme, createStyles } from "@mantine/core";

//@ts-ignore
const theme: MantineTheme = {
  colorScheme: "dark",
  fontFamily: "Lato, sans-serif",
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  breakpoints: { xs: 500, sm: 890, md: 1000, lg: 1200, xl: 1400 },
};

export const useStyles = createStyles((theme) => ({
  tHeader: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default theme;
