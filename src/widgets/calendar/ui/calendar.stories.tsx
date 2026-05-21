import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Calendar from "./Calendar";

const meta: Meta<typeof Calendar> = {
  title: "Виджеты/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => (
    <div className="w-[900px] h-[700px]">
      <Calendar />
    </div>
  ),
};

export const WithEvents: Story = {
  render: () => (
    <div className="w-[900px] h-[700px]">
      <Calendar />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Календарь с отображением событий и участников. События показываются в соответствующих временных слотах с аватарами участников. Добавлена навигация по неделям.',
      },
    },
  },
};

export const WeekNavigation: Story = {
  render: () => (
    <div className="w-[800px] h-[700px]">
      <Calendar />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация навигации по неделям. Используйте кнопки "Предыдущая неделя", "Текущая неделя" и "Следующая неделя" для перемещения между неделями.',
      },
    },
  },
};
