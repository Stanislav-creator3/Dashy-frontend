import { IProject } from "@/entities/projects/model/project.types";
import { Card } from "@/shared/ui";
import Link from "next/link";

export default function ProjectListItem({ data }: { data: IProject }) {
  return (
    <Link href={`/projects/${data.id}`}>
      <Card className="flex flex-col gap-2 h-full overflow-hidden border-4 transition-[border] duration-300 hover:border-yellow">
        {data.previewImage && (
          <div className="-m-4 mb-1">
            <img
              className="h-[20vh] w-full object-cover object-center"
              src={`http://localhost:4000/${data.previewImage}`}
              alt={data.name}
              loading="lazy"
            />
          </div>
        )}
        <p className="text-3xl">{data.name}</p>
        <p className="text-xl break-words overflow-wrap-anywhere">
          {data.description}
        </p>
      </Card>
    </Link>
  );
}
