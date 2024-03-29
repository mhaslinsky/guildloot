import type { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider, ColorSchemeProvider, ColorScheme } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../utils/queryClient";
import Script from "next/script";
import theme from "../styles/theme";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { AppShell } from "@mantine/core";
import { NavbarSimple } from "../components/Appshell/NavbarSimple";
import { HeaderSearch } from "../components/Appshell/HeaderSearch";
import { SessionProvider } from "next-auth/react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { RouterTransition } from "../components/RouterTransition";
import { useThemeStore } from "../utils/store/store";

TimeAgo.addDefaultLocale(en);

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [colorScheme, primaryColor, toggleColorScheme] = useThemeStore((state) => [
    state.colorScheme,
    state.primaryColor,
    state.toggleColorScheme,
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Head>
          <title>Archon Loot Tracker</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider withGlobalStyles withNormalizeCSS theme={{ ...theme, colorScheme, primaryColor }}>
            <ModalsProvider>
              <NotificationsProvider position='top-right'>
                <Script src='https://wow.zamimg.com/js/tooltips.js'></Script>
                <RouterTransition />
                <AppShell
                  styles={(theme) => ({
                    main: {
                      minHeight: "unset",
                      height: "calc(100svh - var(--mantine-header-height, 0px) + 56px)",
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
        </ColorSchemeProvider>
        <ReactQueryDevtools position={"bottom-right"} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
