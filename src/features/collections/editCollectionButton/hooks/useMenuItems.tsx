import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { useParams } from "next/navigation";
import { collectionsApi } from "@/entities/collections/api/collections.api";
import { pagesApi } from "@/entities/pages/api/pages.api";

export const useMenuItems = (collectionId: string) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const projectId = params.id as string;

  const { mutate: mutateDelete } = useMutation({
    mutationFn: collectionsApi.deleteCollection,
  });

  const onClickDelete = () => {
    mutateDelete(collectionId, {
      onSuccess() {
        toast.success("Коллекция успешно удалена", {
          position: "bottom-right",
        });
      },
      onError() {
        toast.error("Произошла ошибка", {
          position: "bottom-right",
        });
      },
      onSettled() {
        queryClient.invalidateQueries(
          collectionsApi.getCollections(`${projectId}`)
        );
        queryClient.invalidateQueries(pagesApi.getAllPages(`${projectId}`));
      },
    });
  };

  const itemMenu = [
    {
      href: `/projects/${projectId}/edit-collection/${collectionId}`,
      label: (
        <p className="flex gap-1 items-center justify-center">
          <span>
            <MdOutlineEdit size={20} />
          </span>
          Изменить
        </p>
      ),
    },
    {
      onClick: () => onClickDelete(),
      label: (
        <p className="flex gap-1 items-center justify-center">
          <span>
            <MdDeleteOutline size={20} />
          </span>
          Удалить коллекцию
        </p>
      ),
    },
  ];

  return itemMenu;
};
