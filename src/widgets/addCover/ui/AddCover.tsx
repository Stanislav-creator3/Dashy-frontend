import { useUpdatePage } from "@/entities/pages/hooks/use-update-page";
import { BsImage } from "react-icons/bs";

export const COVERS = [
  "/archirecture2.webp",
  "/architecture-painting1.webp",
  "/gradient1.webp",
  "/gradient2.webp",
  "/gradient3.webp",
  "/gradient4.webp",
  "/painting.webp",
];

export default function AddCover({
  pageId,
  projectId,
}: {
  pageId: string;
  projectId: string;
}) {
  const { handleUpdate, isPending } = useUpdatePage({ pageId, projectId });
  const handleClick = () => {
    const caver = COVERS[Math.floor(Math.random() * COVERS.length)];
    handleUpdate({ id: pageId, projectId, body: { cover: caver } });
  };

  const text = isPending ? "Добавляется..." : "Добавить обложку";

  return (
    <button
      disabled={isPending}
      onClick={handleClick}
      className="text-gray flex gap-1 items-center p-1 text-xs cursor-pointer rounded-md transition-bg duration-300 hover:bg-bg-hover"
    >
      <span>
        <BsImage />
      </span>
      <p>{text}</p>
    </button>
  );
}
