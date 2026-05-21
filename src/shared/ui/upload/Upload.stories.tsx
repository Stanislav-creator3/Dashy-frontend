import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Upload from "./Upload";
import image from "../../../../public/defaultAvatar.png";
import { useState } from "react";

const meta: Meta<typeof Upload> = {
  title: "ui/Upload",
  component: Upload,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Upload>;

const createImageFile = async () => {
  const response = await fetch("/defaultAvatar.png");
  const blob = await response.blob();
  return new File([blob], "defaultAvatar.png", { type: blob.type });
};

export const Default: Story = {
  render: function Render(args) {
    const [file, setFile] = useState<File | null>(null);

    return (
      <div className="w-80 h-80">
        <button
          onClick={async () => {
            const imageFile = await createImageFile();
            setFile(imageFile);
          }}
        >
          Подставить тестовую картинку
        </button>

        <Upload
          {...args}
          value={file}
          onChange={setFile}
          className="w-80 h-80"
        />
      </div>
    );
  },
};
