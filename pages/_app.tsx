import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "@next/font/google";
import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../utils/queryClient";
import Script from "next/script";
import theme from "../styles/theme";
import { NotificationsProvider } from "@mantine/notifications";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <NotificationsProvider position='top-right'>
          <Head>
            <title>Guild Loot</title>
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <link rel='icon' href='/favicon.ico' />
          </Head>
          {/* <Script>const whTooltips = {colorLinks: true, boxlinks: true, iconizeLinks: true, renameLinks: true};</Script> */}
          <Script src='https://wow.zamimg.com/js/tooltips.js'></Script>
          <main className={inter.className}>
            <Component {...pageProps} />{" "}
          </main>
        </NotificationsProvider>
      </MantineProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
