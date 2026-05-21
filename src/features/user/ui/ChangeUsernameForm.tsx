"use client";

import { userApi } from "@/entities/user/api/user.api";
import useDebounce from "@/shared/hooks/useDebounce";
import { TextField } from "@/shared/ui/textField/TextField";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function ChangeUsernameForm() {
  const queryClient = useQueryClient();

  const { data } = useQuery(userApi.getMe());
  const [value, setValue] = useState(data?.username ?? "");

  const { mutate } = useMutation({
    mutationFn: userApi.updateUser,
    onSettled: () => {
      queryClient.invalidateQueries(userApi.getMe());
    },
  });
  const debounce = useDebounce((username: string) => {
    mutate({ username });
  }, 1000);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setValue(username);
    debounce(username);
  };
  return (
    <TextField
      label="Предпочитаемое имя"
      onChange={(e) => onChange(e)}
      value={value}
    />
  );
}
