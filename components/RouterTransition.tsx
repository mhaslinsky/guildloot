// components/RouterTransition.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { NavigationProgress, startNavigationProgress, completeNavigationProgress } from "@mantine/nprogress";
import { useNavBarStore } from "../utils/store/store";

export function RouterTransition() {
  const router = useRouter();
  const [isNavBarOpen, toggleNavBar, setNavBar] = useNavBarStore((state) => [
    state.isNavBarOpen,
    state.toggleNavBar,
    state.setNavBar,
  ]);

  useEffect(() => {
    const handleStart = (url: string) => url !== router.asPath && startNavigationProgress();
    const handleComplete = () => completeNavigationProgress();

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", () => {
      handleComplete();
      setNavBar(false);
    });
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", () => {
        handleComplete();
      });
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.asPath, router.events, setNavBar]);

  return <NavigationProgress autoReset={true} />;
}
