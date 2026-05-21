"use client";

import TimeAgo from "react-timeago";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ruFormatter } from "@/shared/utils/ruFormatter";

interface IPageListItemProps {
  id: string;
  title: string;
  updatedAt: Date;
}

export function PageListItem({ id, title, updatedAt }: IPageListItemProps) {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  return (
    <Link href={`/projects/${projectId}/documents/${id}`}>
      <div>
        <p>{title}</p>
        <p className="text-xl">
          Обновлено:{" "}
          <span className="font-bold">
            <TimeAgo
              date={updatedAt}
              formatter={ruFormatter}
              title=""
              minPeriod={60 * 5}
            />
          </span>
        </p>
      </div>
    </Link>
  );
}
