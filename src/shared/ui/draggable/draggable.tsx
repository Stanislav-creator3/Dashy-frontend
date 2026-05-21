import { useDraggable } from "@dnd-kit/react";

export default function Draggable({ children }: { children: React.ReactNode }) {
  const { ref } = useDraggable({
    id: "draggable",
  });

  return <div ref={ref}>{children}</div>;
}
