"use client";

import { usePathname, useSearchParams } from "next/navigation";
import SidebarItem from "./SidebarItem";
import {
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineAppstore,
} from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user/api/user.api";
import { getMediaSource } from "@/shared/utils/get-media-source";
import UserAvatar from "@/shared/ui/userAvatar/UserAvatar";

export default function SettingsNav({ projectId }: { projectId: string }) {
  const { data } = useQuery(userApi.getMe());
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
              avatar={getMediaSource(data?.avatar)}
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
        {
          href: withFrom(`${base}/workspace`),
          matchHref: `${base}/workspace`,
          label: "Общее",
          leading: <AiOutlineAppstore />,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
}
