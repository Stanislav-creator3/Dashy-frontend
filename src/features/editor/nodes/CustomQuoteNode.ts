import {
  $create,
  $getState,
  $getStateChange,
  $setState,
  type EditorConfig,
  type LexicalNode,
  createState,
} from "lexical";
import { QuoteNode } from "@lexical/rich-text";

export const DEFAULT_BG = "transparent";

const backgroundColorState = createState("backgroundColor", {
  parse: (value) => (typeof value === "string" ? value : DEFAULT_BG),
});

export class CustomQuoteNode extends QuoteNode {
  $config() {
    return this.config("custom-quote", {
      extends: QuoteNode,
      stateConfigs: [{ flat: true, stateConfig: backgroundColorState }],
    });
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);

    const quoteClassName = config.theme.blockquote;
    if (quoteClassName) {
      element.className = quoteClassName;
    }

    element.style.backgroundColor = $getState(this, backgroundColorState);
    element.classList.add("p-1", "rounded-md");

    return element;
  }

  updateDOM(prevNode: this, dom: HTMLElement): boolean {
    if (super.updateDOM(prevNode, dom)) {
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

export function $createCustomQuoteNode(
  backgroundColor: string = DEFAULT_BG,
): CustomQuoteNode {
  const node = $create(CustomQuoteNode);

  $setState(node, backgroundColorState, backgroundColor);

  return node;
}

export function $isCustomQuoteNode(
  node: LexicalNode | null | undefined,
): node is CustomQuoteNode {
  return node instanceof CustomQuoteNode;
}
