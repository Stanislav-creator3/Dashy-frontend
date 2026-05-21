import { IProject } from "@/entities/projects/model/project.types";
import { BASE_API_URL } from "@/shared/config/api";
import { Card, Container, Tabs } from "@/shared/ui";
import { LayoutGroup } from "motion/react";
import { Metadata } from "next";
import { cookies } from "next/headers";

interface IParams {
  id: string;
}

async function getProject(
  id: string,
  includeCredentials: boolean = true,
): Promise<IProject> {
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

  const response = await fetch(`${BASE_API_URL}/projects/${id}`, {
    method: "GET",
    headers,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Ошибка сервера" }));
    throw new Error(errorData.message || "Проект не найден");
  }

  return await response.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<IParams>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const project = await getProject(id);
    return {
      title: "Проект | " + project.name,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Проект не найден",
      description: "Проект с указанным ID не найден",
    };
  }
}

export default async function ProjectHomeLayout({
  params,
  children,
}: {
  params: Promise<IParams>;
  children: React.ReactNode;
}) {
  return (
    <Card className="h-full">
      <Container maxWidth="lg" className="pt-10">{children}</Container>
    </Card>
  );
}
