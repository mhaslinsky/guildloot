import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../utils/queryClient";
import Script from "next/script";
import theme from "../styles/theme";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { AppShell } from "@mantine/core";
import { NavbarSimple } from "../components/NavbarSimple";
import { HeaderSearch } from "../components/HeaderSearch";
import { SessionProvider } from "next-auth/react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { RouterTransition } from "../components/RouterTransition";

TimeAgo.addDefaultLocale(en);

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Head>
          <title>Archon Loot Tracker</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
          <ModalsProvider>
            <NotificationsProvider position='top-right'>
              <Script src='https://wow.zamimg.com/js/tooltips.js'></Script>
              <RouterTransition />
              <AppShell
                styles={(theme) => ({
                  main: {
                    minHeight: "100svh",
                  },
                })}
                header={<HeaderSearch />}
                navbar={<NavbarSimple />}
              >
                <Component {...pageProps} />
              </AppShell>
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
        <ReactQueryDevtools position={"bottom-right"} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
