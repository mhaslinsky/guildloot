import { Global } from "@mantine/core";

export function CustomFonts() {
  return (
    <Global
      styles={
        [
          // {
          //   "@font-face": {
          //     fontFamily: "transducer, sans-serif",
          //     src: "url('https://use.typekit.net/ofg4tjx.css')",
          //     fontWeight: 100,
          //     fontStyle: "normal",
          //   },
          // },
        ]
      }
    />
  );
}
