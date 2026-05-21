import { useLineStore } from "../../model/draggableStore";

export function OnDragLine() {
  const line = useLineStore();

  if (!line?.data) {
    return null;
  }

  const scrollOffset = document.body.getBoundingClientRect().top;

  return (
    <div
      className="absolute rounded-sm w-5 h-1 pointer-events-none bg-[#3778d9] "
      style={{
        top: line.data.top + line.data.height - scrollOffset,
        left: line.data.left,
        width: line.data.width,
      }}
    />
  );
}
