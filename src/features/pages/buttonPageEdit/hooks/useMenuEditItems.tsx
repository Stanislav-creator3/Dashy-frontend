import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { pagesApi } from "@/entities/pages/api/pages.api";
import { useSideBarItem } from "@/widgets/sidebar/hooks/useSidebarItem";

export const useMenuEditItems = (
  pageId: string,
  parentId: string | null,
  projectId: string,
  setIsEdit: (value: boolean) => void,
) => {
  const { isOpen, close } = useSideBarItem({ id: parentId });
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: pagesApi.deletePage,
    onMutate: () => {
      queryClient.cancelQueries({
        queryKey: pagesApi.getPageList({ projectId, parentId: parentId })
          .queryKey,
      });
      const prevList = queryClient.getQueryData(
        pagesApi.getPageList({ projectId, parentId: parentId }).queryKey,
      );

      queryClient.setQueryData(
        pagesApi.getPageList({ projectId, parentId: parentId }).queryKey,
        (data) => {
          const dataFilter = data?.filter((item) => item.id !== pageId);
          if (dataFilter?.length === 0) {
            close();
          }
          return dataFilter;
        },
      );

      return { prevList };
    },
    onSuccess: () => {
      toast.success("Страница перенесена в архив", {
        position: "bottom-right",
      });
    },
    onError: (_, __, context) => {
      toast.error("Произошла ошибка", {
        position: "bottom-right",
      });
      if (!context) return;

      queryClient.setQueryData(
        pagesApi.getPageList({ projectId, parentId: parentId }).queryKey,
        context.prevList,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(
        pagesApi.getPageList({ projectId, parentId: parentId }),
      );
    },
  });

  const onClickDelete = () => {
    mutate({ id: pageId, projectId });
  };

  const itemMenu = [
    {
      onClick: () => setIsEdit(true),
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
          Удалить страницу
        </p>
      ),
    },
  ];

  return itemMenu;
};
