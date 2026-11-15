"use client";

import {
  ACCESS_LEVEL,
  IPageAccessSummary,
  IPageList,
} from "@/entities/pages/model/page.types";
import LevelBadge, { LEVEL_BADGE_STYLES } from "@/entities/pages/ui/LevelBadge";
import { IRole, PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";
import { useUpdatePageAccess } from "@/features/pages/pageAccess";
import { DropdownMenu } from "@/shared/ui";
import { getIcon } from "@/shared/utils/getIcon";
import { renderIcon } from "@/shared/utils/renderIcon";
import { cn } from "@/shared/utils/utils";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { LuKeyRound, LuLock, LuUndo2 } from "react-icons/lu";
import { MdCheck } from "react-icons/md";
import { buildAccessBody, buildInheritBody } from "../model/buildAccessBody";
import { PageNode, ResolvedAccess } from "../model/resolvePageAccess";

const LEVEL_OPTIONS: { level: ACCESS_LEVEL | null; label: string }[] = [
  { level: null, label: "Нет доступа" },
  { level: ACCESS_LEVEL.VIEW, label: "Просмотр" },
  { level: ACCESS_LEVEL.EDIT, label: "Редактирование" },
];

const SOURCE_OPTIONS = [
  { inherit: false, label: "Свой доступ", Icon: LuKeyRound },
  { inherit: true, label: "Наследование от родителя", Icon: LuUndo2 },
];

function getNote(resolved: ResolvedAccess, parent: PageNode | undefined) {
  if (resolved.mode === "own")
    return "Наследование выключено: права заданы для этой страницы";
  if (resolved.mode === "private")
    return "Ни у этой страницы, ни у её родителей нет своих прав: остальные роли её не видят";

  const source = resolved.source!;
  return parent && parent.id !== source.id
    ? `Действуют права «${source.title}» через «${parent.title}»`
    : `Действуют права страницы «${source.title}»`;
}

export default function PageAccessRow({
  projectId,
  node,
  depth,
  parent,
  isOpen,
  isParent,
  isCollapsed,
  roles,
  resolved,
  ownAccess,
  onToggleOpen,
  onToggleCollapse,
}: {
  projectId: string;
  node: IPageList;
  depth: number;
  parent: PageNode | undefined;
  isOpen: boolean;
  isParent: boolean;
  isCollapsed: boolean;
  roles: IRole[];
  resolved: ResolvedAccess;
  // Свои строки страницы. Хранятся и при включённом наследовании
  ownAccess: IPageAccessSummary | undefined;
  onToggleOpen: () => void;
  onToggleCollapse: () => void;
}) {
  const { updatePageAccess, isPending } = useUpdatePageAccess({
    projectId,
    pageId: node.id,
  });
  const inheritAccess = ownAccess?.inheritAccess ?? true;
  const canChangeLevels = resolved.mode === "own";

  const onSetInherit = (inherit: boolean) => {
    updatePageAccess(
      buildInheritBody({
        inherit,
        hasStoredAccess: !!ownAccess?.access.length,
        resolved,
      }),
    );
  };

  const hasChildren = node.children.length > 0;
  const icon = getIcon(node.icon ?? node.type);

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div
        className={cn(
          "rounded-[20px] border transition-colors duration-200",
          isParent
            ? "border-transparent bg-accent-main text-accent-main-foreground"
            : isOpen
              ? "border-border bg-bg-hover/50"
              : "border-transparent hover:bg-bg-hover",
        )}
      >
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          onClick={onToggleOpen}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onToggleOpen();
            }
          }}
          className="flex h-9.5 cursor-pointer select-none items-center gap-1 pr-3 pl-1.5"
        >
          {hasChildren ? (
            <button
              type="button"
              aria-label={isCollapsed ? "Развернуть ветку" : "Свернуть ветку"}
              onClick={(event) => {
                event.stopPropagation();
                onToggleCollapse();
              }}
              className={cn(
                "flex h-6 w-6 cursor-pointer items-center justify-center rounded-full",
                isParent
                  ? "text-accent-main-foreground"
                  : "text-gray hover:bg-border",
              )}
            >
              <IoIosArrowForward
                size={14}
                className={cn(
                  "transition-transform duration-200",
                  !isCollapsed && "rotate-90",
                )}
              />
            </button>
          ) : (
            <span className="h-6 w-6" />
          )}
          <span
            className="flex w-5.5 justify-center text-[15px]"
            style={{ color: node.iconColor }}
          >
            {renderIcon(icon)}
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              (isOpen || isParent) && "font-medium",
            )}
          >
            {node.title}
          </span>
          {isParent && (
            <span className="rounded-full bg-accent-main-foreground px-2 py-0.5 text-[11px] font-semibold text-accent-main">
              Родитель
            </span>
          )}
        </div>

        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]",
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div
            className="min-h-0 overflow-hidden"
            inert={!isOpen}
            aria-hidden={!isOpen}
          >
            <div className="flex flex-col items-start gap-3.5 pt-1.5 pr-4 pb-4 pl-10">
              <div className="flex flex-col items-start gap-1.5">
                {resolved.mode === "private" && (
                  <span
                    className={cn(
                      "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium",
                      LEVEL_BADGE_STYLES.none,
                    )}
                  >
                    <LuLock size={12} />
                    Видна только владельцу и администраторам
                  </span>
                )}
                <span className="text-xs text-gray">
                  {getNote(resolved, parent)}
                </span>
              </div>

              <div
                role="group"
                aria-label="Источник доступа"
                className="inline-flex rounded-full border border-border bg-background p-0.5"
              >
                {SOURCE_OPTIONS.map(({ inherit, label, Icon }) => {
                  const isActive = inheritAccess === inherit;

                  return (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={isActive}
                      disabled={isPending}
                      onClick={() => !isActive && onSetInherit(inherit)}
                      className={cn(
                        "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed",
                        isActive
                          ? "bg-accent-main text-accent-main-foreground"
                          : "text-gray hover:bg-bg-hover",
                      )}
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="self-stretch overflow-hidden rounded-xl border border-border bg-background text-text">
                {roles.map((role, index) => (
                  <div
                    key={role.id}
                    className={cn(
                      "flex h-9.5 items-center justify-between px-3",
                      index > 0 && "border-t border-border",
                    )}
                  >
                    <span>{role.name}</span>
                    {role.type !== PROJECT_ROLE_TYPE.CUSTOM ? (
                      <span className="inline-flex items-center gap-1 text-xs text-gray">
                        <LuLock size={12} />
                        Полный доступ
                      </span>
                    ) : !canChangeLevels ? (
                      <LevelBadge level={resolved.levels.get(role.id)} />
                    ) : (
                      <DropdownMenu
                        enabledClick
                        placement="bottom-end"
                        zIndex={100}
                        trigger={
                          <button
                            type="button"
                            disabled={isPending}
                            aria-label={`Доступ роли ${role.name}`}
                            className="flex cursor-pointer items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <LevelBadge level={resolved.levels.get(role.id)} />
                            <IoIosArrowDown size={12} className="text-gray" />
                          </button>
                        }
                        items={LEVEL_OPTIONS.map(({ level, label }) => ({
                          label: (
                            <div className="flex w-full items-center justify-between gap-3">
                              <span>{label}</span>
                              {(resolved.levels.get(role.id) ?? null) ===
                                level && <MdCheck />}
                            </div>
                          ),
                          onClick: () => {
                            if (
                              (resolved.levels.get(role.id) ?? null) === level
                            )
                              return;
                            updatePageAccess(
                              buildAccessBody({
                                resolved,
                                roleId: role.id,
                                level,
                              }),
                            );
                          },
                        }))}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
