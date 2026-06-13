import {
  $create,
  $createParagraphNode,
  $isElementNode,
  $getState,
  $getStateChange,
  $setState,
  createState,
  ElementDOMSlot,
  ElementNode,
  type EditorConfig,
  type RangeSelection,
} from "lexical";
import {
  blockIdState,
  blockOrderState,
  blockTempIdState,
  getBlockId,
  getBlockOrder,
  getBlockTempId,
  setBlockTempId,
} from "../model/blockState";
import {
  getBlockIdFromNode,
  setBlockTempIdForNode,
  setBlockIdForNode,
  setOrderForNode,
} from "../utils/nodeId";
import { createTempId } from "../utils/createTempId";
import { $createCustomParagraphNode } from "./CustomParagraphNode";

export const DEFAULT_BG = "var(--color-gray)";
export const DEFAULT_ICON = "💡";

const iconState = createState("icon", {
  parse: (value) => (typeof value === "string" ? value : DEFAULT_ICON),
});

const backgroundColorState = createState("backgroundColor", {
  parse: (value) => (typeof value === "string" ? value : DEFAULT_BG),
});

export class CalloutNode extends ElementNode {
  getBlockIdFromNode() {
    throw new Error("Method not implemented.");
  }
  $config() {
    return this.config("CalloutNode", {
      extends: ElementNode,

      stateConfigs: [
        { flat: true, stateConfig: blockIdState },
        { flat: true, stateConfig: blockOrderState },
        { flat: true, stateConfig: blockTempIdState },
        { flat: true, stateConfig: iconState },
        { flat: true, stateConfig: backgroundColorState },
      ],
    });
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement("div");
    const content = document.createElement("div");

    dom.dataset.callout = "true";
    dom.className =
      "flex gap-2 my-2 rounded-md py-3 px-5 items-start border border-[color:var(--color-border)]";
    dom.style.backgroundColor = this.getBackgroundColor();

    content.className = "flex flex-col min-w-0 w-full";
    content.dataset.calloutContent = "true";

    const button = document.createElement("button");
    button.type = "button";
    button.contentEditable = "false";
    button.dataset.editorAction = "open-emoji-picker";
    button.dataset.editorTarget = "callout-icon";
    button.dataset.nodeKey = this.getKey();
    button.tabIndex = -1;
    button.className =
      "text-[24px] leading-none cursor-pointer hover:bg-[color:var(--color-hover)] rounded-lg";
    button.textContent = this.getIcon();

    dom.append(button);
    dom.append(content);

    return dom;
  }

  getDOMSlot(element: HTMLElement): ElementDOMSlot<HTMLElement> {
    const content = element.querySelector('[data-callout-content="true"]');
    if (!(content instanceof HTMLElement)) {
      throw new Error("Content element not found in CalloutNode");
    }
    return super.getDOMSlot(element).withElement(content);
  }

  updateDOM(prevNode: this, dom: HTMLElement): boolean {
    const button = dom.querySelector(
      '[data-editor-action="open-emoji-picker"]',
    );
    const iconChange = $getStateChange(this, prevNode, iconState);

    if (button instanceof HTMLButtonElement && iconChange !== null) {
      button.textContent = iconChange[0];
    }

    const backgroundColorChange = $getStateChange(
      this,
      prevNode,
      backgroundColorState,
    );

    if (backgroundColorChange !== null) {
      dom.style.backgroundColor = backgroundColorChange[0];
    }

    return false;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  canBeEmpty(): boolean {
    return true;
  }

  collapseAtStart(_selection: RangeSelection): boolean {
    const children = this.getChildren();

    if (children.length === 0) {
      const paragraph = $createCustomParagraphNode();
      setBlockIdForNode(paragraph, getBlockId(this));
      setBlockTempIdForNode(
        paragraph,
        getBlockTempId(this) ?? getBlockId(this),
      );
      setOrderForNode(paragraph, getBlockOrder(this));
      this.replace(paragraph);
      paragraph.selectStart();
      return true;
    }

    const hasOnlyElementChildren = children.every((child) =>
      $isElementNode(child),
    );

    if (!hasOnlyElementChildren) {
      const paragraph = $createCustomParagraphNode();
      setBlockIdForNode(paragraph, getBlockId(this));
      setBlockTempIdForNode(
        paragraph,
        getBlockTempId(this) ?? getBlockId(this),
      );
      setOrderForNode(paragraph, getBlockOrder(this));

      children.forEach((child) => {
        paragraph.append(child);
      });

      this.replace(paragraph);
      return true;
    }

    const firstChild = children[0];

    if ($isElementNode(firstChild) && !getBlockIdFromNode(firstChild)) {
      setBlockIdForNode(firstChild, getBlockId(this));
      setBlockTempIdForNode(
        firstChild,
        getBlockTempId(this) ?? getBlockId(this),
      );
      setOrderForNode(firstChild, getBlockOrder(this));
    }

    children.forEach((child) => {
      this.insertBefore(child);
    });

    this.remove();
    return true;
  }

  isShadowRoot(): boolean {
    return true;
  }

  setBackgroundColor(color: string): void {
    $setState(this, backgroundColorState, color);
  }

  getBackgroundColor() {
    return $getState(this, backgroundColorState);
  }

  getIcon() {
    return $getState(this, iconState);
  }

  setIcon(icon: string) {
    $setState(this, iconState, icon);
  }
}

export function $createCalloutParagraphNode(parentId?: string) {
  const paragraph = $createCustomParagraphNode();
  const tempId = createTempId(parentId);
  setBlockTempId(paragraph, tempId);
  return paragraph;
}

export function $createCalloutNode(icon = "💡") {
  const node = $create(CalloutNode);
  node.setIcon(icon);
  node.append($createCalloutParagraphNode());

  return node;
}

export function $isCalloutNode(node: unknown): node is CalloutNode {
  return node instanceof CalloutNode;
}
