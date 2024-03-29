import { QueryClient, QueryKey } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient, removeOldestQuery } from "@tanstack/react-query-persist-client";
import { showNotification } from "@mantine/notifications";
import { ExclamationMark } from "tabler-icons-react";

export let localStoragePersister: any;

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const id = "react-query-error";
  const message = error instanceof Error ? error.message : "error connecting to server";
  showNotification({ title: "Error", message, icon: <ExclamationMark />, color: "red" });
}

export const queryClient = new QueryClient({
  // any query that errors out in the app will be handled by the queryErrorHandler
  //similar to my default HttpError object in the backend of Insta-sham
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
      cacheTime: 86400000, //1 day
      staleTime: 1000 * 1800, //30 minutes
    },
    mutations: { onError: queryErrorHandler },
  },
});

if (typeof window !== "undefined") {
  localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
    retry: removeOldestQuery,
    key: "loottracker",
  });
} else {
  localStoragePersister = createSyncStoragePersister({ storage: undefined });
}

// persistQueryClient({
//   queryClient,
//   persister: localStoragePersister,
//   buster: "mybuster",
//   maxAge: 86400000, //1 day
//   dehydrateOptions: {
//     shouldDehydrateQuery: ({ queryKey }: any) => {
//       //telling RQ to only dehydrate(persist) the user data in cache
//       if (queryKey.toString().includes("user")) {
//         return true;
//       }
//       return false;
//     },
//   },
// });
