import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BASE_API_URL } from "@/shared/config/api";
import { http, HttpResponse } from "msw";
import ProjectMenu from "./ProjectMenu";
import { useState } from "react";

const meta: Meta<typeof ProjectMenu> = {
  title: "Ui/ProjectMenu",
  component: ProjectMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/projects/project-1",
        query: {},
        segments: [["id", "project-1"]],
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectMenu>;

export const Success: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isOpenCreateProject, setIsOpenCreateProject] = useState(false);
    return (
      <ProjectMenu
        onClosePopover={setIsOpen}
        onOpenCreateProject={() => setIsOpenCreateProject(true)}
      />
    );
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE_API_URL}/projects/project-1`, ({ request }) => {
          console.log("MSW:", request.url);

          return HttpResponse.json({
            username: "john doe",
            avatar: null,
          });
        }),
      ],
    },
  },
};

// ⏳ Loading (бесконечный запрос)
export const Loading: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isOpenCreateProject, setIsOpenCreateProject] = useState(false);
    return (
      <ProjectMenu
        onClosePopover={setIsOpen}
        onOpenCreateProject={() => setIsOpenCreateProject(true)}
      />
    );
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE_API_URL}/projects/project-1`, async () => {
          await new Promise(() => {}); // зависает
          return HttpResponse.json({});
        }),
      ],
    },
  },
};
