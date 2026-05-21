import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BASE_API_URL } from "@/shared/config/api";
import { http, HttpResponse } from "msw";
import RecentPagesCarousel from "./RecentPagesCarousel";
const meta: Meta<typeof RecentPagesCarousel> = {
  title: "Виджеты/RecentPagesCarousel",
  component: RecentPagesCarousel,
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

type Story = StoryObj<typeof RecentPagesCarousel>;

export const Success: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE_API_URL}/project-1/pages/visit`, ({ request }) => {
          console.log("MSW:", request.url);

          return HttpResponse.json([
            { id: "1", title: "Page 1" },
            { id: "2", title: "Page 2" },
          ]);
        }),
      ],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE_API_URL}/project-1/pages/visit`, async () => {
          await new Promise(() => {}); // зависает
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

// ⏳ Loading (бесконечный запрос)
