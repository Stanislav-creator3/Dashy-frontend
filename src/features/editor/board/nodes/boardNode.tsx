import { PAGE_TYPE } from "@/entities/pages/model/page.types";
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
import BoardView from "../ui/BoardView";

export interface IBoardNodeProps {
  projectId?: string;
}

const propsState = createState("props", {
  parse: (value) =>
    typeof value === "object" && value !== null
      ? (value as IBoardNodeProps)
      : {},
});

export class BoardNode extends DecoratorNode<ReactNode> {
  $config() {
    return this.config("board", {
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

  getProps(): IBoardNodeProps {
    return $getState(this, propsState);
  }

  setProps(props: IBoardNodeProps) {
    $setState(this, propsState, props);
  }

  decorate(): ReactNode {
    return <BoardView {...$getState(this, propsState)} />;
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

export function $createBoardNode(): BoardNode {
  const node = $create(BoardNode);
  return node;
}

export function $isBoardNode(
  node: LexicalNode | null | undefined,
): node is BoardNode {
  return node instanceof BoardNode;
}
