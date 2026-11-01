import {
  $create,
  $getState,
  $setState,
  createState,
  DecoratorNode,
  type EditorConfig,
  type LexicalNode,
} from "lexical";
import { ReactNode } from "react";
import {
  blockIdState,
  blockOrderState,
  blockTempIdState,
} from "../../model/blockState";
import { ImageBlockProps } from "../model/type";
import ImageBlockView from "../ui/ImageBlockView";

const propsState = createState("props", {
  parse: (value): ImageBlockProps =>
    typeof value === "object" && value !== null ? value : {},
});

export class ImageBlockNode extends DecoratorNode<ReactNode> {
  $config() {
    return this.config("image", {
      extends: DecoratorNode,
      stateConfigs: [
        { flat: true, stateConfig: blockIdState },
        { flat: true, stateConfig: blockOrderState },
        { flat: true, stateConfig: blockTempIdState },
        { flat: true, stateConfig: propsState },
      ],
    });
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("div");
    dom.className = "";
    return dom;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    return false;
  }

  getProps(): ImageBlockProps {
    return $getState(this, propsState);
  }

  setProps(props: ImageBlockProps) {
    $setState(this, propsState, props);
  }

  decorate(): ReactNode {
    return (
      <ImageBlockView
        blockId={$getState(this, blockIdState)}
        nodeKey={this.getKey()}
        {...$getState(this, propsState)}
      />
    );
  }

  canMergeWith(): boolean {
    return false;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
  isIsolated(): boolean {
    return true;
  }
}

export function $createImageBlockNode(): ImageBlockNode {
  const node = $create(ImageBlockNode);
  return node;
}

export function $isImageBlockNode(
  node: LexicalNode | null | undefined,
): node is ImageBlockNode {
  return node instanceof ImageBlockNode;
}
