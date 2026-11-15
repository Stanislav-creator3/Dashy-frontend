"use client";

import { usePathname, useSearchParams } from "next/navigation";
import SidebarItem from "./SidebarItem";
import {
  AiOutlineSetting,
  AiOutlineAppstore,
  AiOutlineTeam,
} from "react-icons/ai";
import { BsFilesAlt } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user/api/user.api";
import UserAvatar from "@/shared/ui/userAvatar/UserAvatar";
import { useProjectRole } from "@/entities/projects/hooks/use-project-role";
import { LeaveProjectButton } from "@/features/members";

export default function SettingsNav({ projectId }: { projectId: string }) {
  const { data } = useQuery(userApi.getMe());
  const { member, isOwner, isOwnerOrAdmin } = useProjectRole(projectId);
  const canLeave = !!member && !isOwner;
  const pathname = usePathname();
  const base = `/projects/${projectId}/settings`;

  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const withFrom = (href: string) => {
    if (!from) return href;

    return `${href}?from=${encodeURIComponent(from)}`;
  };

  const items = [
    {
      label: "Аккаунт",
      children: [
        {
          href: withFrom(`${base}/account`),
          matchHref: `${base}/account`,
          label: data?.username ?? "Профиль",
          leading: (
            <UserAvatar
              size="sm"
              avatar={data?.avatar}
              alt={data?.username ?? "User avatar"}
              userName={data?.username ?? "U"}
            />
          ),
        },
        {
          href: withFrom(`${base}`),
          matchHref: `${base}`,
          label: "Приложение",
          leading: <AiOutlineSetting />,
        },
      ],
    },
    {
      label: "Рабочее пространство",
      children: [
        ...(isOwnerOrAdmin
          ? [
              {
                href: withFrom(`${base}/workspace`),
                matchHref: `${base}/workspace`,
                label: "Общее",
                leading: <AiOutlineAppstore />,
              },
            ]
          : []),
        // «Страницы» (доступ к страницам) видят только владелец и админы
        ...(isOwnerOrAdmin
          ? [
              {
                href: withFrom(`${base}/pageAccess`),
                matchHref: `${base}/pageAccess`,
                label: "Страницы",
                leading: <BsFilesAlt />,
              },
            ]
          : []),
        {
          href: withFrom(`${base}/people`),
          matchHref: `${base}/people`,
          label: "Участники и роли",
          leading: <AiOutlineTeam />,
        },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <p className="text-gray p-2">{item.label}</p>
          {item.children.map((child) => (
            <SidebarItem
              key={child.href}
              href={child.href}
              leading={child.leading}
              isActive={pathname === child.matchHref}
            >
              {child.label}
            </SidebarItem>
          ))}
        </div>
      ))}
      <div className="flex h-full flex-1 flex-col gap-1">
        {canLeave && data && (
          <LeaveProjectButton
            className="mt-auto"
            projectId={projectId}
            userId={data.id}
          />
        )}
      </div>
    </div>
  );
}
