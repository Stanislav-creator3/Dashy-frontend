import { projectsApi } from "@/entities/projects/api/projects.api";
import { Button, Card } from "@/shared/ui";
import { ProjectList } from "@/widgets/projectsList/indext";
import { HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import Link from "next/link";

export default async function ProjectsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(projectsApi.getProjects());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Card className="flex justify-between mb-2">
        <h2 className="text-4xl">Все ваши проекты</h2>
        <Link href={"/projects/create"}><Button>Создать новый</Button></Link>
      </Card>
      <ProjectList />
    </HydrationBoundary>
  );
}
