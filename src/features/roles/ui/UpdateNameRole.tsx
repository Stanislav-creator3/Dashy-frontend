"use client";

import { IRole, PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";
import { TextField } from "@/shared/ui/textField/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { useUpdateRole } from "../hooks/use-update-role";
import { createRoleSchema, TypeCreateRoleSchema } from "../model/role.schema";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { AnimatePresence, motion } from "motion/react";

export default function UpdateNameRole({
  projectId,
  role,
}: {
  projectId: string;
  role: IRole;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const ref = useOutsideClick<HTMLFormElement>(() => setIsEdit(false));
  const { updateRole, isPending } = useUpdateRole({ projectId });

  const form = useForm<TypeCreateRoleSchema>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { name: role.name },
  });

  const open = () => {
    form.reset({ name: role.name });
    setIsEdit(true);
  };

  const cancel = () => {
    form.reset({ name: role.name });
    setIsEdit(false);
  };

  const onSubmit = ({ name }: TypeCreateRoleSchema) => {
    if (name === role.name) return cancel();

    updateRole(
      { roleId: role.id, name },
      { onSuccess: () => setIsEdit(false) },
    );
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!isEdit ? (
        <motion.div
          key="button"
          className="flex items-center gap-2"
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
        >
          <p>{role.name}</p>
          <button
            type="button"
            className="cursor-pointer bg-transparent hover:bg-bg-hover rounded-lg p-1"
            aria-label={`Переименовать роль ${role.name}`}
            onClick={open}
          >
            <MdOutlineEdit size={18} />
          </button>
        </motion.div>
      ) : (
        <motion.form
          key={"edit"}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          ref={ref}
          className="flex items-center justify-center gap-2 "
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <TextField
                textSize="text-base"
                autoFocus
                error={form.formState.errors.name?.message}
                disabled={isPending}
                onKeyDown={(event) => {
                  if (event.key === "Escape") cancel();
                }}
                {...field}
              />
            )}
          />
          <div className="flex items-center justify-center gap-0.5">
            <button
              type="submit"
              className="cursor-pointer text-green-500 disabled:opacity-50"
              aria-label="Сохранить"
              disabled={isPending}
            >
              <IoIosCheckmarkCircleOutline size={22} />
            </button>
            <button
              type="button"
              className="cursor-pointer text-red-500 disabled:opacity-50"
              aria-label="Отмена"
              disabled={isPending}
              onClick={cancel}
            >
              <IoIosCloseCircleOutline size={22} />
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
