import { coverApi } from "@/entities/cover/api/cover.api";
import { Cover } from "@/entities/cover/model/types";
import { useUpdatePage } from "@/entities/pages/hooks/use-update-page";
import { useUploadCover } from "@/entities/pages/hooks/use-upload-cover";
import { SidePanel, Upload } from "@/shared/ui";
import TabsContent from "@/shared/ui/tabs/TabsContent";
import { getMediaSource } from "@/shared/utils/get-media-source";
import { translateCover } from "@/shared/utils/translateCover";
import { useQuery } from "@tanstack/react-query";
import { LayoutGroup } from "motion/react";

function Skeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index}>
          <div className="flex w-35 h-5 rounded-2xl bg-black animate-pulse mb-3 p-1 text-white mb-1" />
          <div className="flex flex-wrap gap-2 max-w-100">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="flex w-30 h-16  rounded-2xl bg-black animate-pulse mb-3 p-1 text-white"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CoverSidePanel({
  isOpen,
  setIsOpen,
  pageId,
  projectId,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  pageId: string;
  projectId: string;
}) {
  const { data, isLoading } = useQuery(coverApi.getCover());
  const { handleUpdate, isPending } = useUpdatePage({ pageId, projectId });
  const { uploadCover, isPending: isPendingUpload } = useUploadCover({
    pageId,
    projectId,
  });

  const categoryCover = data?.reduce<Record<string, Cover[]>>((acc, cover) => {
    const group = cover.category;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(cover);
    return acc;
  }, {});

  return (
    <SidePanel className="max-w-135 w-full" isOpen={isOpen} setIsOpen={setIsOpen}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <LayoutGroup id="CoverPage">
          <TabsContent
            tabs={[
              {
                name: "cover",
                label: "Галерия",
                render: () => (
                  <div className="flex flex-col overflow-scroll gap-3">
                    {categoryCover &&
                      Object.entries(categoryCover).map(
                        ([category, covers]) => (
                          <div key={category} className="flex flex-wrap gap-1">
                            <div className="flex w-full text-xl p-1 text-text">
                              {translateCover({ cover: category })}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {covers.map((cover) => (
                                <button
                                  key={cover.id}
                                  className="cursor-pointer transition-[scale_opacity] duration-200 opacity-100 hover:scale-95 hover:opacity-85 disabled:opacity-80"
                                  onClick={() =>
                                    handleUpdate({
                                      id: pageId,
                                      projectId,
                                      body: { cover: cover.url },
                                    })
                                  }
                                  disabled={isPending}
                                >
                                  <img
                                    src={getMediaSource(cover.url)}
                                    className="object-fill bg-gray w-63.5 h-32 object-[center_50%] rounded-sm"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                  </div>
                ),
              },
              {
                name: "Upload",
                label: "Загрузить",
                render: () => (
                  <Upload
                    isLoading={isPendingUpload}
                    className="h-50"
                    onChange={(file) => {
                      uploadCover({ pageId, projectId, file });
                    }}
                  />
                ),
              },
            ]}
          />
        </LayoutGroup>
      )}
    </SidePanel>
  );
}
