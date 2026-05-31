import {
  $create,
  $getState,
  $getStateChange,
  $setState,
  type EditorConfig,
  ElementNode,
  type LexicalNode,
  createState,
} from "lexical";

export const DEFAULT_COLOR = "var(--color-text)";
export const DEFAULT_BG = "transparent";

const backgroundColorState = createState("backgroundColor", {
  parse: (value) => (typeof value === "string" ? value : DEFAULT_BG),
});

export type HeadingTagType = "h1" | "h2" | "h3";

const headingTagState = createState("tag", {
  parse: (value) =>
    value === "h1" || value === "h2" || value === "h3" ? value : "h1",
});

export class CustomHeadingNode extends ElementNode {
  $config() {
    return this.config("custom-heading", {
      extends: ElementNode,
      stateConfigs: [
        { flat: true, stateConfig: backgroundColorState },
        { flat: true, stateConfig: headingTagState },
      ],
    });
  }

  createDOM(config: EditorConfig): HTMLElement {
    const tag = this.getTag();
    const element = document.createElement($getState(this, headingTagState));
    const headingClassName = config.theme.heading?.[tag];
    if (headingClassName) {
      element.className = headingClassName;
    }

    element.style.backgroundColor = $getState(this, backgroundColorState);
    element.classList.add("p-1", "rounded-md");

    return element;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    if (prevNode.getTag() !== this.getTag()) {
      return true;
    }

    const bgChange = $getStateChange(this, prevNode, backgroundColorState);

    if (bgChange !== null) {
      dom.style.backgroundColor = bgChange[0];
    }

    return false;
  }

  setBackgroundColor(color: string): void {
    $setState(this, backgroundColorState, color);
  }

  getBackgroundColor() {
    return $getState(this, backgroundColorState);
  }

  getTag(): HeadingTagType {
    return $getState(this, headingTagState);
  }

  setTag(tag: HeadingTagType): void {
    $setState(this, headingTagState, tag);
  }

  isSimpleText(): boolean {
    return true;
  }
}

export function $createCustomHeadingNode(
  tag: HeadingTagType = "h1",
  backgroundColor: string = DEFAULT_BG,
): CustomHeadingNode {
  const node = $create(CustomHeadingNode);
  node.setTag(tag);
  $setState(node, backgroundColorState, backgroundColor);

  return node;
}

export function $isCustomHeadingNode(
  node: LexicalNode | null | undefined,
): node is CustomHeadingNode {
  return node instanceof CustomHeadingNode;
}
