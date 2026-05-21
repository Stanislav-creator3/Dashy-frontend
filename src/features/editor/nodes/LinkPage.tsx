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
import EditorLinkPage from "../components/editorLinkPage/EditorLinkPage";
import { PAGE_TYPE } from "@/entities/pages/model/page.types";
import {
  blockIdState,
  blockOrderState,
  blockTempIdState,
} from "../model/blockState";

export interface ILinkPageProps {
  href: string;
  text: string;
  icon?: React.ReactNode;
  typePage: PAGE_TYPE;
  pageId?: string;
  projectId?: string;
}

const propsState = createState("props", {
  parse: (value) =>
    typeof value === "object" && value !== null
      ? (value as ILinkPageProps)
      : { href: "", text: "", typePage: PAGE_TYPE.PAGE },
});

export class LinkPageNode extends DecoratorNode<ReactNode> {
  $config() {
    return this.config("link-page", {
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

    return dom;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    return false;
  }

  getProps(): ILinkPageProps {
    return $getState(this, propsState);
  }

  setProps(props: ILinkPageProps) {
    $setState(this, propsState, props);
  }

  decorate(): ReactNode {
    return <EditorLinkPage {...$getState(this, propsState)} />;
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

export function $createLinkPageNode(): LinkPageNode {
  const node = $create(LinkPageNode);
  return node;
}

export function $isLinkPageNode(
  node: LexicalNode | null | undefined,
): node is LinkPageNode {
  return node instanceof LinkPageNode;
}
