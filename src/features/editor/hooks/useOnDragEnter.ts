import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback } from "react";
import { DRAGGABLE_KEY } from "./useDragListeners";
import { draggableStore } from "../model/draggableStore";
import styles from "../ui/BlockEditor.module.css";
import { DRAGGABLE_WRAPPER_ID } from "../components/DraggableWrapper";

export const useOnDragEnter = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnDragEnter = useCallback(
    (event: DragEvent): boolean => {
      // Without this drop will not work;
      event.preventDefault();

      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        console.error("[On drag enter] CurrentTarget is not Html element");
        return false;
      }

      // Use value that we set before.
      const key = target.getAttribute(DRAGGABLE_KEY);

      if (!key) {
        return false;
      } else {
        console.log(`Lexical node key is ${key}`);
      }

      const element = editor.getElementByKey(key);

      if (!element) {
        console.error("[On drag enter] Element not found");
        return false;
      }

      const coordinates = element.getBoundingClientRect();

      const block = target.closest(`.${styles["draggable-block"]}`);

      if (!(block instanceof HTMLElement)) {
        console.error("[On drag enter] Block not found");
        return false;
      }

      const wrapper = document.getElementById(DRAGGABLE_WRAPPER_ID);

      if (!wrapper) {
        console.error("[On drag enter] Wrapper not found");
        return false;
      }

      const blockRect = block.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      const mouseY = event.clientY;
      const isTopHalf = mouseY < blockRect.top + blockRect.height / 2;
      const top =
        (isTopHalf ? blockRect.top : blockRect.bottom) -
        wrapperRect.top +
        wrapper.scrollTop;

      if (coordinates) {
        draggableStore.getState().setLine({
          htmlElement: element,
          data: {
            top: top,
            left: blockRect.left - wrapperRect.left - 23,
            height: 2,
            width: coordinates.width,
            position: isTopHalf ? "top" : "bottom",
          },
        });
      }

      return true;
    },
    [editor],
  );

  return { handleOnDragEnter };
};
