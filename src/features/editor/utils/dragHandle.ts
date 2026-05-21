import style from "../ui/BlockEditor.module.css";

const BLOCK_DRAG_HANDLE_CLASS = style["block-drag-handle"];

export function dragHandle(dom: HTMLElement, nodeKey: string) {
  const handle = document.createElement("span");
  handle.className = BLOCK_DRAG_HANDLE_CLASS;
  handle.contentEditable = "false";
  handle.draggable = true;
  handle.textContent = "⋮⋮";
  
  handle.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });

  handle.addEventListener("dragstart", (e) => {
    e.dataTransfer?.setData("text/plain", nodeKey);
    e.stopPropagation();
  });
  dom.prepend(handle);
}
