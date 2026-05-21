import { LexicalNode } from "lexical";
import {
  getBlockId,
  getBlockOrder,
  getBlockTempId,
  getParentBlockId,
  setBlockId,
  setBlockOrder,
  setBlockTempId,
  setParentBlockId,
} from "../model/blockState";

export function getBlockIdFromNode(
  node: LexicalNode | null | undefined,
): string | null {
  if (!node) return null;

  return getBlockId(node);
}

export function setBlockTempIdForNode(
  node: LexicalNode | null | undefined,
  tempId: string | null | undefined,
) {
  if (!node || !tempId) return;

  setBlockTempId(node, tempId);
}

export function getBlockTempIdFromNode(
  node: LexicalNode | null | undefined,
): string | null {
  if (!node) return null;

  return getBlockTempId(node);
}

export function setBlockIdForNode(
  node: LexicalNode | null | undefined,
  id: string | null | undefined,
): void {
  if (!node || !id) return;

  setBlockId(node, id);
  return;
}

export function getOrderFromNode(
  node: LexicalNode | null | undefined,
): number | null {
  if (!node) return null;

  return getBlockOrder(node);
}

export function setOrderForNode(
  node: LexicalNode | null | undefined,
  order: number | null | undefined,
): void {
  if (!node || order == null) return;

  setBlockOrder(node, order);
  return;
}

export function getParentBlockIdFromNode(
  node: LexicalNode | null | undefined,
): string | null {
  if (!node) return null;

  return getParentBlockId(node);
}

export function setParentBlockIdForNode(
  node: LexicalNode | null | undefined,
  parentId: string | null | undefined,
): void {
  if (!node) return;

  setParentBlockId(node, parentId ?? null);
  return;
}

export function replaceNodePreservingId(
  oldNode: LexicalNode,
  newNode: LexicalNode,
): void {
  const existingId = getBlockIdFromNode(oldNode);
  const existingTempId = getBlockTempIdFromNode(oldNode);
  const order = getOrderFromNode(oldNode);
  const parentId = getParentBlockIdFromNode(oldNode);

  if (parentId) {
    setParentBlockIdForNode(newNode, parentId);
  }

  if (existingId) {
    setBlockIdForNode(newNode, existingId);
  }

  if (existingTempId) {
    setBlockTempIdForNode(newNode, existingTempId);
  }

  if (order != null) {
    setOrderForNode(newNode, order);
  }
}
