import { $getState, $setState, createState, type LexicalNode } from "lexical";

export const blockIdState = createState("blockId", {
  parse: (value) => (typeof value === "string" ? value : null),
});

export const blockOrderState = createState("blockOrder", {
  parse: (value) => (typeof value === "number" ? value : 1),
});

export const blockTempIdState = createState("blockTempId", {
  parse: (value) => (typeof value === "string" ? value : null),
});

export const parentBlockIdState = createState("parentBlockId", {
  parse: (value) => (typeof value === "string" ? value : null),
});

// --- Utils for getting and setting block state on LexicalNode ---

export function getBlockId(node: LexicalNode): string | null {
  return $getState(node, blockIdState);
}

export function setBlockId(node: LexicalNode, id: string): void {
  $setState(node, blockIdState, id);
}

export function getBlockTempId(node: LexicalNode): string | null {
  return $getState(node, blockTempIdState);
}

export function setBlockTempId(node: LexicalNode, tempId: string | null): void {
  $setState(node, blockTempIdState, tempId);
}

export function getBlockOrder(node: LexicalNode): number {
  return $getState(node, blockOrderState);
}

export function setBlockOrder(node: LexicalNode, order: number): void {
  $setState(node, blockOrderState, order);
}

export function setParentBlockId(
  node: LexicalNode,
  parentId: string | null,
): void {
  $setState(node, parentBlockIdState, parentId);
}

export function getParentBlockId(node: LexicalNode): string | null {
  return $getState(node, parentBlockIdState);
}
