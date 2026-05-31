import {
  $create,
  $getState,
  $getStateChange,
  $setState,
  type EditorConfig,
  type LexicalNode,
  createState,
  ParagraphNode,
} from "lexical";

export const DEFAULT_COLOR = "var(--color-text)";
export const DEFAULT_BG = "transparent";

const backgroundColorState = createState("backgroundColor", {
  parse: (value) => (typeof value === "string" ? value : DEFAULT_BG),
});

export class CustomParagraphNode extends ParagraphNode {
  $config() {
    return this.config("custom-paragraph", {
      extends: ParagraphNode,
      stateConfigs: [{ flat: true, stateConfig: backgroundColorState }],
    });
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);

    element.style.backgroundColor = $getState(this, backgroundColorState);
    element.className = "px-1 rounded-md";

    return element;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    if (super.updateDOM(prevNode, dom, config)) {
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

  isSimpleText(): boolean {
    return true;
  }
}

export function $createCustomParagraphNode(
  backgroundColor: string = DEFAULT_BG,
): CustomParagraphNode {
  const node = $create(CustomParagraphNode);

  $setState(node, backgroundColorState, backgroundColor);

  return node;
}

export function $isCustomParagraphNode(
  node: LexicalNode | null | undefined,
): node is CustomParagraphNode {
  return node instanceof CustomParagraphNode;
}
