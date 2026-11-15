"use client";

import DropdownMenu from "@/shared/ui/dropdownMenu/DropdownMenu";
import { cn } from "@/shared/utils/utils";
import { IoIosArrowDown } from "react-icons/io";
import { MdCheck } from "react-icons/md";
import {
  PAGE_ACCESS_NONE,
  TypePageAccessLevel,
} from "../model/pageAccess.schema";

const OPTIONS: { value: TypePageAccessLevel; label: string }[] = [
  { value: PAGE_ACCESS_NONE, label: "Нет доступа" },
  { value: "VIEW", label: "Просмотр" },
  { value: "EDIT", label: "Редактирование" },
];

export default function AccessLevelSelect({
  value,
  onChange,
  disabled,
  ariaLabel,
}: {
  value: TypePageAccessLevel;
  onChange: (value: TypePageAccessLevel) => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const current = OPTIONS.find((option) => option.value === value);

  const trigger = (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-text cursor-pointer hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed",
      )}
    >
      <span>{current?.label}</span>
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
      items={OPTIONS.map((option) => ({
        label: (
          <div className="flex w-full items-center justify-between gap-3">
            <span>{option.label}</span>
            {option.value === value && <MdCheck />}
          </div>
        ),
        onClick: () => {
          if (option.value !== value) onChange(option.value);
        },
      }))}
    />
  );
}
