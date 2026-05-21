import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "../api/session.api";
import Cookies from "js-cookie";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: sessionApi.logout,
    onSettled: () => {
      queryClient.removeQueries();
      Cookies.remove("session");
    },
  });

  return { logout };
};
