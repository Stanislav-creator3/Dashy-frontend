import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { http, HttpResponse } from "msw";
import { expect, userEvent, within } from "storybook/test";
import { BASE_API_URL } from "@/shared/config/api";
import { PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";
import PeopleSettings from "./PeopleSettings";

const PROJECT_ID = "project-1";

const roles = [
  { id: "role-owner", name: "Владелец", type: PROJECT_ROLE_TYPE.OWNER },
  { id: "role-admin", name: "Администратор", type: PROJECT_ROLE_TYPE.ADMIN },
  { id: "role-member", name: "Участник", type: PROJECT_ROLE_TYPE.CUSTOM },
  { id: "role-viewer", name: "Наблюдатель", type: PROJECT_ROLE_TYPE.CUSTOM },
  { id: "role-accountant", name: "Бухгалтер", type: PROJECT_ROLE_TYPE.CUSTOM },
];

const members = [
  {
    id: "member-1",
    userId: "user-1",
    projectId: PROJECT_ID,
    roleId: "role-owner",
    user: { id: "user-1", email: "stas@example.com", username: "Станислав" },
    role: roles[0],
  },
  {
    id: "member-2",
    userId: "user-2",
    projectId: PROJECT_ID,
    roleId: "role-viewer",
    user: { id: "user-2", email: "maria@example.com", username: "Мария" },
    role: roles[3],
  },
  {
    id: "member-3",
    userId: "user-3",
    projectId: PROJECT_ID,
    roleId: "role-accountant",
    user: { id: "user-3", email: "ivan@example.com", username: null },
    role: roles[4],
  },
];

const project = {
  id: PROJECT_ID,
  name: "Dashly",
  previewImage: null,
  members,
};

// Текущий пользователь определяется по userId из members
const createHandlers = (currentUserId: string) => {
  const me = members.find((member) => member.userId === currentUserId)!.user;

  return [
    http.get(`${BASE_API_URL}/auth`, () => HttpResponse.json(me)),
    http.get(`${BASE_API_URL}/projects/${PROJECT_ID}`, () =>
      HttpResponse.json(project),
    ),
    http.get(`${BASE_API_URL}/projects/${PROJECT_ID}/roles`, () =>
      HttpResponse.json(roles),
    ),
  ];
};

const meta: Meta<typeof PeopleSettings> = {
  title: "Виджеты/PeopleSettings",
  component: PeopleSettings,
  tags: ["autodocs"],
  args: { projectId: PROJECT_ID },
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof PeopleSettings>;

export const Members: Story = {
  parameters: { msw: { handlers: createHandlers("user-1") } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText("Мария")).toBeInTheDocument();
    // У пользователя без имени показывается email
    await expect(await canvas.findByText("Бухгалтер")).toBeInTheDocument();
  },
};

export const RolesOwner: Story = {
  parameters: { msw: { handlers: createHandlers("user-1") } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole("button", { name: "Роли" }));

    await expect(await canvas.findByText("Администратор")).toBeInTheDocument();
    await expect(
      await canvas.findByRole("button", { name: "Создать роль" }),
    ).toBeInTheDocument();
    await expect(
      await canvas.findByRole("button", { name: "Удалить роль Бухгалтер" }),
    ).toBeInTheDocument();
    // Системные роли удалить нельзя
    await expect(
      canvas.queryByRole("button", { name: "Удалить роль Владелец" }),
    ).toBeNull();
  },
};

// Участник с ролью без прав управления видит роли, но не может их менять
export const RolesMember: Story = {
  parameters: { msw: { handlers: createHandlers("user-2") } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText("Мария");
    await userEvent.click(await canvas.findByRole("button", { name: "Роли" }));

    await expect(await canvas.findByText("Бухгалтер")).toBeInTheDocument();
    await expect(
      canvas.queryByRole("button", { name: "Создать роль" }),
    ).toBeNull();
    await expect(
      canvas.queryByRole("button", { name: "Удалить роль Бухгалтер" }),
    ).toBeNull();
  },
};

export const CreateRoleValidation: Story = {
  parameters: { msw: { handlers: createHandlers("user-1") } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(await canvas.findByRole("button", { name: "Роли" }));
    await userEvent.click(
      await canvas.findByRole("button", { name: "Создать роль" }),
    );

    const input = await body.findByPlaceholderText(/Название новой роли/);
    const form = within(input.closest("form")!);

    await userEvent.click(form.getByRole("button", { name: "Создать роль" }));

    await expect(
      await body.findByText("Введите название роли"),
    ).toBeInTheDocument();
  },
};

export const DeleteRoleConfirm: Story = {
  parameters: { msw: { handlers: createHandlers("user-1") } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(await canvas.findByRole("button", { name: "Роли" }));
    await userEvent.click(
      await canvas.findByRole("button", { name: "Удалить роль Бухгалтер" }),
    );

    await expect(
      await body.findByText("Удалить роль «Бухгалтер»?"),
    ).toBeInTheDocument();
  },
};

export const MembersError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE_API_URL}/auth`, () =>
          HttpResponse.json(members[0].user),
        ),
        http.get(`${BASE_API_URL}/projects/${PROJECT_ID}`, () =>
          HttpResponse.json({ message: "Ошибка сервера" }, { status: 500 }),
        ),
        http.get(`${BASE_API_URL}/projects/${PROJECT_ID}/roles`, () =>
          HttpResponse.json(roles),
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText("Ошибка сервера")).toBeInTheDocument();
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE_API_URL}/auth`, async () => {
          await new Promise(() => {}); // зависает
          return HttpResponse.json({});
        }),
        http.get(`${BASE_API_URL}/projects/${PROJECT_ID}`, async () => {
          await new Promise(() => {}); // зависает
          return HttpResponse.json({});
        }),
        http.get(`${BASE_API_URL}/projects/${PROJECT_ID}/roles`, async () => {
          await new Promise(() => {}); // зависает
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};
