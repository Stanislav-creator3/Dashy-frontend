import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEditorKeys } from "./useEditorKeys";
import { useEffect } from "react";
import styles from "../ui/BlockEditor.module.css";
import { draggableStore, useReset } from "../model/draggableStore";
import { DRAGGABLE_WRAPPER_ID } from "../components/DraggableWrapper";
import { useOnDragEnter } from "./useOnDragEnter";
import { $getNodeByKey, COMMAND_PRIORITY_LOW, DRAGOVER_COMMAND } from "lexical";
import { $isCalloutNode } from "../nodes/CalloutNode";
import { $isBoardNode } from "../board/nodes/boardNode";

export const DRAGGABLE_KEY = "draggable-key";

const setDraggableElement = ({ target }: MouseEvent) => {
  if (!(target instanceof HTMLElement)) return;

  const block = target.closest(`.${styles["draggable-block"]}`);
  if (!(block instanceof HTMLElement)) return;

  const wrapper = document.getElementById(DRAGGABLE_WRAPPER_ID);

  if (!wrapper) return;

  const blockRect = block.getBoundingClientRect();
  const wrapperRect = wrapper.getBoundingClientRect();

  draggableStore.getState().setDraggable({
    htmlElement: block,
    data: {
      top: blockRect.top - wrapperRect.top - wrapper.scrollTop,
      left: blockRect.left - wrapperRect.left - 23,
      height: blockRect.height,
    },
  });
};

export function useDragListeners() {
  const [editor] = useLexicalComposerContext();
  const { keys } = useEditorKeys();
  const reset = useReset();
  const { handleOnDragEnter } = useOnDragEnter();

  useEffect(() => {
    const addListeners = () => {
      keys.forEach((key) => {
        const element = editor.getElementByKey(key);
        const disabled = editor.getEditorState().read(() => {
          const node = $getNodeByKey(key);
          if ($isBoardNode(node)) return;
          if (!node) return false;
          const parent = node.getParent();
          if (!$isCalloutNode(parent)) return false;
          return parent.getFirstChild()?.getKey() === node.getKey();
        });

        if (!element) {
          console.warn("[useDragListeners] Нет элемента html");
          return;
        }

        element.setAttribute(DRAGGABLE_KEY, key);
        if (disabled === false) {
          element.classList.add(styles["draggable-block"]);
        }

        const handleDragElement = disabled ? reset : setDraggableElement;

        element.addEventListener("mouseenter", handleDragElement);
        element.addEventListener("dragover", handleOnDragEnter);
      });
    };

    addListeners();

    const removeListeners = () => {
      keys.forEach((key) => {
        const element = editor.getElementByKey(key);

        if (!element) {
          console.warn("[useDragListeners] No html element");
          return;
        }

        const disabled = editor.getEditorState().read(() => {
          const node = $getNodeByKey(key);
          if (!node) return false;
          if ($isBoardNode(node)) return;
          const parent = node.getParent();
          if (!$isCalloutNode(parent)) return false;
          return parent.getFirstChild()?.getKey() === node.getKey();
        });

        const handleDragElement = disabled ? reset : setDraggableElement;

        element.removeEventListener("mouseenter", handleDragElement);
        element.removeEventListener("dragover", handleOnDragEnter);
      });
    };

    return () => {
      removeListeners();
    };
  }, [editor, keys]);

  useEffect(() => {
    editor.registerCommand(
      DRAGOVER_COMMAND,
      (event) => handleOnDragEnter(event),
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, handleOnDragEnter]);
}
