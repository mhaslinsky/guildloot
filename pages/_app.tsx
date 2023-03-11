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
import { ModalsProvider } from "@mantine/modals";
import { AppShell } from "@mantine/core";
import { NavbarSimple } from "../components/NavbarSimple";
import { HeaderSearch } from "../components/HeaderSearch";
import { SessionProvider } from "next-auth/react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { CustomFonts } from "../styles/fonts";
import { RouterTransition } from "../components/RouterTransition";

const inter = Inter({ subsets: ["latin"] });
TimeAgo.addDefaultLocale(en);

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
          <ModalsProvider>
            <NotificationsProvider position='top-right'>
              <CustomFonts />
              <Head>
                <title>Archon Loot Tracker</title>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='stylesheet' href='https://use.typekit.net/ofg4tjx.css' />
                <link rel='icon' href='/favicon.ico' />
              </Head>
              <Script src='https://wow.zamimg.com/js/tooltips.js'></Script>
              <main className={inter.className}>
                <RouterTransition />
                <AppShell header={<HeaderSearch />} navbar={<NavbarSimple />}>
                  <Component {...pageProps} />
                </AppShell>
              </main>
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
        <ReactQueryDevtools position={"bottom-right"} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
