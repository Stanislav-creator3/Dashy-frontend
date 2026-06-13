import { LexicalEditor, RangeSelection } from "lexical";
import { getAllLexicalChildren } from "./getAllLexicalChildren";
import { getPlaceholderText } from "./getPlaceholderText";
import style from "../ui/BlockEditor.module.css";
import { $isListNode } from "@lexical/list";

const PLACEHOLDER_CLASS_NAME = style["node-placeholder"];

const isHtmlHeadingElement = (el: HTMLElement): el is HTMLHeadingElement => {
  return el instanceof HTMLHeadingElement;
};

const isHtmlUListElement = (el: HTMLElement): el is HTMLUListElement => {
  return el instanceof HTMLUListElement;
};

const isHtmlOListElement = (el: HTMLElement): el is HTMLOListElement => {
  return el instanceof HTMLOListElement;
};

export const setPlaceholderOnSelection = ({
  selection,
  editor,
}: {
  selection: RangeSelection;
  editor: LexicalEditor;
}): void => {
  const children = getAllLexicalChildren(editor);

  children.forEach(({ node, htmlElement }) => {
    if (!htmlElement) {
      return;
    }
    if (isHtmlHeadingElement(htmlElement)) return;

    // if ($isListNode(node)) return;

    const classList = htmlElement.classList;
    if (classList.length && classList.contains(PLACEHOLDER_CLASS_NAME)) {
      classList.remove(PLACEHOLDER_CLASS_NAME);
    }
  });

  if (
    children.length === 1 &&
    children[0].htmlElement &&
    !isHtmlHeadingElement(children[0].htmlElement)
  ) {
    return;
  }

  const anchor = selection.anchor;

  console.log(anchor.getNode());
  const placeholder = getPlaceholderText(anchor.getNode());
  if (placeholder) {
    const selectedHtmlElement = editor.getElementByKey(anchor.key);
    selectedHtmlElement?.classList.add(PLACEHOLDER_CLASS_NAME);
    selectedHtmlElement?.setAttribute("data-placeholder", placeholder);
  }
};
