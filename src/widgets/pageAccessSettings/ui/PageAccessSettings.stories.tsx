import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { http, HttpResponse } from "msw";
import { expect, userEvent, within } from "storybook/test";
import { BASE_API_URL } from "@/shared/config/api";
import {
  ACCESS_LEVEL,
  IPageList,
  PAGE_TYPE,
} from "@/entities/pages/model/page.types";
import { PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";
import PageAccessSettings from "./PageAccessSettings";

const PROJECT_ID = "project-1";

const roles = [
  { id: "owner", name: "Владелец", type: PROJECT_ROLE_TYPE.OWNER },
  { id: "admin", name: "Администратор", type: PROJECT_ROLE_TYPE.ADMIN },
  { id: "member", name: "Участник", type: PROJECT_ROLE_TYPE.CUSTOM },
  { id: "viewer", name: "Наблюдатель", type: PROJECT_ROLE_TYPE.CUSTOM },
  { id: "acct", name: "Бухгалтер", type: PROJECT_ROLE_TYPE.CUSTOM },
];

const role = (id: string) => roles.find((item) => item.id === id)!;

const page = (
  id: string,
  title: string,
  icon: string,
  parentId: string | null,
  children: IPageList[] = [],
): IPageList => ({
  id,
  title,
  icon,
  parentId,
  children,
  access: ACCESS_LEVEL.EDIT,
  type: PAGE_TYPE.PAGE,
  position: 0,
});

const tree = [
  page("home", "Dashly — домой", "🏠", null, [
    page("roadmap", "Roadmap", "🗺️", "home", [
      page("s12", "Спринт 12", "🏃", "roadmap"),
      page("s13", "Спринт 13", "🏁", "roadmap"),
    ]),
    page("docs", "Документы", "📄", "home"),
  ]),
  page("fin", "Финансы", "💰", null),
  page("notes", "Заметки", "📝", null),
];

const access = [
  {
    id: "home",
    inheritAccess: false,
    access: [
      { level: ACCESS_LEVEL.EDIT, role: role("member") },
      { level: ACCESS_LEVEL.VIEW, role: role("viewer") },
    ],
  },
  { id: "roadmap", inheritAccess: true, access: [] },
  { id: "s12", inheritAccess: true, access: [] },
  {
    id: "s13",
    inheritAccess: false,
    access: [{ level: ACCESS_LEVEL.VIEW, role: role("member") }],
  },
  { id: "docs", inheritAccess: true, access: [] },
  {
    id: "fin",
    inheritAccess: false,
    access: [{ level: ACCESS_LEVEL.EDIT, role: role("acct") }],
  },
  { id: "notes", inheritAccess: true, access: [] },
];

const createHandlers = ({
  pages = tree,
  accessList = access,
}: { pages?: unknown[]; accessList?: unknown[] } = {}) => [
  http.get(`${BASE_API_URL}/${PROJECT_ID}/pages`, () =>
    HttpResponse.json(pages),
  ),
  http.get(`${BASE_API_URL}/${PROJECT_ID}/pages/access`, () =>
    HttpResponse.json(accessList),
  ),
  http.get(`${BASE_API_URL}/projects/${PROJECT_ID}/roles`, () =>
    HttpResponse.json(roles),
  ),
  http.put(
    `${BASE_API_URL}/${PROJECT_ID}/pages/access/:id`,
    async ({ request }) => HttpResponse.json(await request.json()),
  ),
];

const meta: Meta<typeof PageAccessSettings> = {
  title: "Виджеты/PageAccessSettings",
  component: PageAccessSettings,
  tags: ["autodocs"],
  args: { projectId: PROJECT_ID },
  parameters: {
    layout: "padded",
    msw: { handlers: createHandlers() },
  },
};

export default meta;

type Story = StoryObj<typeof PageAccessSettings>;

export const Collapsed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText("Roadmap")).toBeInTheDocument();
    await expect(canvas.queryByText("Родитель")).toBeNull();
  },
};

// Спринт 12 наследует права «Dashly — домой» через «Roadmap»
export const Inherit: Story = {
  args: { initialOpenId: "s12" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText("Родитель")).toBeInTheDocument();
    await expect(
      await canvas.findByRole("button", {
        name: "Наследование от родителя",
        pressed: true,
      }),
    ).toBeInTheDocument();
    await expect(
      await canvas.findByText(
        "Действуют права «Dashly — домой» через «Roadmap»",
      ),
    ).toBeInTheDocument();
  },
};

export const OwnAccess: Story = {
  args: { initialOpenId: "s13" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("button", { name: "Свой доступ", pressed: true }),
    ).toBeInTheDocument();
    await expect(
      await canvas.findByRole("button", { name: "Доступ роли Участник" }),
    ).toHaveTextContent("Просмотр");
  },
};

export const RootWithoutParent: Story = {
  args: { initialOpenId: "notes" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText("Видна только владельцу и администраторам"),
    ).toBeInTheDocument();
    await expect(canvas.queryByText("Родитель")).toBeNull();
  },
};

export const ClickExpandsRow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByText("Финансы"));

    await expect(
      await canvas.findByRole("button", { name: "Свой доступ", pressed: true }),
    ).toBeInTheDocument();
    await expect(
      await canvas.findByRole("button", { name: "Доступ роли Бухгалтер" }),
    ).toHaveTextContent("Редактирование");
  },
};

// Кнопки показывают источник доступа. Уровни меняют только при своём доступе
export const InheritToggle: Story = {
  args: { initialOpenId: "s12" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("button", {
        name: "Наследование от родителя",
        pressed: true,
      }),
    ).toBeInTheDocument();
    await expect(
      canvas.queryByRole("button", { name: "Доступ роли Участник" }),
    ).toBeNull();
  },
};

// Уровень роли меняется прямо в раскрытой строке через выпадающее меню
export const ChangeLevelMenu: Story = {
  args: { initialOpenId: "s13" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(
      await canvas.findByRole("button", { name: "Доступ роли Участник" }),
    );

    const items = await body.findAllByRole("menuitem");
    await expect(items.map((item) => item.textContent)).toEqual([
      "Нет доступа",
      "Просмотр",
      "Редактирование",
    ]);
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE_API_URL}/${PROJECT_ID}/pages`, async () => {
          await new Promise(() => {}); // зависает
          return HttpResponse.json([]);
        }),
        http.get(`${BASE_API_URL}/${PROJECT_ID}/pages/access`, async () => {
          await new Promise(() => {}); // зависает
          return HttpResponse.json([]);
        }),
        http.get(`${BASE_API_URL}/projects/${PROJECT_ID}/roles`, async () => {
          await new Promise(() => {}); // зависает
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: { handlers: createHandlers({ pages: [], accessList: [] }) },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText("В проекте пока нет страниц"),
    ).toBeInTheDocument();
  },
};
