import { blocksApi } from "@/features/editor/api/blocks.api";
import { Container } from "@/shared/ui";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Cover } from "@/widgets/cover";
import { pagesApi } from "@/entities/pages/api/pages.api";
import PageClient from "./PageClient";
import { IPage } from "@/entities/pages/model/page.types";
import { cookies } from "next/headers";
import { BASE_API_URL } from "@/shared/config/api";
import { Metadata } from "next";
import { emojiToFavicon } from "@/shared/utils/emojiToFavicon";
import { getMediaSource } from "@/shared/utils/get-media-source";

interface IParams {
  id: string;
  pageId: string;
}

async function getPage(
  id: string,
  pageId: string,
  includeCredentials: boolean = true,
): Promise<IPage> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeCredentials) {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();
    if (cookie) {
      headers.Cookie = cookie;
    }
  }

  const response = await fetch(`${BASE_API_URL}/${id}/pages/${pageId}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Ошибка сервера" }));
    throw new Error(errorData.message || "Страница не найден");
  }

  return await response.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<IParams>;
}): Promise<Metadata> {
  const { id, pageId } = await params;
  try {
    const page = await getPage(id, pageId);
    let icon;
    if (page.icon) {
      icon = page.icon?.startsWith("/")
        ? getMediaSource(page.icon)
        : emojiToFavicon(page.icon);
    }
    return {
      title: page.title + " | Dashly",
      icons: {
        icon: icon,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Страница не найден",
      description: "Страница с указанным ID не найден",
    };
  }
}

export default async function Page({ params }: { params: Promise<IParams> }) {
  const { id: projectId, pageId } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(blocksApi.getBlocks(pageId));

  await queryClient.prefetchQuery(
    pagesApi.getByIdPage({ id: pageId, projectId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="glass-card h-[calc(100vh-24px)] p-2">
        <div
          id={"editor-root"}
          className="relative bg-editor rounded-2xl w-full overflow-scroll h-full"
        >
          <Cover projectId={projectId} pageId={pageId} />
          <Container className="relative p-5" maxWidth="md">
            <PageClient pageId={pageId} projectId={projectId} />
          </Container>
        </div>
      </div>
    </HydrationBoundary>
  );
}
