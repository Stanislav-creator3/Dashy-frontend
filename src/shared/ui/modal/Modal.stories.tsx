import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Button from "../button/Button";
import Modal from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Ui/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

const DefaultUsage = (args : {width: 'md' | 'full'}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Header>Modal Header</Modal.Header>
        <Modal.Body>Modal Body</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">Button</Button>
          <Button>Button</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
  
}

export const Default: Story = {
  args: {
    width: 'md'
  },
  render: (args) => { return DefaultUsage(args); }, 

};

