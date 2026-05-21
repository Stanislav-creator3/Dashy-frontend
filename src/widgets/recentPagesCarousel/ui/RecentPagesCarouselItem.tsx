import UserAvatar from "@/shared/ui/userAvatar/UserAvatar";
import { getMediaSource } from "@/shared/utils/get-media-source";
import { getIcon } from "@/shared/utils/getIcon";
import { renderIcon } from "@/shared/utils/renderIcon";
import Link from "next/link";
import TimeAgo from "react-timeago";

export default function RecentPagesCarouselItem({
  pageId,
  projectId,
  cover,
  title,
  icon,
  avatar,
  username,
  visitedAt,
}: {
  pageId: string;
  projectId: string;
  cover?: string | null;
  title: string;
  icon?: string | null;
  avatar?: string;
  username?: string;
  visitedAt: string | number | Date | null;
}) {
  return (
    <Link key={pageId} href={`/projects/${projectId}/pages/${pageId}`}>
      <div className="flex flex-col justify-between shrink-0 w-36 h-36  gap-1 rounded-lg bg-background">
        <div className="bg-white/80 relative rounded-t-lg w-full h-11">
          {cover && (
            <img
              src={getMediaSource(cover)}
              className="w-full h-11 object-cover object-center rounded-t-lg"
              alt={title}
            />
          )}
          <span className="absolute -bottom-2 left-3.5">
            {icon && renderIcon(getIcon(icon))}
          </span>
        </div>

        <p className="px-5 text-sm">{title}</p>
        <div className="flex items-center gap-3 px-5 py-2">
          <UserAvatar
            size="sm"
            avatar={getMediaSource(avatar)}
            userName={username ?? "Unknown User"}
            alt={username ?? "Unknown User"}
          />

          <span className="text-xs">
            <TimeAgo date={visitedAt!} />
          </span>
        </div>
      </div>
    </Link>
  );
}
