import { Meta, StoryObj } from "@storybook/nextjs-vite";
import TabsContent from "./TabsContent";

const meta: Meta<typeof TabsContent> = {
  title: "Ui/TabsContent",
  component: TabsContent,
};

export default meta;

type Story = StoryObj<typeof TabsContent>;

const tabs = [
  {
    name: "tab1",
    label: "Tab 1",
    render: () => {
      return (
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt
          eveniet asperiores beatae cumque quae repudiandae sequi expedita eum
          architecto hic. Quidem dolores quaerat nemo pariatur modi aspernatur
          eum blanditiis repellat?
        </p>
      );
    },
  },
  {
    name: "tab2",
    label: "Tab 2",
    render: () => {
      return (
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita in
          non earum natus explicabo est aspernatur porro molestias fugiat eaque
          dignissimos, accusantium qui fugit praesentium ad cumque dolore
          temporibus excepturi.
        </p>
      );
    },
  },
  {
    name: "tab3",
    label: "Tab 3",
    render: () => {
      return (
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis eos
          sequi ducimus voluptas, accusamus amet? Ducimus, velit doloremque
          atque est quidem ullam nisi quod. Aut quisquam ipsa exercitationem
          mollitia ratione?
        </p>
      );
    },
  },
];

export const Default: Story = {
  args: {
    tabs: tabs,
  },
};
