import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

const fetchUserInfo = async () => {
  const { data } = await axios({ url: "/api/guild", method: "GET" });
  return data;
};

const useGrabUserInfo = () => {
  return useQuery(["userInfo"], fetchUserInfo, { staleTime: 1000 * 1800 });
};

export { useGrabUserInfo, fetchUserInfo };

// export async function getServerSideProps(context: any) {
//   const queryClient = new QueryClient();
//   const session = await getServerSession(context.req, context.res, authOptions);
//   if (!session) {
//     return { props: {} };
//   }
//   await queryClient.prefetchQuery(["userInfo"], fetchUserInfo);
//   return {
//     props: {},
//   };
// }
