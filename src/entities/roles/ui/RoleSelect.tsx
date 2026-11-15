"use client";

import { cn } from "@/shared/utils/utils";
import DropdownMenu from "@/shared/ui/dropdownMenu/DropdownMenu";
import { IoIosArrowDown } from "react-icons/io";
import { MdCheck } from "react-icons/md";
import { IRole } from "../model/role.types";

interface RoleSelectProps {
  roles: IRole[];
  value: string;
  onChange: (roleId: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function RoleSelect({
  roles,
  value,
  onChange,
  disabled,
  className,
}: RoleSelectProps) {
  const current = roles.find((role) => role.id === value);

  const trigger = (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-text cursor-pointer hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      <span>{current?.name ?? "Выберите роль"}</span>
      <IoIosArrowDown />
    </button>
  );

  if (disabled) return trigger;

  return (
    <DropdownMenu
      enabledClick
      placement="bottom-end"
      zIndex={100}
      trigger={trigger}
      items={roles.map((role) => ({
        label: (
          <div className="flex w-full items-center justify-between gap-3">
            <span>{role.name}</span>
            {role.id === value && <MdCheck />}
          </div>
        ),
        onClick: () => {
          if (role.id !== value) onChange(role.id);
        },
      }))}
    />
  );
}
