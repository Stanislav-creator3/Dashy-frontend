import {
  $create,
  $getState,
  $getStateChange,
  $setState,
  type EditorConfig,
  type LexicalNode,
  TextNode,
  createState,
  IS_BOLD,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_UNDERLINE,
} from "lexical";
import { ITextSegment } from "../model/block.types";

export const DEFAULT_COLOR = "var(--color-text)";
export const DEFAULT_BG = "transparent";

const colorState = createState("color", {
  parse: (value) => (typeof value === "string" ? value : DEFAULT_COLOR),
});

const backgroundColorState = createState("backgroundColor", {
  parse: (value) => (typeof value === "string" ? value : DEFAULT_BG),
});

export class CustomTextNode extends TextNode {
  $config() {
    return this.config("colored", {
      extends: TextNode,

      stateConfigs: [
        { flat: true, stateConfig: colorState },
        { flat: true, stateConfig: backgroundColorState },
      ],
    });
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);

    element.style.color = $getState(this, colorState);
    element.style.backgroundColor = $getState(this, backgroundColorState);

    return element;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    if (super.updateDOM(prevNode, dom, config)) {
      return true;
    }
    const colorChange = $getStateChange(this, prevNode, colorState);

    if (colorChange !== null) {
      dom.style.color = colorChange[0];
    }

    const bgChange = $getStateChange(this, prevNode, backgroundColorState);

    if (bgChange !== null) {
      dom.style.backgroundColor = bgChange[0];
    }

    return false;
  }

  setColor(color: string): void {
    $setState(this, colorState, color);
  }

  setBackgroundColor(color: string): void {
    $setState(this, backgroundColorState, color);
  }

  getColor() {
    return $getState(this, colorState);
  }

  getBackgroundColor() {
    return $getState(this, backgroundColorState);
  }

  getData(): ITextSegment {
    return {
      text: this.getTextContent(),
      color: $getState(this, colorState),
      backgroundColor: $getState(this, backgroundColorState),
      bold: !!(this.getFormat() & IS_BOLD),
      italic: !!(this.getFormat() & IS_ITALIC),
      strikethrough: !!(this.getFormat() & IS_STRIKETHROUGH),
      underline: !!(this.getFormat() & IS_UNDERLINE),
    };
  }

  // Required for Lexical typeahead plugins (slash/mentions/etc).
  // By default custom TextNode types are not treated as "simple text".
  isSimpleText(): boolean {
    return true;
  }
}

export function $createCustomTextNode(
  text: string,
  color: string = DEFAULT_COLOR,
  backgroundColor: string = DEFAULT_BG
): CustomTextNode {
  const node = $create(CustomTextNode).setTextContent(text);

  $setState(node, colorState, color);
  $setState(node, backgroundColorState, backgroundColor);

  return node;
}

export function $isCustomTextNode(
  node: LexicalNode | null | undefined
): node is CustomTextNode {
  return node instanceof CustomTextNode;
}
