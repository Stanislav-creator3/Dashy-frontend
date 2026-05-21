import { useGetRecentPages } from "@/entities/pages/hooks/use-get-recent-pages";
import { userApi } from "@/entities/user/api/user.api";
import { Carousel } from "@/shared/ui";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import RecentPagesCarouselItem from "./RecentPagesCarouselItem";

export default function RecentPagesCarousel() {
  const { id } = useParams<{ id: string }>();
  const { data: user } = useQuery(userApi.getMe());

  const { data, isLoading } = useGetRecentPages({ projectId: id });
  return (
    <div className="flex flex-col gap-3">
      <p className="text-gray">Недавно посещенные страницы</p>
      <Carousel isLoading={isLoading}>
        {data?.length ? (
          data?.map((page) => (
            <RecentPagesCarouselItem
              key={page.id}
              pageId={page.id}
              projectId={id}
              cover={page.cover}
              title={page.title}
              icon={page.icon}
              avatar={user?.avatar}
              username={user?.username}
              visitedAt={page?.visitedAt}
            />
          ))
        ) : (
          <div className="flex items-center w-full ">
            <div className="w-full p-1 rounded-lg bg-background font-bold text-lg text-text">
              <p>Вы пока не открыли ни одной страницы ✨</p>
              <p>
                Ваша история появится здесь, как только вы начнёте исследовать
                проект.
              </p>
            </div>
          </div>
        )}
      </Carousel>
    </div>
  );
}
