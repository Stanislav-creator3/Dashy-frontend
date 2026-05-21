"use client";

import { userApi } from "@/entities/user/api/user.api";
import greeting from "@/shared/utils/greeting";
import { RecentPagesCarousel } from "@/widgets/recentPagesCarousel";
import { useQuery } from "@tanstack/react-query";

export default function ProjectPage() {
  const { data } = useQuery(userApi.getMe());
  return (
    <div className="flex flex-col gap-4">
      {data && (
        <h1 className="text-3xl font-bold text-center">
          {greeting(data.username)}
        </h1>
      )}
      <RecentPagesCarousel />
    </div>
  );
}
