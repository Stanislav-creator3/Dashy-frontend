import { FlattenedItem } from "@/widgets/sidebar/model/types";
import { UniqueIdentifier } from "@dnd-kit/abstract";

function getMaxDepth(
  targetItem: FlattenedItem,
  previousItem: FlattenedItem | undefined,
  collapsedIds: Set<UniqueIdentifier>,
) {
  if (!previousItem) return 0;

  if (collapsedIds.has(previousItem.id)) {
    return previousItem.depth;
  }

  return previousItem.depth + 1;
}

function getMinDepth(nextItem: FlattenedItem) {
  return nextItem ? nextItem.depth : 0;
}

export function getProjection(
  items: FlattenedItem[],
  targetId: UniqueIdentifier,
  projectedDepth: number,
  collapsedIds: Set<UniqueIdentifier>,
) {
  const targetItemIndex = items.findIndex(({ id }) => id === targetId);
  const previousItem = items[targetItemIndex - 1];
  const targetItem = items[targetItemIndex];
  const nextItem = items[targetItemIndex + 1];
  const maxDepth = getMaxDepth(targetItem, previousItem, collapsedIds);
  const minDepth = getMinDepth(nextItem);
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = items
      .slice(0, targetItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  }
}
