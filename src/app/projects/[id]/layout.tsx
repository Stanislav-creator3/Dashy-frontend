import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { collectionsApi } from "@/entities/collections/api/collections.api";
import { SidebarLayout } from "@/widgets/sidebar";
import { ProjectSync } from "@/widgets/ProjectSync";

interface IParams {
  id: string;
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<IParams>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(collectionsApi.getCollections(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectSync projectId={id} />
      <SidebarLayout>{children}</SidebarLayout>
    </HydrationBoundary>
  );
}
