import { Html, Head, Main, NextScript } from "next/document";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body>
        <Main />
        <NextScript />
        <ReactQueryDevtools />
      </body>
    </Html>
  );
}
